# Elysia Template

This is a template repository for a GraphQL-API-enhanced server powered by [Elysia](https://elysiajs.com/).

## Local Development

First, `cp .env.local.template .env.local` and fill in the values. Then, generate TLS certificates by running `bun src/scripts/generateTlsCert.ts`.

### Building and Running

Install dependencies:

```sh
bun install
```

Setup the database (only required once, to create the database):

```sh
bun db:setup
```

Run database migrations:

```sh
bun db:migrate
```

Run the dev server:

```sh
bun run dev
```

## License

The code in this repository is licensed under MIT, &copy; Omni LLC. See [LICENSE.md](LICENSE.md) for more information.
