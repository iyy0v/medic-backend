import { list} from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { image, relationship, text, timestamp } from '@keystone-6/core/fields';

export const Product = list({
    access: allowAll,

    fields: {
      title: text({ validation: { isRequired: true } }),

      description: text(),

      tags: relationship({
        ref: 'Tag.products',
        many: true,

        ui: {
          displayMode: 'cards',
          cardFields: ['name'],
          inlineEdit: { fields: ['name'] },
          linkToItem: true,
          inlineConnect: true,
          inlineCreate: { fields: ['name'] },
        },
      }),

      vendor: relationship({
        ref: 'User.publishedProd',
        many: false,

        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineConnect: true,
        },
      }),

      buyers: relationship({
        ref: 'User.historyProd',
        many: true,

        ui: {
          displayMode: 'cards',
          cardFields: ['name', 'email'],
          inlineEdit: { fields: ['name', 'email'] },
          linkToItem: true,
          inlineConnect: true,
        },
      }),

      createdAt: timestamp({
        defaultValue: { kind: 'now' },
      }),

      images: image({ storage: 'my_local_images' }),
    }, 
})
