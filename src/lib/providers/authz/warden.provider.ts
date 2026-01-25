import { AUTHZ_API_URL, AUTHZ_ENABLED } from "lib/config/env.config";

import type { AuthzProvider, AuthzTuple } from "./interface";

/** Request timeout in milliseconds */
const REQUEST_TIMEOUT_MS = 5000;

/** Circuit breaker failure threshold before opening */
const CIRCUIT_BREAKER_THRESHOLD = 5;

/** Circuit breaker cooldown in milliseconds before half-open */
const CIRCUIT_BREAKER_COOLDOWN_MS = 30000;

/** Default TTL for permission cache: 5 minutes */
const DEFAULT_CACHE_TTL_MS = 300_000;

type CircuitState = "closed" | "open" | "half-open";

type AuthzEventType =
  | "permission_check"
  | "tuple_write"
  | "tuple_delete"
  | "circuit_open"
  | "circuit_half_open"
  | "circuit_closed";

interface AuthzEvent {
  type: AuthzEventType;
  userId?: string;
  resourceType?: string;
  resourceId?: string;
  permission?: string;
  allowed?: boolean;
  durationMs?: number;
  error?: string;
  tupleCount?: number;
}

interface CacheEntry {
  allowed: boolean;
  expiresAt: number;
}

/**
 * Warden authorization provider.
 * Uses OpenFGA-compatible API for permission checks.
 *
 * Features:
 * - Two-layer caching (request-scoped + TTL cache)
 * - Circuit breaker (fail-closed for security)
 * - Structured JSON logging
 */
class WardenAuthzProvider implements AuthzProvider {
  // Circuit breaker state
  private circuitState: CircuitState = "closed";
  private failureCount = 0;
  private lastFailureTime = 0;

  // Permission cache (TTL-based)
  private permissionCache = new Map<string, CacheEntry>();

