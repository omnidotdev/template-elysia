// @ts-nocheck
import { PgCondition, PgDeleteSingleStep, PgExecutor, TYPES, assertPgClassSingleStep, listOfCodec, makeRegistry, pgDeleteSingle, pgInsertSingle, pgSelectFromRecord, pgUpdateSingle, recordCodec, sqlValueWithCodec } from "@dataplan/pg";
import { eq } from "drizzle-orm";
import { ConnectionStep, EdgeStep, ExecutableStep, ObjectStep, __ValueStep, assertEdgeCapableStep, assertExecutableStep, assertPageInfoCapableStep, bakedInputRuntime, connection, constant, context, createObjectAndApplyChildren, first, isExecutableStep, lambda, makeGrafastSchema, node, object, rootValue, sideEffect } from "grafast";
import { GraphQLError, Kind } from "graphql";
import * as lib_db_schema from "lib/db/schema";
import { sql } from "pg-sql2";
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
    oid: "273573",
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
    },
    username: {
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
    first_name: {
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
    last_name: {
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
    email: {
      description: undefined,
      codec: TYPES.text,
      notNull: true,
      hasDefault: false,
      extensions: {
        tags: {},
        canSelect: true,
        canInsert: true,
        canUpdate: true
      }
    }
  },
  description: undefined,
  extensions: {
    oid: "273583",
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
  attributes: ["email"],
  description: undefined,
  extensions: {
    tags: {
      __proto__: null,
      behavior: ["-update", "-delete"]
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
    post: registryConfig_pgResources_post_post,
    user: registryConfig_pgResources_user_user
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
const resource_postPgResource = registry.pgResources["post"];
const oldPlan = (_$root, {
  $rowId
}) => resource_postPgResource.get({
  id: $rowId
});
const planWrapper = (plan, _, fieldArgs) => {
  const $postId = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $permit = context().get("permit"),
    $db = context().get("db");
  sideEffect([$postId, $observer, $permit, $db], async ([postId, observer, permit, db]) => {
    if (!postId || !observer) throw new Error("Ooops");
    const {
        postTable
      } = lib_db_schema,
      [post] = await db.select({
        authorId: postTable.authorId
      }).from(postTable).where(eq(postTable.authorId, observer.id));
    if (!(await permit.check(observer.id, "read", {
      type: "post",
      attributes: {
        authorId: post.authorId
      },
      tenant: "default"
    }))) throw new Error("Permission denied");
  });
  return plan();
};
const resource_userPgResource = registry.pgResources["user"];
function oldPlan2() {
  return connection(resource_postPgResource.find());
}
const planWrapper2 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(),
    $observer = context().get("observer"),
    $permit = context().get("permit");
  sideEffect([$input, $observer, $permit], async ([input, observer, permit]) => {
    if (!input.condition.authorId || !observer) throw new Error("Ooops");
    if (!(await permit.check(observer.id, "read", {
      type: "post",
      attributes: {
        authorId: input.condition.authorId
      },
      tenant: "default"
    }))) throw new Error("Permission denied");
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
function UUIDSerialize(value) {
  return "" + value;
}
const coerce = string => {
  if (!/^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i.test(string)) throw new GraphQLError("Invalid UUID, expected 32 hexadecimal characters, optionally with hypens");
  return string;
};
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
const colSpec5 = {
  fieldName: "email",
  attributeName: "email",
  attribute: spec_user.attributes.email
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
const resolve12 = (i, _v, input) => sql`${i} ${input ? sql`IS NULL` : sql`IS NOT NULL`}`;
const resolveInputCodec4 = () => TYPES.boolean;
const resolveSqlValue2 = () => sql.null;
const resolve13 = (i, v) => sql`${i} = ${v}`;
const forceTextTypesSensitive2 = [TYPES.citext, TYPES.char, TYPES.bpchar];
function resolveDomains2(c) {
  let current = c;
  while (current.domainOfCodec) current = current.domainOfCodec;
  return current;
}
function resolveInputCodec5(c) {
  if (c.arrayOfCodec) {
    if (forceTextTypesSensitive2.includes(resolveDomains2(c.arrayOfCodec))) return listOfCodec(TYPES.text, {
      extensions: {
        listItemNonNull: c.extensions?.listItemNonNull
      }
    });
    return c;
  } else {
    if (forceTextTypesSensitive2.includes(resolveDomains2(c))) return TYPES.text;
    return c;
  }
}
function resolveSqlIdentifier2(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesSensitive2.includes(resolveDomains2(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesSensitive2.includes(resolveDomains2(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
const resolve14 = (i, v) => sql`${i} <> ${v}`;
const resolve15 = (i, v) => sql`${i} IS DISTINCT FROM ${v}`;
const resolve16 = (i, v) => sql`${i} IS NOT DISTINCT FROM ${v}`;
const resolve17 = (i, v) => sql`${i} = ANY(${v})`;
function resolveInputCodec6(c) {
  if (forceTextTypesSensitive2.includes(resolveDomains2(c))) return listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: !0
    }
  });else return listOfCodec(c, {
    extensions: {
      listItemNonNull: !0
    }
  });
}
const resolve18 = (i, v) => sql`${i} <> ALL(${v})`;
const resolve19 = (i, v) => sql`${i} < ${v}`;
const resolve20 = (i, v) => sql`${i} <= ${v}`;
const resolve21 = (i, v) => sql`${i} > ${v}`;
const resolve22 = (i, v) => sql`${i} >= ${v}`;
const resolve23 = (i, v) => sql`${i} LIKE ${v}`;
function escapeLikeWildcards(input) {
  if (typeof input !== "string") throw new Error("Non-string input was provided to escapeLikeWildcards");else return input.split("%").join("\\%").split("_").join("\\_");
}
const resolveInput = input => `%${escapeLikeWildcards(input)}%`;
const resolve24 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolveInput2 = input => `%${escapeLikeWildcards(input)}%`;
const resolve25 = (i, v) => sql`${i} ILIKE ${v}`;
const resolveInput3 = input => `%${escapeLikeWildcards(input)}%`;
const forceTextTypesInsensitive = [TYPES.char, TYPES.bpchar];
function resolveInputCodec7(c) {
  if (c.arrayOfCodec) {
    if (forceTextTypesInsensitive.includes(resolveDomains2(c.arrayOfCodec))) return listOfCodec(TYPES.text, {
      extensions: {
        listItemNonNull: c.extensions?.listItemNonNull
      }
    });
    return c;
  } else {
    if (forceTextTypesInsensitive.includes(resolveDomains2(c))) return TYPES.text;
    return c;
  }
}
function resolveSqlIdentifier3(identifier, c) {
  if (c.arrayOfCodec && forceTextTypesInsensitive.includes(resolveDomains2(c.arrayOfCodec))) return [sql`(${identifier})::text[]`, listOfCodec(TYPES.text, {
    extensions: {
      listItemNonNull: c.extensions?.listItemNonNull
    }
  })];else if (forceTextTypesInsensitive.includes(resolveDomains2(c))) return [sql`(${identifier})::text`, TYPES.text];else return [identifier, c];
}
const resolve26 = (i, v) => sql`${i} NOT ILIKE ${v}`;
const resolveInput4 = input => `%${escapeLikeWildcards(input)}%`;
const resolve27 = (i, v) => sql`${i} LIKE ${v}`;
const resolveInput5 = input => `${escapeLikeWildcards(input)}%`;
const resolve28 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolveInput6 = input => `${escapeLikeWildcards(input)}%`;
const resolve29 = (i, v) => sql`${i} ILIKE ${v}`;
const resolveInput7 = input => `${escapeLikeWildcards(input)}%`;
const resolve30 = (i, v) => sql`${i} NOT ILIKE ${v}`;
const resolveInput8 = input => `${escapeLikeWildcards(input)}%`;
const resolve31 = (i, v) => sql`${i} LIKE ${v}`;
const resolveInput9 = input => `%${escapeLikeWildcards(input)}`;
const resolve32 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolveInput10 = input => `%${escapeLikeWildcards(input)}`;
const resolve33 = (i, v) => sql`${i} ILIKE ${v}`;
const resolveInput11 = input => `%${escapeLikeWildcards(input)}`;
const resolve34 = (i, v) => sql`${i} NOT ILIKE ${v}`;
const resolveInput12 = input => `%${escapeLikeWildcards(input)}`;
const resolve35 = (i, v) => sql`${i} LIKE ${v}`;
const resolve36 = (i, v) => sql`${i} NOT LIKE ${v}`;
const resolve37 = (i, v) => sql`${i} ILIKE ${v}`;
const resolve38 = (i, v) => sql`${i} NOT ILIKE ${v}`;
function resolveInputCodec8(inputCodec) {
  if ("equalTo" === "in" || "equalTo" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier4(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue3(_unused, input, inputCodec) {
  if ("equalTo" === "in" || "equalTo" === "notIn") {
    const sqlList = sqlValueWithCodec(input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = sqlValueWithCodec(input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec9(inputCodec) {
  if ("notEqualTo" === "in" || "notEqualTo" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier5(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue4(_unused, input, inputCodec) {
  if ("notEqualTo" === "in" || "notEqualTo" === "notIn") {
    const sqlList = sqlValueWithCodec(input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = sqlValueWithCodec(input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec10(inputCodec) {
  if ("distinctFrom" === "in" || "distinctFrom" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier6(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue5(_unused, input, inputCodec) {
  if ("distinctFrom" === "in" || "distinctFrom" === "notIn") {
    const sqlList = sqlValueWithCodec(input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = sqlValueWithCodec(input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec11(inputCodec) {
  if ("notDistinctFrom" === "in" || "notDistinctFrom" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier7(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue6(_unused, input, inputCodec) {
  if ("notDistinctFrom" === "in" || "notDistinctFrom" === "notIn") {
    const sqlList = sqlValueWithCodec(input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = sqlValueWithCodec(input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec12(inputCodec) {
  if ("in" === "in" || "in" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier8(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue7(_unused, input, inputCodec) {
  if ("in" === "in" || "in" === "notIn") {
    const sqlList = sqlValueWithCodec(input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = sqlValueWithCodec(input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec13(inputCodec) {
  if ("notIn" === "in" || "notIn" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier9(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue8(_unused, input, inputCodec) {
  if ("notIn" === "in" || "notIn" === "notIn") {
    const sqlList = sqlValueWithCodec(input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = sqlValueWithCodec(input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec14(inputCodec) {
  if ("lessThan" === "in" || "lessThan" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier10(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue9(_unused, input, inputCodec) {
  if ("lessThan" === "in" || "lessThan" === "notIn") {
    const sqlList = sqlValueWithCodec(input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = sqlValueWithCodec(input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec15(inputCodec) {
  if ("lessThanOrEqualTo" === "in" || "lessThanOrEqualTo" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier11(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue10(_unused, input, inputCodec) {
  if ("lessThanOrEqualTo" === "in" || "lessThanOrEqualTo" === "notIn") {
    const sqlList = sqlValueWithCodec(input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = sqlValueWithCodec(input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec16(inputCodec) {
  if ("greaterThan" === "in" || "greaterThan" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier12(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue11(_unused, input, inputCodec) {
  if ("greaterThan" === "in" || "greaterThan" === "notIn") {
    const sqlList = sqlValueWithCodec(input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = sqlValueWithCodec(input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
}
function resolveInputCodec17(inputCodec) {
  if ("greaterThanOrEqualTo" === "in" || "greaterThanOrEqualTo" === "notIn") {
    const t = resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
    return listOfCodec(t, {
      extensions: {
        listItemNonNull: !0
      }
    });
  } else return resolveDomains2(inputCodec) === TYPES.citext ? inputCodec : TYPES.text;
}
function resolveSqlIdentifier13(sourceAlias, codec) {
  return resolveDomains2(codec) === TYPES.citext ? [sourceAlias, codec] : [sql`lower(${sourceAlias}::text)`, TYPES.text];
}
function resolveSqlValue12(_unused, input, inputCodec) {
  if ("greaterThanOrEqualTo" === "in" || "greaterThanOrEqualTo" === "notIn") {
    const sqlList = sqlValueWithCodec(input, inputCodec);
    if (inputCodec.arrayOfCodec === TYPES.citext) return sqlList;else return sql`(select lower(t) from unnest(${sqlList}) t)`;
  } else {
    const sqlValue = sqlValueWithCodec(input, inputCodec);
    if (inputCodec === TYPES.citext) return sqlValue;else return sql`lower(${sqlValue})`;
  }
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
  const $input = fieldArgs.getRaw(["input", "post"]),
    $observer = context().get("observer"),
    $permit = context().get("permit"),
    $db = context().get("db");
  sideEffect([$input, $observer, $permit, $db], async ([input, observer, permit, db]) => {
    if (!input || !observer) throw new Error("Ooops");
    const {
      postTable
    } = lib_db_schema;
    if ("create" !== "create") {
      const [post] = await db.select({
        authorId: postTable.authorId
      }).from(postTable).where(eq(postTable.id, input));
      if (!(await permit.check(observer.id, "create", {
        type: "post",
        attributes: {
          authorId: post.authorId
        },
        tenant: "default"
      }))) throw new Error("Permission denied");
    } else if (!(await permit.check(observer.id, "create", "post"))) throw new Error("Permission denied");
  });
  return plan();
};
function oldPlan4(_, args) {
  const $insert = pgInsertSingle(resource_userPgResource, Object.create(null));
  args.apply($insert);
  return object({
    result: $insert
  });
}
const planWrapper4 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "user"]),
    $observer = context().get("observer"),
    $permit = context().get("permit");
  sideEffect([$input, $observer, $permit], async ([input, observer, permit]) => {
    if ("create" !== "create") {
      if (!observer) throw new Error("Unauthorized");
      if (input !== observer.id) throw new Error("Insufficient permissions");
    }
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
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $permit = context().get("permit"),
    $db = context().get("db");
  sideEffect([$input, $observer, $permit, $db], async ([input, observer, permit, db]) => {
    if (!input || !observer) throw new Error("Ooops");
    const {
      postTable
    } = lib_db_schema;
    if ("update" !== "create") {
      const [post] = await db.select({
        authorId: postTable.authorId
      }).from(postTable).where(eq(postTable.id, input));
      if (!(await permit.check(observer.id, "update", {
        type: "post",
        attributes: {
          authorId: post.authorId
        },
        tenant: "default"
      }))) throw new Error("Permission denied");
    } else if (!(await permit.check(observer.id, "create", "post"))) throw new Error("Permission denied");
  });
  return plan();
};
const oldPlan6 = (_$root, args) => {
  const $update = pgUpdateSingle(resource_userPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($update);
  return object({
    result: $update
  });
};
const planWrapper6 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $permit = context().get("permit");
  sideEffect([$input, $observer, $permit], async ([input, observer, permit]) => {
    if ("update" !== "create") {
      if (!observer) throw new Error("Unauthorized");
      if (input !== observer.id) throw new Error("Insufficient permissions");
    }
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
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $permit = context().get("permit"),
    $db = context().get("db");
  sideEffect([$input, $observer, $permit, $db], async ([input, observer, permit, db]) => {
    if (!input || !observer) throw new Error("Ooops");
    const {
      postTable
    } = lib_db_schema;
    if ("delete" !== "create") {
      const [post] = await db.select({
        authorId: postTable.authorId
      }).from(postTable).where(eq(postTable.id, input));
      if (!(await permit.check(observer.id, "delete", {
        type: "post",
        attributes: {
          authorId: post.authorId
        },
        tenant: "default"
      }))) throw new Error("Permission denied");
    } else if (!(await permit.check(observer.id, "create", "post"))) throw new Error("Permission denied");
  });
  return plan();
};
const oldPlan8 = (_$root, args) => {
  const $delete = pgDeleteSingle(resource_userPgResource, {
    id: args.getRaw(['input', "rowId"])
  });
  args.apply($delete);
  return object({
    result: $delete
  });
};
const planWrapper8 = (plan, _, fieldArgs) => {
  const $input = fieldArgs.getRaw(["input", "rowId"]),
    $observer = context().get("observer"),
    $permit = context().get("permit");
  sideEffect([$input, $observer, $permit], async ([input, observer, permit]) => {
    if ("delete" !== "create") {
      if (!observer) throw new Error("Unauthorized");
      if (input !== observer.id) throw new Error("Insufficient permissions");
    }
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

  """Get a single \`Post\`."""
  post(rowId: UUID!): Post

  """Get a single \`User\`."""
  user(rowId: UUID!): User

  """Get a single \`User\`."""
  userByEmail(email: String!): User

  """Get a single \`User\`."""
  userByIdentityProviderId(identityProviderId: UUID!): User

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
}

"""An object with a globally unique \`ID\`."""
interface Node {
  """
  A globally unique identifier. Can be used in various places throughout the system to identify this single value.
  """
  id: ID!
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

type User {
  rowId: UUID!
  identityProviderId: UUID!
  createdAt: Datetime
  updatedAt: Datetime
  username: String
  firstName: String
  lastName: String
  email: String!

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

  """Filter by the object’s \`email\` field."""
  email: StringFilter

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
A filter to be used against String fields. All fields are combined with a logical ‘and.’
"""
input StringFilter {
  """
  Is null (if \`true\` is specified) or is not null (if \`false\` is specified).
  """
  isNull: Boolean

  """Equal to the specified value."""
  equalTo: String

  """Not equal to the specified value."""
  notEqualTo: String

  """
  Not equal to the specified value, treating null like an ordinary value.
  """
  distinctFrom: String

  """Equal to the specified value, treating null like an ordinary value."""
  notDistinctFrom: String

  """Included in the specified list."""
  in: [String!]

  """Not included in the specified list."""
  notIn: [String!]

  """Less than the specified value."""
  lessThan: String

  """Less than or equal to the specified value."""
  lessThanOrEqualTo: String

  """Greater than the specified value."""
  greaterThan: String

  """Greater than or equal to the specified value."""
  greaterThanOrEqualTo: String

  """Contains the specified string (case-sensitive)."""
  includes: String

  """Does not contain the specified string (case-sensitive)."""
  notIncludes: String

  """Contains the specified string (case-insensitive)."""
  includesInsensitive: String

  """Does not contain the specified string (case-insensitive)."""
  notIncludesInsensitive: String

  """Starts with the specified string (case-sensitive)."""
  startsWith: String

  """Does not start with the specified string (case-sensitive)."""
  notStartsWith: String

  """Starts with the specified string (case-insensitive)."""
  startsWithInsensitive: String

  """Does not start with the specified string (case-insensitive)."""
  notStartsWithInsensitive: String

  """Ends with the specified string (case-sensitive)."""
  endsWith: String

  """Does not end with the specified string (case-sensitive)."""
  notEndsWith: String

  """Ends with the specified string (case-insensitive)."""
  endsWithInsensitive: String

  """Does not end with the specified string (case-insensitive)."""
  notEndsWithInsensitive: String

  """
  Matches the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters.
  """
  like: String

  """
  Does not match the specified pattern (case-sensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters.
  """
  notLike: String

  """
  Matches the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters.
  """
  likeInsensitive: String

  """
  Does not match the specified pattern (case-insensitive). An underscore (_) matches any single character; a percent sign (%) matches any sequence of zero or more characters.
  """
  notLikeInsensitive: String

  """Equal to the specified value (case-insensitive)."""
  equalToInsensitive: String

  """Not equal to the specified value (case-insensitive)."""
  notEqualToInsensitive: String

  """
  Not equal to the specified value, treating null like an ordinary value (case-insensitive).
  """
  distinctFromInsensitive: String

  """
  Equal to the specified value, treating null like an ordinary value (case-insensitive).
  """
  notDistinctFromInsensitive: String

  """Included in the specified list (case-insensitive)."""
  inInsensitive: [String!]

  """Not included in the specified list (case-insensitive)."""
  notInInsensitive: [String!]

  """Less than the specified value (case-insensitive)."""
  lessThanInsensitive: String

  """Less than or equal to the specified value (case-insensitive)."""
  lessThanOrEqualToInsensitive: String

  """Greater than the specified value (case-insensitive)."""
  greaterThanInsensitive: String

  """Greater than or equal to the specified value (case-insensitive)."""
  greaterThanOrEqualToInsensitive: String
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

  """Checks for equality with the object’s \`email\` field."""
  email: String
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
  EMAIL_ASC
  EMAIL_DESC
}

"""
The root mutation type which contains root level fields which mutate data.
"""
type Mutation {
  """Creates a single \`Post\`."""
  createPost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreatePostInput!
  ): CreatePostPayload

  """Creates a single \`User\`."""
  createUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: CreateUserInput!
  ): CreateUserPayload

  """Updates a single \`Post\` using a unique key and a patch."""
  updatePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdatePostInput!
  ): UpdatePostPayload

  """Updates a single \`User\` using a unique key and a patch."""
  updateUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: UpdateUserInput!
  ): UpdateUserPayload

  """Deletes a single \`Post\` using a unique key."""
  deletePost(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeletePostInput!
  ): DeletePostPayload

  """Deletes a single \`User\` using a unique key."""
  deleteUser(
    """
    The exclusive input argument for this mutation. An object type, make sure to see documentation for this object’s fields.
    """
    input: DeleteUserInput!
  ): DeleteUserPayload
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
  username: String
  firstName: String
  lastName: String
  email: String!
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
  username: String
  firstName: String
  lastName: String
  email: String
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
    user(_$root, {
      $rowId
    }) {
      return resource_userPgResource.get({
        id: $rowId
      });
    },
    userByEmail(_$root, {
      $email
    }) {
      return resource_userPgResource.get({
        email: $email
      });
    },
    userByIdentityProviderId(_$root, {
      $identityProviderId
    }) {
      return resource_userPgResource.get({
        identity_provider_id: $identityProviderId
      });
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
    firstName($record) {
      return $record.get("first_name");
    },
    lastName($record) {
      return $record.get("last_name");
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
  PostConnection: {
    __assertStep: ConnectionStep,
    totalCount($connection) {
      return $connection.cloneSubplanWithoutPagination("aggregate").singleAsRecord().select(sql`count(*)`, TYPES.bigint, !1);
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
    email(queryBuilder, value) {
      if (value === void 0) return;
      if (!true && isEmpty(value)) throw Object.assign(new Error("Empty objects are forbidden in filter argument input."), {});
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const condition = new PgCondition(queryBuilder);
      condition.extensions.pgFilterAttribute = colSpec5;
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
  StringFilter: {
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
        inputCodec = resolveInputCodec4 ? resolveInputCodec4(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = resolveSqlValue2 ? resolveSqlValue2($where, value, inputCodec) : sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve12(sqlIdentifier, sqlValue, value, $where, {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve13(sqlIdentifier, sqlValue, value, $where, {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve14(sqlIdentifier, sqlValue, value, $where, {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve15(sqlIdentifier, sqlValue, value, $where, {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve16(sqlIdentifier, sqlValue, value, $where, {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec6 ? resolveInputCodec6(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve17(sqlIdentifier, sqlValue, value, $where, {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec6 ? resolveInputCodec6(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve18(sqlIdentifier, sqlValue, value, $where, {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve19(sqlIdentifier, sqlValue, value, $where, {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve20(sqlIdentifier, sqlValue, value, $where, {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve21(sqlIdentifier, sqlValue, value, $where, {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve22(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "greaterThanOrEqualTo"
        });
      $where.where(fragment);
    },
    includes($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = resolveInput ? resolveInput(value) : value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve23(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "includes"
        });
      $where.where(fragment);
    },
    notIncludes($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = resolveInput2 ? resolveInput2(value) : value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve24(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notIncludes"
        });
      $where.where(fragment);
    },
    includesInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = resolveInput3 ? resolveInput3(value) : value,
        inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve25(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "includesInsensitive"
        });
      $where.where(fragment);
    },
    notIncludesInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = resolveInput4 ? resolveInput4(value) : value,
        inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve26(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notIncludesInsensitive"
        });
      $where.where(fragment);
    },
    startsWith($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = resolveInput5 ? resolveInput5(value) : value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve27(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "startsWith"
        });
      $where.where(fragment);
    },
    notStartsWith($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = resolveInput6 ? resolveInput6(value) : value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve28(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notStartsWith"
        });
      $where.where(fragment);
    },
    startsWithInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = resolveInput7 ? resolveInput7(value) : value,
        inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve29(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "startsWithInsensitive"
        });
      $where.where(fragment);
    },
    notStartsWithInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = resolveInput8 ? resolveInput8(value) : value,
        inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve30(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notStartsWithInsensitive"
        });
      $where.where(fragment);
    },
    endsWith($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = resolveInput9 ? resolveInput9(value) : value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve31(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "endsWith"
        });
      $where.where(fragment);
    },
    notEndsWith($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = resolveInput10 ? resolveInput10(value) : value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve32(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notEndsWith"
        });
      $where.where(fragment);
    },
    endsWithInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = resolveInput11 ? resolveInput11(value) : value,
        inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve33(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "endsWithInsensitive"
        });
      $where.where(fragment);
    },
    notEndsWithInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = resolveInput12 ? resolveInput12(value) : value,
        inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve34(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notEndsWithInsensitive"
        });
      $where.where(fragment);
    },
    like($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve35(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "like"
        });
      $where.where(fragment);
    },
    notLike($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier2 ? resolveSqlIdentifier2(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec5 ? resolveInputCodec5(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve36(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notLike"
        });
      $where.where(fragment);
    },
    likeInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve37(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "likeInsensitive"
        });
      $where.where(fragment);
    },
    notLikeInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier3 ? resolveSqlIdentifier3(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec7 ? resolveInputCodec7(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve38(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notLikeInsensitive"
        });
      $where.where(fragment);
    },
    equalToInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier4 ? resolveSqlIdentifier4(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec8 ? resolveInputCodec8(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = resolveSqlValue3 ? resolveSqlValue3($where, value, inputCodec) : sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve13(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "equalToInsensitive"
        });
      $where.where(fragment);
    },
    notEqualToInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier5 ? resolveSqlIdentifier5(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec9 ? resolveInputCodec9(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = resolveSqlValue4 ? resolveSqlValue4($where, value, inputCodec) : sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve14(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notEqualToInsensitive"
        });
      $where.where(fragment);
    },
    distinctFromInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier6 ? resolveSqlIdentifier6(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec10 ? resolveInputCodec10(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = resolveSqlValue5 ? resolveSqlValue5($where, value, inputCodec) : sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve15(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "distinctFromInsensitive"
        });
      $where.where(fragment);
    },
    notDistinctFromInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier7 ? resolveSqlIdentifier7(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec11 ? resolveInputCodec11(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = resolveSqlValue6 ? resolveSqlValue6($where, value, inputCodec) : sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve16(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notDistinctFromInsensitive"
        });
      $where.where(fragment);
    },
    inInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier8 ? resolveSqlIdentifier8(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec12 ? resolveInputCodec12(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = resolveSqlValue7 ? resolveSqlValue7($where, value, inputCodec) : sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve17(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "inInsensitive"
        });
      $where.where(fragment);
    },
    notInInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier9 ? resolveSqlIdentifier9(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec13 ? resolveInputCodec13(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = resolveSqlValue8 ? resolveSqlValue8($where, value, inputCodec) : sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve18(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "notInInsensitive"
        });
      $where.where(fragment);
    },
    lessThanInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier10 ? resolveSqlIdentifier10(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec14 ? resolveInputCodec14(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = resolveSqlValue9 ? resolveSqlValue9($where, value, inputCodec) : sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve19(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "lessThanInsensitive"
        });
      $where.where(fragment);
    },
    lessThanOrEqualToInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier11 ? resolveSqlIdentifier11(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec15 ? resolveInputCodec15(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = resolveSqlValue10 ? resolveSqlValue10($where, value, inputCodec) : sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve20(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "lessThanOrEqualToInsensitive"
        });
      $where.where(fragment);
    },
    greaterThanInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier12 ? resolveSqlIdentifier12(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec16 ? resolveInputCodec16(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = resolveSqlValue11 ? resolveSqlValue11($where, value, inputCodec) : sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve21(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "greaterThanInsensitive"
        });
      $where.where(fragment);
    },
    greaterThanOrEqualToInsensitive($where, value) {
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
        [sqlIdentifier, identifierCodec] = resolveSqlIdentifier13 ? resolveSqlIdentifier13(sourceAlias, sourceCodec) : [sourceAlias, sourceCodec];
      if (true && value === null) return;
      if (!true && value === null) throw Object.assign(new Error("Null literals are forbidden in filter argument input."), {});
      const resolvedInput = value,
        inputCodec = resolveInputCodec17 ? resolveInputCodec17(codec ?? attribute.codec) : codec ?? attribute.codec,
        sqlValue = resolveSqlValue12 ? resolveSqlValue12($where, value, inputCodec) : sqlValueWithCodec(resolvedInput, inputCodec),
        fragment = resolve22(sqlIdentifier, sqlValue, value, $where, {
          fieldName: parentFieldName ?? null,
          operatorName: "greaterThanOrEqualToInsensitive"
        });
      $where.where(fragment);
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
    },
    email($condition, val) {
      $condition.where({
        type: "attribute",
        attribute: "email",
        callback(expression) {
          return val === null ? sql`${expression} is null` : sql`${expression} = ${sqlValueWithCodec(val, TYPES.text)}`;
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
    },
    EMAIL_ASC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "email",
        direction: "ASC"
      });
      queryBuilder.setOrderIsUnique();
    },
    EMAIL_DESC(queryBuilder) {
      queryBuilder.orderBy({
        attribute: "email",
        direction: "DESC"
      });
      queryBuilder.setOrderIsUnique();
    }
  },
  Mutation: {
    __assertStep: __ValueStep,
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
    createUser: {
      plan(...planParams) {
        const smartPlan = (...overrideParams) => {
            const $prev = oldPlan4(...overrideParams.concat(planParams.slice(overrideParams.length)));
            if (!($prev instanceof ExecutableStep)) {
              console.error(`Wrapped a plan function at ${"Mutation"}.${"createUser"}, but that function did not return a step!
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
    updateUser: {
      plan(...planParams) {
        const smartPlan = (...overrideParams) => {
            const $prev = oldPlan6(...overrideParams.concat(planParams.slice(overrideParams.length)));
            if (!($prev instanceof ExecutableStep)) {
              console.error(`Wrapped a plan function at ${"Mutation"}.${"updateUser"}, but that function did not return a step!
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
    },
    deleteUser: {
      plan(...planParams) {
        const smartPlan = (...overrideParams) => {
            const $prev = oldPlan8(...overrideParams.concat(planParams.slice(overrideParams.length)));
            if (!($prev instanceof ExecutableStep)) {
              console.error(`Wrapped a plan function at ${"Mutation"}.${"deleteUser"}, but that function did not return a step!
${String(oldPlan8)}`);
              throw new Error("Wrapped a plan function, but that function did not return a step!");
            }
            return $prev;
          },
          [$source, fieldArgs, info] = planParams,
          $newPlan = planWrapper8(smartPlan, $source, fieldArgs, info);
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
    },
    username(obj, val, {
      field,
      schema
    }) {
      obj.set("username", bakedInputRuntime(schema, field.type, val));
    },
    firstName(obj, val, {
      field,
      schema
    }) {
      obj.set("first_name", bakedInputRuntime(schema, field.type, val));
    },
    lastName(obj, val, {
      field,
      schema
    }) {
      obj.set("last_name", bakedInputRuntime(schema, field.type, val));
    },
    email(obj, val, {
      field,
      schema
    }) {
      obj.set("email", bakedInputRuntime(schema, field.type, val));
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
    },
    username(obj, val, {
      field,
      schema
    }) {
      obj.set("username", bakedInputRuntime(schema, field.type, val));
    },
    firstName(obj, val, {
      field,
      schema
    }) {
      obj.set("first_name", bakedInputRuntime(schema, field.type, val));
    },
    lastName(obj, val, {
      field,
      schema
    }) {
      obj.set("last_name", bakedInputRuntime(schema, field.type, val));
    },
    email(obj, val, {
      field,
      schema
    }) {
      obj.set("email", bakedInputRuntime(schema, field.type, val));
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
  }
};
export const schema = makeGrafastSchema({
  typeDefs: typeDefs,
  plans: plans
});