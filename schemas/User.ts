import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { permissions } from "../access";
import {
    text,
    relationship,
    password,
    timestamp,
    checkbox,
} from '@keystone-6/core/fields';
  


export const User = list({
    fields: {
        name: text({ 
            validation: { isRequired: true },
            isFilterable: true
        }),

        email: text({
            validation: { isRequired: true },
            isIndexed: 'unique',
            isFilterable: true
        }),

        password: password({ validation: { isRequired: true } }),

        // we can use this field to see what Posts this User has authored
        //   more on that in the Post list below
        posts: relationship({ ref: 'Post.author', many: true }),

        role: relationship({
            ref: "Role.assignedTo",
            access: {
                create: permissions.canManageUsers,
                update: permissions.canManageUsers,
            },
        }),

        createdAt: timestamp({
            defaultValue: { kind: 'now' },
        }),

        isInitialUser: checkbox({
            defaultValue: false,
            ui: {
              createView: { fieldMode: "hidden" },
              itemView: { fieldMode: "hidden" },
            },
        }),
    },

    ui: {
        listView: {
            initialColumns: ["name", "role"],
        },
    },

    hooks: {
        afterOperation: async ({ operation, item, context }) => {
            if (operation === "create" && item?.isInitialUser) {
                const allPermissions: { [key: string]: boolean } = {};
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
                                    id: item.id,
                                },
                            ],
                        },
                    },
                });
                if(item) item.roleId = superAdminRole.id;
            }
        },
    },
    access: allowAll
})