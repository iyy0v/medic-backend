import { list } from '@keystone-6/core';
import { allowAll } from '@keystone-6/core/access';
import { image, relationship } from '@keystone-6/core/fields';

export const Image = list({
    fields: {
        product: relationship({
            ref: 'Product.images',
            many: false,
    
            ui: {
              displayMode: 'cards',
              cardFields: ['name', 'vendor'],
              inlineEdit: { fields: ['name', 'vendor'] },
              linkToItem: true,
              inlineConnect: true,
            },
        }),
        image: image({ storage: 'my_local_images' }),
    },
    access: allowAll
})