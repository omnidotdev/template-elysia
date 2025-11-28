import { jsonPgSmartTags } from "postgraphile/utils";

/**
 * Smart tags plugin. See: https://postgraphile.org/postgraphile/5/pg-smart-tags
 */
export const SmartTagsPlugin = jsonPgSmartTags({
  version: 1,
  config: {
    class: {
      post: {
        tags: {
          behavior: "+insert +update +delete",
        },
      },
    },
  },
});
