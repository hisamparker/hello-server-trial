/* eslint-disable */
import { KeystoneContext, SessionStore } from '@keystone-next/types';
import { Session } from '../types';

import { CartItemCreateInput } from '../.keystone/schema-types';

const addToCart = async(
    // type is any
  root: any,
  // productId, we know is type string
  { productId }: { productId: string },
  // this is from KeystoneContext (we get the session from this!)
  context: KeystoneContext
//   type is a promis, the promise resolves a type of CartItemCreateInput which is typed by keystone
): Promise<CartItemCreateInput> => {
  // 1. Query the current user see if they are signed in
  // we need to pass the context to get the session, we need the user to be logged in, we check that by looking at the session
  // we type it as Session and if they're not logged in error
  const session = context.session as Session;
  if (!session.itemId) {
    throw new Error('You must be logged in to do this!');
  }
  // 2. Query the current users cart to see if the item is there already
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: session.itemId }, product: { id: productId } },
    // we need to explicitly say what we want back with keystone mutations
    resolveFields: 'id'
  });
  // grab existingCartItem by destructuring it from allCartitems, there will only be one item in there and we name it whatever because array destructuring
  const [existingCartItem] = allCartItems;
  //check to see if the item already exists in the user's cart
  if (existingCartItem) {
    // if it exists return an error because they can't purchase multiples of the shit I'm selling
    throw new Error('Hey, you already added that tutorial!');
  }
  // if there isn't this item in the cart, add it / create it we grab the data from the front end to create
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: { id: productId }},
      user: { connect: { id: session.itemId }},
    },
    resolveFields: false,
  })
}

export default addToCart;