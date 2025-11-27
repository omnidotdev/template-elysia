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
        attribute: {
          title: {
            tags: {
              behavior: "+insert +update +delete",
            },
          },
          description: {
            tags: {
              behavior: "+insert +update +delete",
            },
          },
          author_id: {
            tags: {
              behavior: "+insert",
            },
          },
          updated_at: {
            tags: {
              behavior: "+update",
            },
          },
        },
      },
    },
  },
});
