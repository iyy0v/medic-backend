import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { relationship, text } from '@keystone-6/core/fields';

export const Tag = list({
    access: allowAll,

    fields: {
      name: text(),
      products: relationship({ ref: 'Product.tags', many: true }),
    },

})