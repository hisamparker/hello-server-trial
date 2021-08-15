import { list } from '@keystone-next/keystone/schema';
import { text, password, relationship } from '@keystone-next/fields';

// like with mongoose in express, but with keystone we import list instead of schema
// for this to show up in our keystone dashboard we need to pass it into the kestone config
// (using a named export makes auto import easier)
export const User = list({
  // TDO: acess, ui
  // all the fields we want, just like mongoose
  fields: {
    // inside text you add options (like mongoose)
    name: text({ isRequired: true }),
    email: text({ isRequired: true, isUnique: true }),
    password: password(),
    cart: relationship({
      ref: 'CartItem.user',
      // there will be multiple items
      many: true,
      ui: {
        createView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
    orders: relationship({
      ref: 'Order.user',
      many: true,
    }),
  },
  // sets the default view in the keystone gui, I LOVE THIS
  ui: {
    listView: {
      initialColumns: ['name', 'email'],
    },
  },
});
