# 🦊 Elysia Template

This is a template repository for a GraphQL-API-enhanced server powered by [Elysia](https://elysiajs.com).

## Features

- 🚀 **Modern Stack**: Built with [Bun](https://bun.sh), [Elysia](https://elysiajs.com), and TypeScript for fast development and runtime performance
- 🧩 **Powerful GraphQL API**:
  - Integration with [PostGraphile](https://postgraphile.org) for auto-generated GraphQL APIs from PostgreSQL schema
  - [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) for flexible GraphQL server setup and easy access to [Envelop](https://the-guild.dev/graphql/envelop) plugin ecosystem
  - [Grafast](https://grafast.org) for efficient GraphQL execution (query planning)
  - [Relay](https://relay.dev/docs/guides/graphql-server-specification) specification compliance
  - [Connection filter plugin](https://github.com/graphile-contrib/postgraphile-plugin-connection-filter) for advanced filtering
  - [Simplify inflection](https://github.com/graphile/simplify-inflection) for cleaner schema naming
  - No [N+1 problem](https://hygraph.com/blog/graphql-n-1-problem)
- 🔒 **Security**:
  - [GraphQL Armor](https://escape.tech/graphql-armor) for securing GraphQL endpoints with operation complexity limits, depth limits, and more
  - Schema-wide perimeter authentication support via [`useGenericAuth`](https://the-guild.dev/graphql/envelop/plugins/use-generic-auth)
  - JWT validation with remote JWKS support via [jose](https://github.com/panva/jose)
  - CORS with configurable allowed origins
  - Rate limiting with [elysia-rate-limit](https://github.com/rayriffy/elysia-rate-limit)
  - TLS/HTTPS support out of the box
  - GraphQL schema introspection disabled in production environments
- ⚡ **Optimal Performance**:
  - GraphQL parser and validation caching via Envelop plugins
  - PostgreSQL connection pooling
  - Optimized GraphQL execution with Grafast
- 🗄️ **Database Management**:
  - [Drizzle ORM](https://orm.drizzle.team) for type-safe database operations
  - Automated migrations with `drizzle-kit`
  - Database seeding with [drizzle-seed](https://orm.drizzle.team/docs/seed) and [Faker.js](https://fakerjs.dev)
  - [Drizzle Studio](https://orm.drizzle.team/drizzle-studio) for visual database management
- 🧪 **Testing**:
  - Unit tests with [Bun test runner](https://bun.sh/docs/cli/test)
  - [Testcontainers](https://testcontainers.com) for isolated PostgreSQL integration tests
  - [MSW (Mock Service Worker)](https://mswjs.io) for API mocking
  - Coverage reporting
- 🛠️ **Developer Experience**:
  - Hot reloading during development
  - Code quality with [Biome](https://biomejs.dev) for linting and formatting
  - Git hooks with [Husky](https://typicode.github.io/husky)
  - TypeScript strict mode with comprehensive type safety
  - [Knip](https://knip.dev) for unused dependency detection
  - Automated updates with [Renovate](https://docs.renovatebot.com)
  - Easy spin up with [Tilt](https://tilt.dev)
- 🚢 **Production Ready**:
  - Environment-specific configurations
  - Optimized build process
  - [OpenTelemetry](https://opentelemetry.io) integration for observability
  - Health check endpoints (`/health`, `/ready`) for container orchestration
  - Graceful shutdown handling (SIGTERM/SIGINT)
  - Security headers, rate limiting, and TLS/HTTPS

## Local Development

First, `cp .env.local.template .env.local` and fill in the values. Then, generate TLS certificates by running `bun src/scripts/generateTlsCert.ts`.

### Building and Running

Run `tilt up`, or:

Install dependencies:

```sh
bun install
```

Set up the database (only required once, to create the database):

```sh
bun db:setup
```

Run database migrations:

```sh
bun db:migrate
```

Run the dev server:

```sh
bun dev
```

### Database Scripts

| Script | Description |
|--------|-------------|
| `bun db:setup` | Create the database (first-time setup) |
| `bun db:generate` | Generate migration files from schema changes |
| `bun db:migrate` | Run pending migrations |
| `bun db:migrate:drop` | Drop a migration |
| `bun db:pull` | Introspect existing database schema |
| `bun db:push` | Push schema changes directly (dev only) |
| `bun db:seed` | Seed database with test data |
| `bun db:studio` | Open Drizzle Studio |

## Testing

```sh
bun test

# or in watch mode
bun test:watch

# or test with coverage reporting
bun test:coverage
```

## License

The code in this repository is licensed under MIT, &copy; [Omni LLC](https://omni.dev). See [LICENSE.md](LICENSE.md) for more information.
