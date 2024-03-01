import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { float, image, relationship, text, timestamp } from '@keystone-6/core/fields';

export const Product = list({
    access: allowAll,

    fields: {
      name: text({ validation: { isRequired: true } }),

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

      price: float({ 
        validation: { isRequired: true, min: 0 },
      },),

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

      images: relationship({
        ref: 'Image.product',
        many: true,
        ui: {
          displayMode: 'cards',
          cardFields: ['image'],
          inlineEdit: { fields: ['image'] },
          linkToItem: true,
          inlineConnect: true,
        },
      }),
    } 
})
