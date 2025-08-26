import { existsSync, mkdirSync } from "node:fs";
import { exportSchema } from "graphile-export";
import { EXPORTABLE } from "graphile-export/helpers";
import { makeSchema } from "postgraphile";
import { context, sideEffect } from "postgraphile/grafast";
import { replaceInFile } from "replace-in-file";

import graphilePreset from "lib/config/graphile.config";
import { permit } from "lib/permit/permit";

/**
 * Generate a GraphQL schema from a Postgres database.
 * @see https://postgraphile.org/postgraphile/next/exporting-schema
 */
const generateGraphqlSchema = async () => {
  const { schema } = await makeSchema(graphilePreset);

  const generatedDirectory = `${__dirname}/../generated/graphql`;
  const schemaFilePath = `${generatedDirectory}/schema.executable.ts`;

  // create artifacts directory if it doesn't exist
  if (!existsSync(generatedDirectory))
    mkdirSync(generatedDirectory, {
      recursive: true,
    });

  await exportSchema(schema, schemaFilePath, {
    mode: "typeDefs",
    modules: {
      "graphile-export/helpers": { EXPORTABLE },
      "postgraphile/grafast": { context, sideEffect },
      "lib/permit/permit": { permit },
    },
  });

  await replaceInFile({
    files: schemaFilePath,
    from: /\/\* eslint-disable graphile-export\/export-instances, graphile-export\/export-methods, graphile-export\/exhaustive-deps \*\//g,
    to: "// @ts-nocheck",
  });
};

await generateGraphqlSchema()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
