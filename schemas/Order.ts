import { integer, text, relationship, virtual } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import formatMoney from '../lib/formatMoney';

export const Order = list({
  fields: {
    // calculated on demand, not stored in db
    label: virtual({
      // not in db so we need to specify the type
      graphQLReturnType: 'String',
      //   function that we pass the item and then return what we want to show!
      resolver(item) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        return `${formatMoney(item.total)}`;
      },
    }),
    total: integer(),
    items: relationship({ ref: 'OrderItem.order', many: true }),
    user: relationship({ ref: 'User.orders' }),
    charge: text(),
  },
  ui: {
    listView: {
      initialColumns: ['user', 'items', 'label', 'charge'],
    },
  },
});
