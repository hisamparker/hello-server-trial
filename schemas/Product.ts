import { list } from '@keystone-next/keystone/schema';
import { integer, relationship, select, text } from '@keystone-next/fields';

export const Product = list({
  // TODO: access
  fields: {
    name: text({ isRequired: true }),
    slug: text(),
    description: text({
      ui: {
        // how we're going to input it
        displayMode: 'textarea',
      },
    }),
    // the product is related to an image, so we reference the ProductImage schema, in the ProductImage schema we reference the Product schema which creates a two-way relationship
    image: relationship({
      ref: 'ProductImage.product',
      ui: {
        // sets the display to card because that's nice for editing images
        displayMode: 'cards',
        // the fileds we want to see are image and altText, same for when we want to create or edti
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },
    }),
    status: select({
      // when adding / editing an item we can set it to draft, unavailable, available ui options have to do with what the keystone ui looks like for the admin! there are tons of options
      options: [
        { label: 'Draft', value: 'DRAFT' },
        { label: 'Available', value: 'AVAILABLE' },
        { label: 'Unavailable', value: 'UNAVAILABLE' },
      ],
      defaultValue: 'DRAFT',
      // for a radio input use:
      ui: { displayMode: 'segmented-control' },
    }),
    // price in in cents to avoid decimal and rounding issues
    price: integer(),
  },
  ui: {
    listView: {
      initialColumns: ['name', 'description', 'status', 'price'],
    },
  },
});
