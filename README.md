# 🦊 Elysia Template

This is a template repository for a GraphQL-API-enhanced server powered by [Elysia](https://elysiajs.com).

## Features

- 🚀 **Modern Stack**: Built with [Bun](https://bun.sh), Elysia, and TypeScript for fast development and runtime performance
- 🧩 **Powerful GraphQL API**:
  - Integration with [PostGraphile](https://postgraphile.org) for auto-generated GraphQL APIs from PostgreSQL schema
  - [GraphQL Yoga](https://the-guild.dev/graphql/yoga-server) for flexible GraphQL server setup and easy access to [Envelop](https://the-guild.dev/graphql/envelop) plugin ecosystem
  - [Grafast](https://grafast.org) for efficient GraphQL execution (query planning)
  - [Relay](https://relay.dev/docs/guides/graphql-server-specification) specification compliance
  - No [N+1 problem](https://hygraph.com/blog/graphql-n-1-problem)
- 🔒 **Security**:
  - [GraphQL Armor](https://escape.tech/graphql-armor) for securing GraphQL endpoints with operation complexity limits, depth limits, and more
  - Schema-wide perimeter authentication support via [`useGenericAuth`](https://the-guild.dev/graphql/envelop/plugins/use-generic-auth)
  - CORS with configurable allowed origins
  - TLS/HTTPS support out of the box
  - GraphQL schema introspection disabled in production environments
- ⚡ **Optimal Performance**:
  - GraphQL parser and validation caching
  - PostgreSQL connection pooling
  - Optimized GraphQL execution
- 🗄️ **Database Management**:
  - [Drizzle ORM](https://orm.drizzle.team) for type-safe database operations
  - Automated migrations with `drizzle-kit`
  - Database seeding for development environments
- 🛠️ **Developer Experience**:
  - Hot reloading during development
  - Code quality with [Biome](https://biomejs.dev)
  - Git hooks with [Husky](https://typicode.github.io/husky)
  - Automated updates with [Renovate](https://docs.renovatebot.com)
  - Easy spin up with [Tilt](https://tilt.dev)
- 🚢 **Production Ready**:
  - Environment-specific configurations
  - Optimized build process
  - OpenTelemetry integration for observability
  - Health check endpoints (`/health`, `/ready`) for container orchestration
  - Graceful shutdown handling (SIGTERM/SIGINT)
  - Security headers, rate limiting, and TLS/HTTPS

## Local Development

First, `cp .env.local.template .env.local` and fill in the values. Then, generate TLS certificates by running `bun src/scripts/generateTlsCert.ts`.

### Building and Running

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

## Testing

```sh
bun test

# or in watch mode
bun test:watch

# or test with coverage reporting
bun test:coverage
```

## License

The code in this repository is licensed under MIT, &copy; Omni LLC. See [LICENSE.md](LICENSE.md) for more information.
