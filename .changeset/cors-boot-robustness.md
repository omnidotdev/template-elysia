---
"@omnidotdev/template-elysia": patch
---

Do not crash at boot when `CORS_ALLOWED_ORIGINS` is unset. The scaffold read the origin as `CORS_ALLOWED_ORIGINS!.split(",")`, so every service generated from it crashed at startup when the var was absent. Parse it centrally in `env.config` as `corsAllowedOrigins`, warning and defaulting to the local app origin when unset, so optional config degrades gracefully.
