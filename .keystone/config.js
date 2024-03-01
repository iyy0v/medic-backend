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
  })
  // canManageCart: checkbox({
  //   defaultValue: false,
  //   label: "User can see and manage cart and cart items",
  // }),
  // canManageOrders: checkbox({
  //   defaultValue: false,
  //   label: "User can see and manage orders",
  // }),
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
    gender: (0, import_fields3.select)({
      type: "enum",
      options: [
        { label: "Male", value: "M" },
        { label: "Female", value: "F" }
      ]
    }),
    birthdate: (0, import_fields3.timestamp)(),
    email: (0, import_fields3.text)({
      validation: { isRequired: true },
      isIndexed: "unique",
      isFilterable: true
    }),
    password: (0, import_fields3.password)({ validation: { isRequired: true } }),
    publishedProd: (0, import_fields3.relationship)({ ref: "Product.vendor", many: true }),
    historyProd: (0, import_fields3.relationship)({ ref: "Product.buyers", many: true }),
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

// schemas/Product.ts
var import_core3 = require("@keystone-6/core");
var import_access4 = require("@keystone-6/core/access");
var import_fields6 = require("@keystone-6/core/fields");
var Product = (0, import_core3.list)({
  access: import_access4.allowAll,
  fields: {
    title: (0, import_fields6.text)({ validation: { isRequired: true } }),
    description: (0, import_fields6.text)(),
    tags: (0, import_fields6.relationship)({
      ref: "Tag.products",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: ["name"],
        inlineEdit: { fields: ["name"] },
        linkToItem: true,
        inlineConnect: true,
        inlineCreate: { fields: ["name"] }
      }
    }),
    vendor: (0, import_fields6.relationship)({
      ref: "User.publishedProd",
      many: false,
      ui: {
        displayMode: "cards",
        cardFields: ["name", "email"],
        inlineEdit: { fields: ["name", "email"] },
        linkToItem: true,
        inlineConnect: true
      }
    }),
    buyers: (0, import_fields6.relationship)({
      ref: "User.historyProd",
      many: true,
      ui: {
        displayMode: "cards",
        cardFields: ["name", "email"],
        inlineEdit: { fields: ["name", "email"] },
        linkToItem: true,
        inlineConnect: true
      }
    }),
    createdAt: (0, import_fields6.timestamp)({
      defaultValue: { kind: "now" }
    }),
    images: (0, import_fields6.image)({ storage: "my_local_images" })
  }
});

// schemas/Tag.ts
var import_core4 = require("@keystone-6/core");
var import_access5 = require("@keystone-6/core/access");
var import_fields7 = require("@keystone-6/core/fields");
var Tag = (0, import_core4.list)({
  access: import_access5.allowAll,
  fields: {
    name: (0, import_fields7.text)(),
    products: (0, import_fields7.relationship)({ ref: "Product.tags", many: true })
  }
});

// schema.ts
var lists = {
  User,
  Role,
  Product,
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
      provider: "sqlite",
      url: "file:./keystone.db"
    },
    lists,
    session,
    storage: {
      my_local_images: {
        // Images that use this store will be stored on the local machine
        kind: "local",
        // This store is used for the image field type
        type: "image",
        // The URL that is returned in the Keystone GraphQL API
        generateUrl: (path) => `http://localhost:3000/images${path}`,
        // The route that will be created in Keystone's backend to serve the images
        serverRoute: {
          path: "/images"
        },
        // Set serverRoute to null if you don't want a route to be created in Keystone
        // serverRoute: null
        storagePath: "public/images"
      }
    }
  })
);
//# sourceMappingURL=config.js.map
