// @ts-nocheck
import { PgCondition, PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { ConnectionStep, EdgeStep, ExecutableStep, ObjectStep, __ValueStep, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, isExecutableStep, lambda, makeGrafastSchema, node, object, rootValue, sideEffect } from "grafast";
import { GraphQLError, Kind } from "graphql";
import { permit } from "lib/permit/permit";
import { sql } from "pg-sql2";
import { match } from "ts-pattern";
import { inspect } from "util";
const handler = {
  typeName: "Query",
  codec: {
    name: "raw",
    encode: Object.assign(function rawEncode(value) {
      return typeof value === "string" ? value : null;
    }, {
      isSyncAndSafe: true
    }),
    decode: Object.assign(function rawDecode(value) {
      return typeof value === "string" ? value : null;
    }, {
      isSyncAndSafe: true
    })
  },
  match(specifier) {
    return specifier === "query";
  },
  getIdentifiers(_value) {
    return [];
  },
  getSpec() {
    return "irrelevant";
  },
  get() {
    return rootValue();
  },
  plan() {
    return constant`query`;
  }
};
const nodeIdCodecs = {
  __proto__: null,
  raw: handler.codec,
  base64JSON: {
    name: "base64JSON",
    encode: (() => {
      function base64JSONEncode(value) {
        return Buffer.from(JSON.stringify(value), "utf8").toString("base64");
      }
      base64JSONEncode.isSyncAndSafe = !0;
      return base64JSONEncode;
    })(),
    decode: (() => {
      function base64JSONDecode(value) {
        return JSON.parse(Buffer.from(value, "base64").toString("utf8"));
      }
      base64JSONDecode.isSyncAndSafe = !0;
      return base64JSONDecode;
    })()
  },
  pipeString: {
    name: "pipeString",
    encode: Object.assign(function pipeStringEncode(value) {
      return Array.isArray(value) ? value.join("|") : null;
    }, {
      isSyncAndSafe: true
    }),
    decode: Object.assign(function pipeStringDecode(value) {
      return typeof value === "string" ? value.split("|") : null;
    }, {
      isSyncAndSafe: true
    })
  }
};
const nodeIdHandlerByTypeName = {
  __proto__: null,
  Query: handler
};
const executor = new PgExecutor({
  name: "main",
  context() {
    const ctx = context();
    return object({
      pgSettings: "pgSettings" != null ? ctx.get("pgSettings") : constant(null),
      withPgClient: ctx.get("withPgClient")
    });
  }
});
const postIdentifier = sql.identifier("public", "post");
const spec_post = {
  name: "post",
  identifier: postIdentifier,
  attributes: {
    __proto__: null,
    id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    title: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true,
        isIndexed: false
      }
    },
    description: {
      description: undefined,
      codec: TYPES.text,
      notNull: false,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true,
        isIndexed: false
      }
    },
    author_id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true,
        isIndexed: false
      }
    },
    updated_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true,
        isIndexed: false
      }
    }
  },
  description: undefined,
  extensions: {
    oid: "231923",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "post"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
};
const postCodec = recordCodec(spec_post);
const userIdentifier = sql.identifier("public", "user");
const spec_user = {
  name: "user",
  identifier: userIdentifier,
  attributes: {
    __proto__: null,
    id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    identity_provider_id: {
      description: undefined,
      codec: TYPES.uuid,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    },
    created_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true,
        isIndexed: false
      }
    },
    updated_at: {
      description: undefined,
      codec: TYPES.timestamptz,
      notNull: false,
      hasDefault: true,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true,
        isIndexed: false
      }
    }
  },
  description: undefined,
  extensions: {
    oid: "231933",
    isTableLike: true,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "user"
    },
    tags: {
      __proto__: null
    }
  },
  executor: executor
};
const userCodec = recordCodec(spec_user);
const userUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}, {
  isPrimary: false,
  attributes: ["identity_provider_id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null,
      behavior: ["-update", "-delete"]
    }
  }
}];
const registryConfig_pgResources_user_user = {
  executor: executor,
  name: "user",
  identifier: "main.public.user",
  from: userIdentifier,
  codec: userCodec,
  uniques: userUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "user"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {},
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  }
};
const postUniques = [{
  isPrimary: true,
  attributes: ["id"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null
    }
  }
}];
const registryConfig_pgResources_post_post = {
  executor: executor,
  name: "post",
  identifier: "main.public.post",
  from: postIdentifier,
  codec: postCodec,
  uniques: postUniques,
  isVirtual: false,
  description: undefined,
  extensions: {
    description: undefined,
    pg: {
      serviceName: "main",
      schemaName: "public",
      name: "post"
    },
    isInsertable: true,
    isUpdatable: true,
    isDeletable: true,
    tags: {},
    canSelect: true,
    canInsert: true,
    canUpdate: true,
    canDelete: true
  }
};
const registryConfig = {
  pgExecutors: {
    __proto__: null,
    main: executor
  },
  pgCodecs: {
    __proto__: null,
    uuid: TYPES.uuid,
    post: postCodec,
    text: TYPES.text,
    timestamptz: TYPES.timestamptz,
    user: userCodec
  },
  pgResources: {
    __proto__: null,
    user: registryConfig_pgResources_user_user,
    post: registryConfig_pgResources_post_post
  },
  pgRelations: {
    __proto__: null,
    post: {
      __proto__: null,
      userByMyAuthorId: {
        localCodec: postCodec,
        remoteResourceOptions: registryConfig_pgResources_user_user,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["author_id"],
        remoteAttributes: ["id"],
        isUnique: true,
        isReferencee: false,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    },
    user: {
      __proto__: null,
      postsByTheirAuthorId: {
        localCodec: userCodec,
        remoteResourceOptions: registryConfig_pgResources_post_post,
        localCodecPolymorphicTypes: undefined,
        localAttributes: ["id"],
        remoteAttributes: ["author_id"],
        isUnique: false,
        isReferencee: true,
        description: undefined,
        extensions: {
          tags: {
            behavior: []
          }
        }
      }
    }
  }
};
const registry = makeRegistry(registryConfig);
const resource_userPgResource = registry.pgResources["user"];
const resource_postPgResource = registry.pgResources["post"];
const oldPlan = (_$root, {
  $rowId
}) => resource_postPgResource.get({
  id: $rowId
});
const mockIdToken_Jane_Doe = {
  iss: "https://auth.example.com/",
  sub: "550e8400-e29b-41d4-a716-446655440000",
  aud: "template-elysia",
  exp: 1732591385,
  iat: 1732587785,
  auth_time: 1732587700,
  nonce: "n-0S6_WzA2Mj",
  email: "user@example.com",
  email_verified: true,
  name: "Jane Doe",
  given_name: "Jane",
  family_name: "Doe",
  preferred_username: "jdoe"
};
const planWrapper = (plan, _, fieldArgs) => {
  const $postId = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer");
  sideEffect([$postId, $observer], async ([postId, observer]) => {
    if (!postId || !observer) throw new Error("Ooops");
    if (!(await permit.check(mockIdToken_Jane_Doe.sub, "read", "post"))) throw new Error("Permission denied");
  });
  return plan();
};
function qbWhereBuilder(qb) {
  return qb.whereBuilder();
}
function isEmpty(o) {
  return typeof o === "object" && o !== null && Object.keys(o).length === 0;
}
function assertAllowed(value, mode) {
  if (mode === "object" && !true && isEmpty(value)) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !true) {
    const arr = value;
    if (arr) {
      const l = arr.length;
      for (let i = 0; i < l; i++) if (isEmpty(arr[i])) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function oldPlan2() {
  return connection(resource_postPgResource.find());
}
const planWrapper2 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(),
    $observer = context().get("observer");
  sideEffect([$input, $observer], async ([input, observer]) => {
    if (!input.condition.authorId || !observer) throw new Error("Ooops");
    if (!(await permit.check(mockIdToken_Jane_Doe.sub, "read", {
      type: "post",
      attributes: {
        authorId: input.condition.authorId
      }
    }))) throw new Error("Permission denied");
  });
  return plan();
};
function assertAllowed2(value, mode) {
  if (mode === "object" && !true && isEmpty(value)) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !true) {
    const arr = value;
    if (arr) {
      const l = arr.length;
      for (let i = 0; i < l; i++) if (isEmpty(arr[i])) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function assertAllowed3(value, mode) {
  if (mode === "object" && !true && isEmpty(value)) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !true) {
    const arr = value;
    if (arr) {
      const l = arr.length;
      for (let i = 0; i < l; i++) if (isEmpty(arr[i])) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function UUIDSerialize(value) {
  return "" + value;
}
const coerce = string => {
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(string)) throw new GraphQLError("Invalid UUID, expected 32 hexadecimal characters, optionally with hypens");
  return string;
};
const colSpec = {
  fieldName: "rowId",
  attributeName: "id",
  attribute: spec_post.attributes.id
};
const colSpec2 = {
  fieldName: "authorId",
  attributeName: "author_id",
  attribute: spec_post.attributes.author_id
};
function assertAllowed4(value, mode) {
  if (mode === "object" && !true && isEmpty(value)) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !true) {
    const arr = value;
    if (arr) {
      const l = arr.length;
      for (let i = 0; i < l; i++) if (isEmpty(arr[i])) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function assertAllowed5(value, mode) {
  if (mode === "object" && !true && isEmpty(value)) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !true) {
    const arr = value;
    if (arr) {
      const l = arr.length;
      for (let i = 0; i < l; i++) if (isEmpty(arr[i])) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
const resolve = (i, _v, input) => sql`${i} ${input ? sql`IS NULL` : sql`IS NOT NULL`}`;
const resolveInputCodec = () => TYPES.boolean;
const resolveSqlValue = () => sql.null;
const resolve2 = (i, v) => sql`${i} = ${v}`;
const forceTextTypesSensitive = [TYPES.citext, TYPES.char, TYPES.bpchar];
function resolveDomains(c) {
  let current = c;
  while (current.domainOfCodec) current = current.domainOfCodec;
  return current;
}
function resolveInputCodec2(c) {
  if (c.arrayOfCodec) {
    if (forceTextTypesSensitive.includes(resolveDomains(c.arrayOfCodec))) return listOfCodec(TYPES.text, {
      extensions: {
        listItemNonNull: c.extensions?.listItemNonNull
      }
    });
    return c;
  } else {
    if (forceTextTypesSensitive.includes(resolveDomains(c))) return TYPES.text;
    return c;
  }
}
function resolveSqlIdentifier(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesSensitive.includes(resolveDomains(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesSensitive.includes(resolveDomains(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
const resolve3 = (i, v) => sql`${i} <> ${v}`;
const resolve4 = (i, v) => sql`${i} IS DISTINCT FROM ${v}`;
const resolve5 = (i, v) => sql`${i} IS NOT DISTINCT FROM ${v}`;
const resolve6 = (i, v) => sql`${i} = ANY(${v})`;
function resolveInputCodec3(c) {
  if (forceTextTypesSensitive.includes(resolveDomains(c))) return listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: !0
    }
  });else return listOfCodec(c, {
    extensions: {
      listItemNonNull: !0
    }
  });
}
const resolve7 = (i, v) => sql`${i} <> ALL(${v})`;
const resolve8 = (i, v) => sql`${i} < ${v}`;
const resolve9 = (i, v) => sql`${i} <= ${v}`;
const resolve10 = (i, v) => sql`${i} > ${v}`;
const resolve11 = (i, v) => sql`${i} >= ${v}`;
const colSpec3 = {
  fieldName: "rowId",
  attributeName: "id",
  attribute: spec_user.attributes.id
};
const colSpec4 = {
  fieldName: "identityProviderId",
  attributeName: "identity_provider_id",
  attribute: spec_user.attributes.identity_provider_id
};
function assertAllowed6(value, mode) {
  if (mode === "object" && !true && isEmpty(value)) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !true) {
    const arr = value;
    if (arr) {
      const l = arr.length;
      for (let i = 0; i < l; i++) if (isEmpty(arr[i])) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function assertAllowed7(value, mode) {
  if (mode === "object" && !true && isEmpty(value)) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !true) {
    const arr = value;
    if (arr) {
      const l = arr.length;
      for (let i = 0; i < l; i++) if (isEmpty(arr[i])) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function assertAllowed8(value, mode) {
  if (mode === "object" && !true && isEmpty(value)) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
  if (mode === "list" && !true) {
    const arr = value;
    if (arr) {
      const l = arr.length;
      for (let i = 0; i < l; i++) if (isEmpty(arr[i])) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
    }
  }
  if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
}
function oldPlan3(_, args) {
  const $insert = pgInsertSingle(resource_postPgResource, Object.create(null));
  args.apply($insert);
  return object({
    result: $insert
  });
}
const planWrapper3 = (plan, _, fieldArgs) => {
  const $postInput = fieldArgs.getRaw(["input", "post"]),
    $observer = context().get("observer");
  sideEffect([$postInput, $observer], async ([postInput, observer]) => {
    if (!postInput || !observer) throw new Error("Ooops");
    if (!(await match("create").with("update", () => permit.check(mockIdToken_Jane_Doe.sub, "update", "post")).with("create", () => permit.check(mockIdToken_Jane_Doe.sub, "create", "post")).with("delete", () => permit.check(mockIdToken_Jane_Doe.sub, "delete", "post")).exhaustive())) throw new Error("Permission denied");
  });
  return plan();
};
const oldPlan4 = (_$root, args) => {
  const $update = pgUpdateSingle(resource_userPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($update);
  return object({
    result: $update
  });
};
const planWrapper4 = (plan, _, fieldArgs) => {
  const $observerId = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer");
  sideEffect([$observerId, $observer], async ([observerId, currentObserver]) => {
    if (!currentObserver) throw new Error("Unauthorized");
    if (observerId !== currentObserver.id) throw new Error("Insufficient permissions");
  });
  return plan();
};
const oldPlan5 = (_$root, args) => {
  const $update = pgUpdateSingle(resource_postPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($update);
  return object({
    result: $update
  });
};
const planWrapper5 = (plan, _, fieldArgs) => {
  const $postInput = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer");
  sideEffect([$postInput, $observer], async ([postInput, observer]) => {
    if (!postInput || !observer) throw new Error("Ooops");
    if (!(await match("update").with("update", () => permit.check(mockIdToken_Jane_Doe.sub, "update", "post")).with("create", () => permit.check(mockIdToken_Jane_Doe.sub, "create", "post")).with("delete", () => permit.check(mockIdToken_Jane_Doe.sub, "delete", "post")).exhaustive())) throw new Error("Permission denied");
  });
  return plan();
};
const oldPlan6 = (_$root, args) => {
  const $delete = pgDeleteSingle(resource_userPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($delete);
  return object({
    result: $delete
  });
};
const planWrapper6 = (plan, _, fieldArgs) => {
  const $observerId = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer");
  sideEffect([$observerId, $observer], async ([observerId, currentObserver]) => {
    if (!currentObserver) throw new Error("Unauthorized");
    if (observerId !== currentObserver.id) throw new Error("Insufficient permissions");
  });
  return plan();
};
const oldPlan7 = (_$root, args) => {
  const $delete = pgDeleteSingle(resource_postPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($delete);
  return object({
    result: $delete
  });
};
const planWrapper7 = (plan, _, fieldArgs) => {
  const $postInput = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer");
  sideEffect([$postInput, $observer], async ([postInput, observer]) => {
    if (!postInput || !observer) throw new Error("Ooops");
    if (!(await match("delete").with("update", () => permit.check(mockIdToken_Jane_Doe.sub, "update", "post")).with("create", () => permit.check(mockIdToken_Jane_Doe.sub, "create", "post")).with("delete", () => permit.check(mockIdToken_Jane_Doe.sub, "delete", "post")).exhaustive())) throw new Error("Permission denied");
  });
  return plan();
};
export const typeDefs = /* GraphQL */`"""The root query type which gives access points into the data universe."""
type Query implements Node {
  """
  Exposes the root query type nested one level down. This is helpful for Relay 1
  which can only query top level fields if they are in a particular form.
  """
  query: Query!

  """
  The root query type must be a \`Node\` to work well with Relay 1 mutations. This just resolves to \`query\`.
  """
  id: ID!

  """Fetches an object given its globally unique \`ID\`."""
  node(
    """The globally unique \`ID\`."""
    id: ID!
  ): Node

  """Get a single \`User\`."""
  user(rowId: UUID!): User

  """Get a single \`User\`."""
  userByIdentityProviderId(identityProviderId: UUID!): User

  """Get a single \`Post\`."""
  post(rowId: UUID!): Post

  """Reads and enables pagination through a set of \`User\`."""
  users(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Only read the last \`n\` values of the set."""
    last: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set before (above) this cursor."""
    before: Cursor

    """Read all values in the set after (below) this cursor."""
    after: Cursor

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: UserCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: UserFilter

    """The method to use when ordering \`User\`."""
    orderBy: [UserOrderBy!] = [PRIMARY_KEY_ASC]
  ): UserConnection

  """Reads and enables pagination through a set of \`Post\`."""
  posts(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Only read the last \`n\` values of the set."""
    last: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set before (above) this cursor."""
    before: Cursor

    """Read all values in the set after (below) this cursor."""
    after: Cursor

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PostCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: PostFilter

    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!] = [PRIMARY_KEY_ASC]
  ): PostConnection
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
}

type User {
  rowId: UUID!
  identityProviderId: UUID!
  createdAt: Datetime
  updatedAt: Datetime

  """Reads and enables pagination through a set of \`Post\`."""
  authoredPosts(
    """Only read the first \`n\` values of the set."""
    first: Int

    """Only read the last \`n\` values of the set."""
    last: Int

    """
    Skip the first \`n\` values from our \`after\` cursor, an alternative to cursor
    based pagination. May not be used with \`last\`.
    """
    offset: Int

    """Read all values in the set before (above) this cursor."""
    before: Cursor

    """Read all values in the set after (below) this cursor."""
    after: Cursor

    """
    A condition to be used in determining which values should be returned by the collection.
    """
    condition: PostCondition

    """
    A filter to be used in determining which values should be returned by the collection.
    """
    filter: PostFilter

    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!] = [PRIMARY_KEY_ASC]
  ): PostConnection!
}

"""
A universally unique identifier as defined by [RFC 4122](https://tools.ietf.org/html/rfc4122).
"""
scalar UUID

"""
A point in time as described by the [ISO
8601](https://en.wikipedia.org/wiki/ISO_8601) and, if it has a timezone, [RFC
3339](https://datatracker.ietf.org/doc/html/rfc3339) standards. Input values
that do not conform to both ISO 8601 and RFC 3339 may be coerced, which may lead
to unexpected results.
"""
scalar Datetime

"""A connection to a list of \`Post\` values."""
type PostConnection {
  """A list of \`Post\` objects."""
  nodes: [Post]!

  """
  A list of edges which contains the \`Post\` and cursor to aid in pagination.
  """
  edges: [PostEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`Post\` you could get from the connection."""
  totalCount: Int!
}

type Post {
  rowId: UUID!
  title: String
  description: String
  authorId: UUID!
  createdAt: Datetime
  updatedAt: Datetime

  """Reads a single \`User\` that is related to this \`Post\`."""
  author: User
}

"""A \`Post\` edge in the connection."""
type PostEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`Post\` at the end of the edge."""
  node: Post
}

"""A location in a connection that can be used for resuming pagination."""
scalar Cursor

"""Information about pagination in a connection."""
type PageInfo {
  """When paginating forwards, are there more items?"""
  hasNextPage: Boolean!

  """When paginating backwards, are there more items?"""
  hasPreviousPage: Boolean!

  """When paginating backwards, the cursor to continue."""
  startCursor: Cursor

  """When paginating forwards, the cursor to continue."""
  endCursor: Cursor
}

"""
A condition to be used against \`Post\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input PostCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: UUID

  """Checks for equality with the object’s \`authorId\` field."""
  authorId: UUID
}

"""
A filter to be used against \`Post\` object types. All fields are combined with a logical ‘and.’
"""
input PostFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: UUIDFilter

  """Filter by the object’s \`authorId\` field."""
  authorId: UUIDFilter

  """Filter by the object’s \`author\` relation."""
  author: UserFilter

  """Checks for all expressions in this list."""
  and: [PostFilter!]

  """Checks for any expressions in this list."""
  or: [PostFilter!]

  """Negates the expression."""
  not: PostFilter
}

"""
A filter to be used against UUID fields. All fields are combined with a logical ‘and.’
"""
input UUIDFilter {
  """
  Is null (if \`true\` is specified) or is not null (if \`false\` is specified).
  """
  isNull: Boolean

  """Equal to the specified value."""
  equalTo: UUID

  """Not equal to the specified value."""
  notEqualTo: UUID

  """
  Not equal to the specified value, treating null like an ordinary value.
  """
  distinctFrom: UUID

  """Equal to the specified value, treating null like an ordinary value."""
  notDistinctFrom: UUID

  """Included in the specified list."""
  in: [UUID!]

  """Not included in the specified list."""
  notIn: [UUID!]

  """Less than the specified value."""
  lessThan: UUID

  """Less than or equal to the specified value."""
  lessThanOrEqualTo: UUID

  """Greater than the specified value."""
  greaterThan: UUID

  """Greater than or equal to the specified value."""
  greaterThanOrEqualTo: UUID
}

"""
A filter to be used against \`User\` object types. All fields are combined with a logical ‘and.’
"""
input UserFilter {
  """Filter by the object’s \`rowId\` field."""
  rowId: UUIDFilter

  """Filter by the object’s \`identityProviderId\` field."""
  identityProviderId: UUIDFilter

  """Filter by the object’s \`authoredPosts\` relation."""
  authoredPosts: UserToManyPostFilter

  """Some related \`authoredPosts\` exist."""
  authoredPostsExist: Boolean

  """Checks for all expressions in this list."""
  and: [UserFilter!]

  """Checks for any expressions in this list."""
  or: [UserFilter!]

  """Negates the expression."""
  not: UserFilter
}

"""
A filter to be used against many \`Post\` object types. All fields are combined with a logical ‘and.’
"""
input UserToManyPostFilter {
  """
  Every related \`Post\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  every: PostFilter

  """
  Some related \`Post\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  some: PostFilter

  """
  No related \`Post\` matches the filter criteria. All fields are combined with a logical ‘and.’
  """
  none: PostFilter
}

"""Methods to use when ordering \`Post\`."""
enum PostOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  AUTHOR_ID_ASC
  AUTHOR_ID_DESC
}

"""A connection to a list of \`User\` values."""
type UserConnection {
  """A list of \`User\` objects."""
  nodes: [User]!

  """
  A list of edges which contains the \`User\` and cursor to aid in pagination.
  """
  edges: [UserEdge]!

  """Information to aid in pagination."""
  pageInfo: PageInfo!

  """The count of *all* \`User\` you could get from the connection."""
  totalCount: Int!
}

"""A \`User\` edge in the connection."""
type UserEdge {
  """A cursor for use in pagination."""
  cursor: Cursor

  """The \`User\` at the end of the edge."""
  node: User
}

"""
A condition to be used against \`User\` object types. All fields are tested for equality and combined with a logical ‘and.’
"""
input UserCondition {
  """Checks for equality with the object’s \`rowId\` field."""
  rowId: UUID

  """Checks for equality with the object’s \`identityProviderId\` field."""
  identityProviderId: UUID
}

"""Methods to use when ordering \`User\`."""
enum UserOrderBy {
  NATURAL
  PRIMARY_KEY_ASC
  PRIMARY_KEY_DESC
  ROW_ID_ASC
  ROW_ID_DESC
  IDENTITY_PROVIDER_ID_ASC
  IDENTITY_PROVIDER_ID_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`User\`."""
  createUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUserInput!
  ): CreateUserPayload

  """Creates a single \`Post\`."""
  createPost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePostInput!
  ): CreatePostPayload

  """Updates a single \`User\` using a unique key and a patch."""
  updateUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserInput!
  ): UpdateUserPayload

  """Updates a single \`Post\` using a unique key and a patch."""
  updatePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePostInput!
  ): UpdatePostPayload

  """Deletes a single \`User\` using a unique key."""
  deleteUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserInput!
  ): DeleteUserPayload

  """Deletes a single \`Post\` using a unique key."""
  deletePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePostInput!
  ): DeletePostPayload
}

"""The output of our create \`User\` mutation."""
type CreateUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was created by this mutation."""
  user: User

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UserOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UserEdge
}

"""All input for the create \`User\` mutation."""
input CreateUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`User\` to be created by this mutation."""
  user: UserInput!
}

"""An input for mutations affecting \`User\`"""
input UserInput {
  rowId: UUID
  identityProviderId: UUID!
  createdAt: Datetime
  updatedAt: Datetime
}

"""The output of our create \`Post\` mutation."""
type CreatePostPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Post\` that was created by this mutation."""
  post: Post

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostEdge
}

"""All input for the create \`Post\` mutation."""
input CreatePostInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String

  """The \`Post\` to be created by this mutation."""
  post: PostInput!
}

"""An input for mutations affecting \`Post\`"""
input PostInput {
  rowId: UUID
  title: String
  description: String
  authorId: UUID!
  createdAt: Datetime
  updatedAt: Datetime
}

"""The output of our update \`User\` mutation."""
type UpdateUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was updated by this mutation."""
  user: User

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UserOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UserEdge
}

"""All input for the \`updateUser\` mutation."""
input UpdateUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!

  """
  An object where the defined keys will be set on the \`User\` being updated.
  """
  patch: UserPatch!
}

"""Represents an update to a \`User\`. Fields that are set will be updated."""
input UserPatch {
  rowId: UUID
  identityProviderId: UUID
  createdAt: Datetime
  updatedAt: Datetime
}

"""The output of our update \`Post\` mutation."""
type UpdatePostPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Post\` that was updated by this mutation."""
  post: Post

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostEdge
}

"""All input for the \`updatePost\` mutation."""
input UpdatePostInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!

  """
  An object where the defined keys will be set on the \`Post\` being updated.
  """
  patch: PostPatch!
}

"""Represents an update to a \`Post\`. Fields that are set will be updated."""
input PostPatch {
  rowId: UUID
  title: String
  description: String
  authorId: UUID
  createdAt: Datetime
  updatedAt: Datetime
}

"""The output of our delete \`User\` mutation."""
type DeleteUserPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`User\` that was deleted by this mutation."""
  user: User

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`User\`. May be used by Relay 1."""
  userEdge(
    """The method to use when ordering \`User\`."""
    orderBy: [UserOrderBy!]! = [PRIMARY_KEY_ASC]
  ): UserEdge
}

"""All input for the \`deleteUser\` mutation."""
input DeleteUserInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!
}

"""The output of our delete \`Post\` mutation."""
type DeletePostPayload {
  """
  The exact same \`clientMutationId\` that was provided in the mutation input,
  unchanged and unused. May be used by a client to track mutations.
  """
  clientMutationId: String

  """The \`Post\` that was deleted by this mutation."""
  post: Post

  """
  Our root query field type. Allows us to run any query from our mutation payload.
  """
  query: Query

  """An edge for our \`Post\`. May be used by Relay 1."""
  postEdge(
    """The method to use when ordering \`Post\`."""
    orderBy: [PostOrderBy!]! = [PRIMARY_KEY_ASC]
  ): PostEdge
}

"""All input for the \`deletePost\` mutation."""
input DeletePostInput {
  """
  An arbitrary string value with no semantic meaning. Will be included in the
  payload verbatim. May be used to track mutations by the client.
  """
  clientMutationId: String
  rowId: UUID!
}`;
export const plans = {
  Query: {
    __assertStep() {
      return !0;
    },
    query() {
      return rootValue();
    },
    id($parent) {
      const specifier = handler.plan($parent);
      return lambda(specifier, nodeIdCodecs[handler.codec.name].encode);
    },
    node(_$root, args) {
      return node(nodeIdHandlerByTypeName, args.getRaw("id"));
    },
    user(_$root, {
      $rowId
    }) {
      return resource_userPgResource.get({
        id: $rowId
      });
    },
    userByIdentityProviderId(_$root, {
      $identityProviderId
    }) {
      return resource_userPgResource.get({
        identity_provider_id: $identityProviderId
      });
    },
    post(...planParams) {
      const smartPlan = (...overrideParams) => {
          const $prev = oldPlan(...overrideParams.concat(planParams.slice(overrideParams.length)));
          if (!($prev instanceof ExecutableStep)) {
            console.error(`Wrapped a plan function at ${"Query"}.${"post"}, but that function did not return a step!
${String(oldPlan)}`);
            throw new Error("Wrapped a plan function, but that function did not return a step!");
          }
          return $prev;
        },
        [$source, fieldArgs, info] = planParams,
        $newPlan = planWrapper(smartPlan, $source, fieldArgs, info);
      if ($newPlan === void 0) throw new Error("Your plan wrapper didn't return anything; it must return a step or null!");
      if ($newPlan !== null && !isExecutableStep($newPlan)) throw new Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
      return $newPlan;
    },
    users: {
      plan() {
        return connection(resource_userPgResource.find());
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        last(_, $connection, val) {
          $connection.setLast(val.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        before(_, $connection, val) {
          $connection.setBefore(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        },
        condition(_condition, $connection, arg) {
          const $select = $connection.getSubplan();
          arg.apply($select, qbWhereBuilder);
        },
        filter(_, $connection, fieldArg) {
          const $pgSelect = $connection.getSubplan();
          fieldArg.apply($pgSelect, (queryBuilder, value) => {
            assertAllowed(value, "object");
            if (value == null) return;
            const condition = new PgCondition(queryBuilder);
            return condition;
          });
        },
        orderBy(parent, $connection, value) {
          const $select = $connection.getSubplan();
          value.apply($select);
        }
      }
    },
    posts: {
      plan(...planParams) {
        const smartPlan = (...overrideParams) => {
            const $prev = oldPlan2(...overrideParams.concat(planParams.slice(overrideParams.length)));
            if (!($prev instanceof ExecutableStep)) {
              console.error(`Wrapped a plan function at ${"Query"}.${"posts"}, but that function did not return a step!
${String(oldPlan2)}`);
              throw new Error("Wrapped a plan function, but that function did not return a step!");
            }
            return $prev;
          },
          [$source, fieldArgs, info] = planParams,
          $newPlan = planWrapper2(smartPlan, $source, fieldArgs, info);
        if ($newPlan === void 0) throw new Error("Your plan wrapper didn't return anything; it must return a step or null!");
        if ($newPlan !== null && !isExecutableStep($newPlan)) throw new Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
        return $newPlan;
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        last(_, $connection, val) {
          $connection.setLast(val.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        before(_, $connection, val) {
          $connection.setBefore(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        },
        condition(_condition, $connection, arg) {
          const $select = $connection.getSubplan();
          arg.apply($select, qbWhereBuilder);
        },
        filter(_, $connection, fieldArg) {
          const $pgSelect = $connection.getSubplan();
          fieldArg.apply($pgSelect, (queryBuilder, value) => {
            assertAllowed2(value, "object");
            if (value == null) return;
            const condition = new PgCondition(queryBuilder);
            return condition;
          });
        },
        orderBy(parent, $connection, value) {
          const $select = $connection.getSubplan();
          value.apply($select);
        }
      }
    }
  },
  User: {
    __assertStep: assertPgClassSingleStep,
    rowId($record) {
      return $record.get("id");
    },
    identityProviderId($record) {
      return $record.get("identity_provider_id");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    authoredPosts: {
      plan($record) {
        const $records = resource_postPgResource.find({
          author_id: $record.get("id")
        });
        return connection($records);
      },
      args: {
        first(_, $connection, arg) {
          $connection.setFirst(arg.getRaw());
        },
        last(_, $connection, val) {
          $connection.setLast(val.getRaw());
        },
        offset(_, $connection, val) {
          $connection.setOffset(val.getRaw());
        },
        before(_, $connection, val) {
          $connection.setBefore(val.getRaw());
        },
        after(_, $connection, val) {
          $connection.setAfter(val.getRaw());
        },
        condition(_condition, $connection, arg) {
          const $select = $connection.getSubplan();
          arg.apply($select, qbWhereBuilder);
        },
        filter(_, $connection, fieldArg) {
          const $pgSelect = $connection.getSubplan();
          fieldArg.apply($pgSelect, (queryBuilder, value) => {
            assertAllowed3(value, "object");
            if (value == null) return;
            const condition = new PgCondition(queryBuilder);
            return condition;
          });
        },
        orderBy(parent, $connection, value) {
          const $select = $connection.getSubplan();
          value.apply($select);
        }
      }
    }
  },
  UUID: {
    serialize: UUIDSerialize,
    parseValue(value) {
      return coerce("" + value);
    },
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) throw new GraphQLError(`${"UUID" ?? "This scalar"} can only parse string values (kind = '${ast.kind}')`);
      return coerce(ast.value);
    }
  },
  Datetime: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) throw new GraphQLError(`${"Datetime" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      return ast.value;
    }
  },
  PostConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, !1);
    }
  },
  Post: {
    __assertStep: assertPgClassSingleStep,
    rowId($record) {
      return $record.get("id");
    },
    authorId($record) {
      return $record.get("author_id");
    },
    createdAt($record) {
      return $record.get("created_at");
    },
    updatedAt($record) {
      return $record.get("updated_at");
    },
    author($record) {
      return resource_userPgResource.get({
        id: $record.get("author_id")
      });
    }
  },
  PostEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  Cursor: {
    serialize: UUIDSerialize,
    parseValue: UUIDSerialize,
    parseLiteral(ast) {
      if (ast.kind !== Kind.STRING) throw new GraphQLError(`${"Cursor" ?? "This scalar"} can only parse string values (kind='${ast.kind}')`);
      return ast.value;
    }
  },
  PageInfo: {
    __assertStep: assertPageInfoCapableStep,
    hasNextPage($pageInfo) {
      return $pageInfo.hasNextPage();
    },
    hasPreviousPage($pageInfo) {
      return $pageInfo.hasPreviousPage();
    },
    startCursor($pageInfo) {
      return $pageInfo.startCursor();
    },
    endCursor($pageInfo) {
      return $pageInfo.endCursor();
    }
  },
  PostCondition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.uuid)}`;
        }
      });
    },
    authorId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "author_id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.uuid)}`;
        }
      });
    }
  },
  PostFilter: {
    rowId(queryBuilder, value) {
      if (value === void 0) return;
      if (!true && isEmpty(value)) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const condition = new PgCondition(queryBuilder);
      condition.extensions.pgFilterAttribute = colSpec;
      return condition;
    },
    authorId(queryBuilder, value) {
      if (value === void 0) return;
      if (!true && isEmpty(value)) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const condition = new PgCondition(queryBuilder);
      condition.extensions.pgFilterAttribute = colSpec2;
      return condition;
    },
    author($where, value) {
      assertAllowed4(value, "object");
      if (value == null) return;
      const $subQuery = $where.existsPlan({
        tableExpression: userIdentifier,
        alias: resource_userPgResource.name
      });
      registryConfig.pgRelations.post.userByMyAuthorId.localAttributes.forEach((localAttribute, i) => {
        const remoteAttribute = registryConfig.pgRelations.post.userByMyAuthorId.remoteAttributes[i];
        $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
      });
      return $subQuery;
    },
    and($where, value) {
      assertAllowed5(value, "list");
      if (value == null) return;
      return $where.andPlan();
    },
    or($where, value) {
      assertAllowed5(value, "list");
      if (value == null) return;
      const $or = $where.orPlan();
      return () => $or.andPlan();
    },
    not($where, value) {
      assertAllowed5(value, "object");
      if (value == null) return;
      return $where.notPlan().andPlan();
    }
  },
  UUIDFilter: {
    isNull($where, value) {
      if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
      if (value === void 0) return;
      const {
          fieldName: parentFieldName,
          attributeName,
          attribute,
          codec,
          expression
        } = $where.extensions.pgFilterAttribute,
        sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
        sourceCodec = codec ?? attribute.codec,
        [sqlIdentifier, identifierCodec] = [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec ? resolveInputCodec(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = resolveSqlValue ? resolveSqlValue($where, value, inputCodec) : sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "isNull"
        });
      $where.where(fragment);
    },
    equalTo($where, value) {
      if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
      if (value === void 0) return;
      const {
          fieldName: parentFieldName,
          attributeName,
          attribute,
          codec,
          expression
        } = $where.extensions.pgFilterAttribute,
        sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
        sourceCodec = codec ?? attribute.codec,
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve2(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "equalTo"
        });
      $where.where(fragment);
    },
    notEqualTo($where, value) {
      if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
      if (value === void 0) return;
      const {
          fieldName: parentFieldName,
          attributeName,
          attribute,
          codec,
          expression
        } = $where.extensions.pgFilterAttribute,
        sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
        sourceCodec = codec ?? attribute.codec,
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve3(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notEqualTo"
        });
      $where.where(fragment);
    },
    distinctFrom($where, value) {
      if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
      if (value === void 0) return;
      const {
          fieldName: parentFieldName,
          attributeName,
          attribute,
          codec,
          expression
        } = $where.extensions.pgFilterAttribute,
        sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
        sourceCodec = codec ?? attribute.codec,
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve4(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "distinctFrom"
        });
      $where.where(fragment);
    },
    notDistinctFrom($where, value) {
      if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
      if (value === void 0) return;
      const {
          fieldName: parentFieldName,
          attributeName,
          attribute,
          codec,
          expression
        } = $where.extensions.pgFilterAttribute,
        sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
        sourceCodec = codec ?? attribute.codec,
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve5(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notDistinctFrom"
        });
      $where.where(fragment);
    },
    in($where, value) {
      if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
      if (value === void 0) return;
      const {
          fieldName: parentFieldName,
          attributeName,
          attribute,
          codec,
          expression
        } = $where.extensions.pgFilterAttribute,
        sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
        sourceCodec = codec ?? attribute.codec,
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec3 ? resolveInputCodec3(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve6(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "in"
        });
      $where.where(fragment);
    },
    notIn($where, value) {
      if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
      if (value === void 0) return;
      const {
          fieldName: parentFieldName,
          attributeName,
          attribute,
          codec,
          expression
        } = $where.extensions.pgFilterAttribute,
        sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
        sourceCodec = codec ?? attribute.codec,
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec3 ? resolveInputCodec3(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve7(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notIn"
        });
      $where.where(fragment);
    },
    lessThan($where, value) {
      if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
      if (value === void 0) return;
      const {
          fieldName: parentFieldName,
          attributeName,
          attribute,
          codec,
          expression
        } = $where.extensions.pgFilterAttribute,
        sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
        sourceCodec = codec ?? attribute.codec,
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve8(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "lessThan"
        });
      $where.where(fragment);
    },
    lessThanOrEqualTo($where, value) {
      if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
      if (value === void 0) return;
      const {
          fieldName: parentFieldName,
          attributeName,
          attribute,
          codec,
          expression
        } = $where.extensions.pgFilterAttribute,
        sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
        sourceCodec = codec ?? attribute.codec,
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve9(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "lessThanOrEqualTo"
        });
      $where.where(fragment);
    },
    greaterThan($where, value) {
      if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
      if (value === void 0) return;
      const {
          fieldName: parentFieldName,
          attributeName,
          attribute,
          codec,
          expression
        } = $where.extensions.pgFilterAttribute,
        sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
        sourceCodec = codec ?? attribute.codec,
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve10(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "greaterThan"
        });
      $where.where(fragment);
    },
    greaterThanOrEqualTo($where, value) {
      if (!$where.extensions?.pgFilterAttribute) throw new Error("Planning error: expected 'pgFilterAttribute' to be present on the $where plan's extensions; your extensions to `postgraphile-plugin-connection-filter` does not implement the required interfaces.");
      if (value === void 0) return;
      const {
          fieldName: parentFieldName,
          attributeName,
          attribute,
          codec,
          expression
        } = $where.extensions.pgFilterAttribute,
        sourceAlias = attribute ? attribute.expression ? attribute.expression($where.alias) : sql`${$where.alias}.${sql.identifier(attributeName)}` : expression ? expression : $where.alias,
        sourceCodec = codec ?? attribute.codec,
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier ? resolveSqlIdentifier(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec2 ? resolveInputCodec2(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve11(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "greaterThanOrEqualTo"
        });
      $where.where(fragment);
    }
  },
  UserFilter: {
    rowId(queryBuilder, value) {
      if (value === void 0) return;
      if (!true && isEmpty(value)) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const condition = new PgCondition(queryBuilder);
      condition.extensions.pgFilterAttribute = colSpec3;
      return condition;
    },
    identityProviderId(queryBuilder, value) {
      if (value === void 0) return;
      if (!true && isEmpty(value)) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const condition = new PgCondition(queryBuilder);
      condition.extensions.pgFilterAttribute = colSpec4;
      return condition;
    },
    authoredPosts($where, value) {
      assertAllowed6(value, "object");
      const $rel = $where.andPlan();
      $rel.extensions.pgFilterRelation = {
        tableExpression: postIdentifier,
        alias: resource_postPgResource.name,
        localAttributes: registryConfig.pgRelations.user.postsByTheirAuthorId.localAttributes,
        remoteAttributes: registryConfig.pgRelations.user.postsByTheirAuthorId.remoteAttributes
      };
      return $rel;
    },
    authoredPostsExist($where, value) {
      assertAllowed6(value, "scalar");
      if (value == null) return;
      const $subQuery = $where.existsPlan({
        tableExpression: postIdentifier,
        alias: resource_postPgResource.name,
        equals: value
      });
      registryConfig.pgRelations.user.postsByTheirAuthorId.localAttributes.forEach((localAttribute, i) => {
        const remoteAttribute = registryConfig.pgRelations.user.postsByTheirAuthorId.remoteAttributes[i];
        $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
      });
    },
    and($where, value) {
      assertAllowed7(value, "list");
      if (value == null) return;
      return $where.andPlan();
    },
    or($where, value) {
      assertAllowed7(value, "list");
      if (value == null) return;
      const $or = $where.orPlan();
      return () => $or.andPlan();
    },
    not($where, value) {
      assertAllowed7(value, "object");
      if (value == null) return;
      return $where.notPlan().andPlan();
    }
  },
  UserToManyPostFilter: {
    every($where, value) {
      assertAllowed8(value, "object");
      if (value == null) return;
      if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
      const {
          localAttributes,
          remoteAttributes,
          tableExpression,
          alias
        } = $where.extensions.pgFilterRelation,
        $subQuery = $where.notPlan().existsPlan({
          tableExpression,
          alias
        });
      localAttributes.forEach((localAttribute, i) => {
        const remoteAttribute = remoteAttributes[i];
        $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
      });
      return $subQuery.notPlan().andPlan();
    },
    some($where, value) {
      assertAllowed8(value, "object");
      if (value == null) return;
      if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
      const {
          localAttributes,
          remoteAttributes,
          tableExpression,
          alias
        } = $where.extensions.pgFilterRelation,
        $subQuery = $where.existsPlan({
          tableExpression,
          alias
        });
      localAttributes.forEach((localAttribute, i) => {
        const remoteAttribute = remoteAttributes[i];
        $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
      });
      return $subQuery;
    },
    none($where, value) {
      assertAllowed8(value, "object");
      if (value == null) return;
      if (!$where.extensions.pgFilterRelation) throw new Error("Invalid use of filter, 'pgFilterRelation' expected");
      const {
          localAttributes,
          remoteAttributes,
          tableExpression,
          alias
        } = $where.extensions.pgFilterRelation,
        $subQuery = $where.notPlan().existsPlan({
          tableExpression,
          alias
        });
      localAttributes.forEach((localAttribute, i) => {
        const remoteAttribute = remoteAttributes[i];
        $subQuery.where(sql`${$where.alias}.${sql.identifier(localAttribute)} = ${$subQuery.alias}.${sql.identifier(remoteAttribute)}`);
      });
      return $subQuery;
    }
  },
  PostOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      postUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      postUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "DESC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    ROW_ID_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "id",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    ROW_ID_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "id",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    AUTHOR_ID_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "author_id",
        direction: "ASC"
      });
    },
    AUTHOR_ID_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "author_id",
        direction: "DESC"
      });
    }
  },
  UserConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, !1);
    }
  },
  UserEdge: {
    __assertStep: assertEdgeCapableStep,
    cursor($edge) {
      return $edge.cursor();
    },
    node($edge) {
      return $edge.node();
    }
  },
  UserCondition: {
    rowId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.uuid)}`;
        }
      });
    },
    identityProviderId($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "identity_provider_id",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.uuid)}`;
        }
      });
    }
  },
  UserOrderBy: {
    PRIMARY_KEY_ASC(queryBuilder) {
      userUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "ASC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    PRIMARY_KEY_DESC(queryBuilder) {
      userUniques[0].attributes.forEach(attributeName => {
        queryBuilder.orderBy({
          attribute: attributeName,
          direction: "DESC"
        });
      });
      queryBuilder.setOrderIsUnique();
    },
    ROW_ID_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "id",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    ROW_ID_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "id",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    },
    IDENTITY_PROVIDER_ID_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "identity_provider_id",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    IDENTITY_PROVIDER_ID_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "identity_provider_id",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    }
  },
  Mutation: {
    __assertStep: __ValueStep,
    createUser: {
      plan(_, args) {
        const $insert = pgInsertSingle(resource_userPgResource, Object.create(null));
        args.apply($insert);
        return object({
          result: $insert
        });
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    createPost: {
      plan(...planParams) {
        const smartPlan = (...overrideParams) => {
            const $prev = oldPlan3(...overrideParams.concat(planParams.slice(overrideParams.length)));
            if (!($prev instanceof ExecutableStep)) {
              console.error(`Wrapped a plan function at ${"Mutation"}.${"createPost"}, but that function did not return a step!
${String(oldPlan3)}`);
              throw new Error("Wrapped a plan function, but that function did not return a step!");
            }
            return $prev;
          },
          [$source, fieldArgs, info] = planParams,
          $newPlan = planWrapper3(smartPlan, $source, fieldArgs, info);
        if ($newPlan === void 0) throw new Error("Your plan wrapper didn't return anything; it must return a step or null!");
        if ($newPlan !== null && !isExecutableStep($newPlan)) throw new Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
        return $newPlan;
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    updateUser: {
      plan(...planParams) {
        const smartPlan = (...overrideParams) => {
            const $prev = oldPlan4(...overrideParams.concat(planParams.slice(overrideParams.length)));
            if (!($prev instanceof ExecutableStep)) {
              console.error(`Wrapped a plan function at ${"Mutation"}.${"updateUser"}, but that function did not return a step!
${String(oldPlan4)}`);
              throw new Error("Wrapped a plan function, but that function did not return a step!");
            }
            return $prev;
          },
          [$source, fieldArgs, info] = planParams,
          $newPlan = planWrapper4(smartPlan, $source, fieldArgs, info);
        if ($newPlan === void 0) throw new Error("Your plan wrapper didn't return anything; it must return a step or null!");
        if ($newPlan !== null && !isExecutableStep($newPlan)) throw new Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
        return $newPlan;
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    updatePost: {
      plan(...planParams) {
        const smartPlan = (...overrideParams) => {
            const $prev = oldPlan5(...overrideParams.concat(planParams.slice(overrideParams.length)));
            if (!($prev instanceof ExecutableStep)) {
              console.error(`Wrapped a plan function at ${"Mutation"}.${"updatePost"}, but that function did not return a step!
${String(oldPlan5)}`);
              throw new Error("Wrapped a plan function, but that function did not return a step!");
            }
            return $prev;
          },
          [$source, fieldArgs, info] = planParams,
          $newPlan = planWrapper5(smartPlan, $source, fieldArgs, info);
        if ($newPlan === void 0) throw new Error("Your plan wrapper didn't return anything; it must return a step or null!");
        if ($newPlan !== null && !isExecutableStep($newPlan)) throw new Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
        return $newPlan;
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    deleteUser: {
      plan(...planParams) {
        const smartPlan = (...overrideParams) => {
            const $prev = oldPlan6(...overrideParams.concat(planParams.slice(overrideParams.length)));
            if (!($prev instanceof ExecutableStep)) {
              console.error(`Wrapped a plan function at ${"Mutation"}.${"deleteUser"}, but that function did not return a step!
${String(oldPlan6)}`);
              throw new Error("Wrapped a plan function, but that function did not return a step!");
            }
            return $prev;
          },
          [$source, fieldArgs, info] = planParams,
          $newPlan = planWrapper6(smartPlan, $source, fieldArgs, info);
        if ($newPlan === void 0) throw new Error("Your plan wrapper didn't return anything; it must return a step or null!");
        if ($newPlan !== null && !isExecutableStep($newPlan)) throw new Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
        return $newPlan;
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    },
    deletePost: {
      plan(...planParams) {
        const smartPlan = (...overrideParams) => {
            const $prev = oldPlan7(...overrideParams.concat(planParams.slice(overrideParams.length)));
            if (!($prev instanceof ExecutableStep)) {
              console.error(`Wrapped a plan function at ${"Mutation"}.${"deletePost"}, but that function did not return a step!
${String(oldPlan7)}`);
              throw new Error("Wrapped a plan function, but that function did not return a step!");
            }
            return $prev;
          },
          [$source, fieldArgs, info] = planParams,
          $newPlan = planWrapper7(smartPlan, $source, fieldArgs, info);
        if ($newPlan === void 0) throw new Error("Your plan wrapper didn't return anything; it must return a step or null!");
        if ($newPlan !== null && !isExecutableStep($newPlan)) throw new Error(`Your plan wrapper returned something other than a step... It must return a step (or null). (Returned: ${inspect($newPlan)})`);
        return $newPlan;
      },
      args: {
        input(_, $object) {
          return $object;
        }
      }
    }
  },
  CreateUserPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("result").getMeta("clientMutationId");
    },
    user($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    userEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", !0);
      if (!$result) return constant(null);
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
          const spec = userUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_userPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select),
        $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreateUserInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    user(qb, arg) {
      if (arg != null) return qb.setBuilder();
    }
  },
  UserInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    identityProviderId(obj, val, {
      field,
      schema
    }) {
      obj.set("identity_provider_id", bakedInputRuntime(schema, field.type, val));
    },
    createdAt(obj, val, {
      field,
      schema
    }) {
      obj.set("created_at", bakedInputRuntime(schema, field.type, val));
    },
    updatedAt(obj, val, {
      field,
      schema
    }) {
      obj.set("updated_at", bakedInputRuntime(schema, field.type, val));
    }
  },
  CreatePostPayload: {
    __assertStep: assertExecutableStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("result").getMeta("clientMutationId");
    },
    post($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    postEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", !0);
      if (!$result) return constant(null);
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
          const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_postPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select),
        $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  CreatePostInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    post(qb, arg) {
      if (arg != null) return qb.setBuilder();
    }
  },
  PostInput: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    title(obj, val, {
      field,
      schema
    }) {
      obj.set("title", bakedInputRuntime(schema, field.type, val));
    },
    description(obj, val, {
      field,
      schema
    }) {
      obj.set("description", bakedInputRuntime(schema, field.type, val));
    },
    authorId(obj, val, {
      field,
      schema
    }) {
      obj.set("author_id", bakedInputRuntime(schema, field.type, val));
    },
    createdAt(obj, val, {
      field,
      schema
    }) {
      obj.set("created_at", bakedInputRuntime(schema, field.type, val));
    },
    updatedAt(obj, val, {
      field,
      schema
    }) {
      obj.set("updated_at", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdateUserPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("result").getMeta("clientMutationId");
    },
    user($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    userEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", !0);
      if (!$result) return constant(null);
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
          const spec = userUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_userPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select),
        $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdateUserInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    patch(qb, arg) {
      if (arg != null) return qb.setBuilder();
    }
  },
  UserPatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    identityProviderId(obj, val, {
      field,
      schema
    }) {
      obj.set("identity_provider_id", bakedInputRuntime(schema, field.type, val));
    },
    createdAt(obj, val, {
      field,
      schema
    }) {
      obj.set("created_at", bakedInputRuntime(schema, field.type, val));
    },
    updatedAt(obj, val, {
      field,
      schema
    }) {
      obj.set("updated_at", bakedInputRuntime(schema, field.type, val));
    }
  },
  UpdatePostPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("result").getMeta("clientMutationId");
    },
    post($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    postEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", !0);
      if (!$result) return constant(null);
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
          const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_postPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select),
        $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  UpdatePostInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    },
    patch(qb, arg) {
      if (arg != null) return qb.setBuilder();
    }
  },
  PostPatch: {
    __baked: createObjectAndApplyChildren,
    rowId(obj, val, {
      field,
      schema
    }) {
      obj.set("id", bakedInputRuntime(schema, field.type, val));
    },
    title(obj, val, {
      field,
      schema
    }) {
      obj.set("title", bakedInputRuntime(schema, field.type, val));
    },
    description(obj, val, {
      field,
      schema
    }) {
      obj.set("description", bakedInputRuntime(schema, field.type, val));
    },
    authorId(obj, val, {
      field,
      schema
    }) {
      obj.set("author_id", bakedInputRuntime(schema, field.type, val));
    },
    createdAt(obj, val, {
      field,
      schema
    }) {
      obj.set("created_at", bakedInputRuntime(schema, field.type, val));
    },
    updatedAt(obj, val, {
      field,
      schema
    }) {
      obj.set("updated_at", bakedInputRuntime(schema, field.type, val));
    }
  },
  DeleteUserPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("result").getMeta("clientMutationId");
    },
    user($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    userEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", !0);
      if (!$result) return constant(null);
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
          const spec = userUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_userPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select),
        $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeleteUserInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  },
  DeletePostPayload: {
    __assertStep: ObjectStep,
    clientMutationId($mutation) {
      return $mutation.getStepForKey("result").getMeta("clientMutationId");
    },
    post($object) {
      return $object.get("result");
    },
    query() {
      return rootValue();
    },
    postEdge($mutation, fieldArgs) {
      const $result = $mutation.getStepForKey("result", !0);
      if (!$result) return constant(null);
      const $select = (() => {
        if ($result instanceof PgDeleteSingleStep) return pgSelectFromRecord($result.resource, $result.record());else {
          const spec = postUniques[0].attributes.reduce((memo, attributeName) => {
            memo[attributeName] = $result.get(attributeName);
            return memo;
          }, Object.create(null));
          return resource_postPgResource.find(spec);
        }
      })();
      fieldArgs.apply($select, "orderBy");
      const $connection = connection($select),
        $single = $select.row(first($select));
      return new EdgeStep($connection, $single);
    }
  },
  DeletePostInput: {
    clientMutationId(qb, val) {
      qb.setMeta("clientMutationId", val);
    }
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});