  async checkPermission(
    userId: string,
    resourceType: string,
    resourceId: string,
    permission: string,
    requestCache?: Map<string, boolean>,
  ): Promise<boolean> {
    // Permissive when disabled
    if (AUTHZ_ENABLED !== "true") return true;
    if (!AUTHZ_API_URL) return true;

    const cacheKey = this.buildCacheKey(
      userId,
      resourceType,
      resourceId,
      permission,
    );

    // Layer 1: Request-scoped cache
    if (requestCache?.has(cacheKey)) {
      return requestCache.get(cacheKey)!;
    }

    // Layer 2: TTL cache
    const cachedResult = this.getCachedPermission(cacheKey);
    if (cachedResult !== null) {
      requestCache?.set(cacheKey, cachedResult);
      return cachedResult;
    }

    const startTime = Date.now();

    try {
      const allowed = await this.executeWithCircuitBreaker(async () => {
        const response = await fetch(`${AUTHZ_API_URL}/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user: `user:${userId}`,
            relation: permission,
            object: `${resourceType}:${resourceId}`,
          }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        if (!response.ok) {
          throw new Error(`AuthZ check failed: ${response.status}`);
        }

        const result = (await response.json()) as { allowed: boolean };
        return result.allowed;
      });

      // Store in both caches
      requestCache?.set(cacheKey, allowed);
      this.setCachedPermission(cacheKey, allowed);

      this.logEvent({
        type: "permission_check",
        userId,
        resourceType,
        resourceId,
        permission,
        allowed,
        durationMs: Date.now() - startTime,
      });

      return allowed;
    } catch (err) {
      this.logEvent({
        type: "permission_check",
        userId,
        resourceType,
        resourceId,
        permission,
        durationMs: Date.now() - startTime,
        error: err instanceof Error ? err.message : String(err),
      });
      // Fail-closed: deny access when PDP is unavailable
      throw err;
    }
  }

  async writeTuples(tuples: AuthzTuple[]): Promise<void> {
    if (!AUTHZ_API_URL || tuples.length === 0) return;

    const startTime = Date.now();

    try {
      await this.executeWithCircuitBreaker(async () => {
        const response = await fetch(`${AUTHZ_API_URL}/tuples`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tuples }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        if (!response.ok) {
          throw new Error(`AuthZ write tuples failed: ${response.status}`);
        }
      });

      this.logEvent({
        type: "tuple_write",
        tupleCount: tuples.length,
        durationMs: Date.now() - startTime,
      });
    } catch (err) {
      this.logEvent({
        type: "tuple_write",
        tupleCount: tuples.length,
        durationMs: Date.now() - startTime,
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  async deleteTuples(tuples: AuthzTuple[]): Promise<void> {
    if (!AUTHZ_API_URL || tuples.length === 0) return;

    const startTime = Date.now();

    try {
      await this.executeWithCircuitBreaker(async () => {
        const response = await fetch(`${AUTHZ_API_URL}/tuples`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tuples }),
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
        });

        if (!response.ok) {
          throw new Error(`AuthZ delete tuples failed: ${response.status}`);
        }
      });

      this.logEvent({
        type: "tuple_delete",
        tupleCount: tuples.length,
        durationMs: Date.now() - startTime,
      });
    } catch (err) {
      this.logEvent({
        type: "tuple_delete",
        tupleCount: tuples.length,
        durationMs: Date.now() - startTime,
        error: err instanceof Error ? err.message : String(err),
      });
      throw err;
    }
  }

  async healthCheck(): Promise<{ healthy: boolean; message?: string }> {
    if (!AUTHZ_API_URL) {
      return { healthy: false, message: "AUTHZ_API_URL not configured" };
    }

    try {
      const response = await fetch(`${AUTHZ_API_URL}/health`, {
        signal: AbortSignal.timeout(5000),
      });
      return {
        healthy: response.ok,
        message: response.ok ? "OK" : `Status ${response.status}`,
      };
    } catch (error) {
      return {
        healthy: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }

  /**
   * Invalidate cached permissions matching a pattern.
   */
  invalidateCache(pattern: string): void {
    for (const key of this.permissionCache.keys()) {
      if (key.includes(pattern)) {
        this.permissionCache.delete(key);
      }
    }
  }

  /**
   * Clear all cached permissions.
   */
  clearCache(): void {
    this.permissionCache.clear();
  }

  private buildCacheKey(
    userId: string,
    resourceType: string,
    resourceId: string,
    permission: string,
  ): string {
    return `${userId}:${resourceType}:${resourceId}:${permission}`;
  }

  private getCachedPermission(key: string): boolean | null {
    const entry = this.permissionCache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.permissionCache.delete(key);
      return null;
    }

    return entry.allowed;
  }

  private setCachedPermission(
    key: string,
    allowed: boolean,
    ttlMs: number = DEFAULT_CACHE_TTL_MS,
  ): void {
    this.permissionCache.set(key, {
      allowed,
      expiresAt: Date.now() + ttlMs,
    });
  }

  private async executeWithCircuitBreaker<T>(fn: () => Promise<T>): Promise<T> {
    if (this.circuitState === "open") {
      if (Date.now() - this.lastFailureTime > CIRCUIT_BREAKER_COOLDOWN_MS) {
        this.circuitState = "half-open";
        this.logEvent({ type: "circuit_half_open" });
      } else {
        throw new Error("PDP unavailable - circuit open (fail-closed)");
      }
    }

    try {
      const result = await fn();
      this.resetCircuit();
      return result;
    } catch (err) {
      this.recordFailure();
      throw err;
    }
  }

  private resetCircuit(): void {
    if (this.failureCount > 0 || this.circuitState !== "closed") {
      this.logEvent({ type: "circuit_closed" });
    }
    this.failureCount = 0;
    this.circuitState = "closed";
  }

  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = Date.now();

    if (this.failureCount >= CIRCUIT_BREAKER_THRESHOLD) {
      this.circuitState = "open";
      this.logEvent({
        type: "circuit_open",
        error: `Circuit opened after ${this.failureCount} consecutive failures`,
      });
    }
  }

  private logEvent(evt: AuthzEvent): void {
    // biome-ignore lint/suspicious/noConsole: structured logging
    console.log(
      JSON.stringify({ ...evt, timestamp: new Date().toISOString() }),
    );
  }
}

export default WardenAuthzProvider;
