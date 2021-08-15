import { list } from '@keystone-next/keystone/schema';
import { integer, relationship } from '@keystone-next/fields';

export const CartItem = list({
  fields: {
    // TODO create a label
    quantity: integer({
      defaultValue: 1,
      isRequired: true,
    }),
    // one way relationship
    product: relationship({ ref: 'Product' }),
    // the cart item is related to the user, so we reference the User schema, we add .cart which creates a two-way relationship
    user: relationship({ ref: 'User.cart' }),
  },
  ui: {
    listView: {
      initialColumns: ['product', 'user'],
    },
  },
});
