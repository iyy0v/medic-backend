"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// keystone.ts
var keystone_exports = {};
__export(keystone_exports, {
  default: () => keystone_default
});
module.exports = __toCommonJS(keystone_exports);
var import_core5 = require("@keystone-6/core");

// schemas/User.ts
var import_core = require("@keystone-6/core");
var import_access = require("@keystone-6/core/access");

// schemas/fields.ts
var import_fields = require("@keystone-6/core/fields");
var permissionFields = {
  canManageProducts: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "User can Update and delete any product"
  }),
  canSeeOtherUsers: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "User can query other users"
  }),
  canManageUsers: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "User can Edit other users"
  }),
  canManageRoles: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "User can CRUD roles"
  }),
  canManageCart: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "User can see and manage cart and cart items"
  }),
  canManageOrders: (0, import_fields.checkbox)({
    defaultValue: false,
    label: "User can see and manage orders"
  })
};
var permissionsList = Object.keys(permissionFields);

// access.ts
var generatedPermissions = Object.fromEntries(
  permissionsList.map((permission) => [
    permission,
    function({ session: session2 }) {
      return session2?.data.role?.[permission];
    }
  ])
);
var permissions = {
  ...generatedPermissions
};

// schemas/User.ts
var import_fields3 = require("@keystone-6/core/fields");
var User = (0, import_core.list)({
  fields: {
    name: (0, import_fields3.text)({
      validation: { isRequired: true },
      isFilterable: true
    }),
    email: (0, import_fields3.text)({
      validation: { isRequired: true },
      isIndexed: "unique",
      isFilterable: true
    }),
    password: (0, import_fields3.password)({ validation: { isRequired: true } }),
    // we can use this field to see what Posts this User has authored
    //   more on that in the Post list below
    posts: (0, import_fields3.relationship)({ ref: "Post.author", many: true }),
    role: (0, import_fields3.relationship)({
      ref: "Role.assignedTo",
      access: {
        create: permissions.canManageUsers,
        update: permissions.canManageUsers
      }
    }),
    createdAt: (0, import_fields3.timestamp)({
      defaultValue: { kind: "now" }
    }),
    isInitialUser: (0, import_fields3.checkbox)({
      defaultValue: false,
      ui: {
        createView: { fieldMode: "hidden" },
        itemView: { fieldMode: "hidden" }
      }
    })
  },
  ui: {
    listView: {
      initialColumns: ["name", "role"]
    }
  },
  hooks: {
    afterOperation: async ({ operation, item, context }) => {
      if (operation === "create" && item?.isInitialUser) {
        const allPermissions = {};
        Object.keys(permissions).forEach((key) => {
          allPermissions[key] = true;
        });
        const superAdminRole = await context.db.Role.createOne({
          data: {
            name: "SuperAdmin",
            ...allPermissions,
            assignedTo: {
              connect: [
                {
                  id: item.id
                }
              ]
            }
          }
        });
        if (item)
          item.roleId = superAdminRole.id;
      }
    }
  },
  access: import_access.allowAll
});

// schemas/Role.ts
var import_core2 = require("@keystone-6/core");
var import_fields4 = require("@keystone-6/core/fields");
var Role = (0, import_core2.list)({
  access: {
    operation: {
      create: permissions.canManageRoles,
      query: permissions.canManageRoles,
      update: permissions.canManageRoles,
      delete: permissions.canManageRoles
    }
  },
  fields: {
    name: (0, import_fields4.text)({ validation: { isRequired: true } }),
    ...permissionFields,
    assignedTo: (0, import_fields4.relationship)({
      ref: "User.role",
      many: true,
      ui: {
        itemView: { fieldMode: "read" }
      }
    })
  },
  ui: {
    hideCreate: (args) => !permissions.canManageRoles(args),
    hideDelete: (args) => !permissions.canManageRoles(args),
    isHidden: (args) => !permissions.canManageRoles(args),
    listView: {
      initialColumns: ["name", "assignedTo"]
    }
  }
});

// schemas/Post.ts
var import_core3 = require("@keystone-6/core");
var import_access4 = require("@keystone-6/core/access");
var import_fields6 = require("@keystone-6/core/fields");
var import_fields_document = require("@keystone-6/fields-document");
var Post = (0, import_core3.list)({
  // WARNING
  //   for this starter project, anyone can create, query, update and delete anything
  //   if you want to prevent random people on the internet from accessing your data,
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  access: import_access4.allowAll,
  // this is the fields for our Post list
  fields: {
    title: (0, import_fields6.text)({ validation: { isRequired: true } }),
    // the document field can be used for making rich editable content
    //   you can find out more at https://keystonejs.com/docs/guides/document-fields
    content: (0, import_fields_document.document)({
      formatting: true,
      layouts: [
        [1, 1],
        [1, 1, 1],
        [2, 1],
        [1, 2],
        [1, 2, 1]
      ],
      links: true,
      dividers: true
    }),
    // with this field, you can set a User as the author for a Post
    author: (0, import_fields6.relationship)({
      // we could have used 'User', but then the relationship would only be 1-way
      ref: "User.posts",
      // this is some customisations for changing how this will look in the AdminUI
      ui: {
        displayMode: "cards",
        cardFields: ["name", "email"],
        inlineEdit: { fields: ["name", "email"] },
        linkToItem: true,
        inlineConnect: true
      },
      // a Post can only have one author
      //   this is the default, but we show it here for verbosity
      many: false
    }),
    // with this field, you can add some Tags to Posts
    tags: (0, import_fields6.relationship)({
      // we could have used 'Tag', but then the relationship would only be 1-way
      ref: "Tag.posts",
      // a Post can have many Tags, not just one
      many: true,
      // this is some customisations for changing how this will look in the AdminUI
      ui: {
        displayMode: "cards",
        cardFields: ["name"],
        inlineEdit: { fields: ["name"] },
        linkToItem: true,
        inlineConnect: true,
        inlineCreate: { fields: ["name"] }
      }
    })
  }
});

// schemas/Tag.ts
var import_core4 = require("@keystone-6/core");
var import_access5 = require("@keystone-6/core/access");
var import_fields7 = require("@keystone-6/core/fields");
var Tag = (0, import_core4.list)({
  // WARNING
  //   for this starter project, anyone can create, query, update and delete anything
  //   if you want to prevent random people on the internet from accessing your data,
  //   you can find out more at https://keystonejs.com/docs/guides/auth-and-access-control
  access: import_access5.allowAll,
  // setting this to isHidden for the user interface prevents this list being visible in the Admin UI
  // this is the fields for our Tag list
  fields: {
    name: (0, import_fields7.text)(),
    // this can be helpful to find out all the Posts associated with a Tag
    posts: (0, import_fields7.relationship)({ ref: "Post.tags", many: true })
  }
});

// schema.ts
var lists = {
  User,
  Role,
  Post,
  Tag
};

// auth.ts
var import_crypto = require("crypto");
var import_auth = require("@keystone-6/auth");
var import_session = require("@keystone-6/core/session");
var sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret && process.env.NODE_ENV !== "production") {
  sessionSecret = (0, import_crypto.randomBytes)(32).toString("hex");
}
var { withAuth } = (0, import_auth.createAuth)({
  listKey: "User",
  identityField: "email",
  secretField: "password",
  initFirstItem: {
    fields: ["name", "email", "password"],
    itemData: {
      isInitialUser: true
    }
  },
  sessionData: `id name email role { ${permissionsList.join(" ")} }`,
  passwordResetLink: {
    async sendToken(args) {
    }
  }
});
var sessionMaxAge = 60 * 60 * 24 * 30;
var session = (0, import_session.statelessSessions)({
  maxAge: sessionMaxAge,
  secret: sessionSecret
});

// keystone.ts
var keystone_default = withAuth(
  (0, import_core5.config)({
    db: {
      // we're using sqlite for the fastest startup experience
      //   for more information on what database might be appropriate for you
      //   see https://keystonejs.com/docs/guides/choosing-a-database#title
      provider: "sqlite",
      url: "file:./keystone.db"
    },
    lists,
    session
  })
);
//# sourceMappingURL=config.js.map
