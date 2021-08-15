// keystone types our schema inputs for us, but we need to input them here
import {
  CartItemCreateInput,
  OrderCreateInput,
} from '../.keystone/schema-types';

/* eslint-disable */
  import { KeystoneContext } from '@keystone-next/types';
  
  import stripeConfig from '../lib/stripe';
  
  // just for format highlighting
  const graphql = String.raw;
  
  // we need to give arguments a type
  interface Arguments {
    token: string
  }
  
  const checkout = async(
    root: any,
    { token }: Arguments,
    context: KeystoneContext
  ): Promise<OrderCreateInput> => {
    // 1. Make sure they are signed in, just like add to cart
    const userId = context.session.itemId;
    console.log('idididi',userId)
    if(!userId) {
      //    TODO replace with status and message?
      throw new Error('Sorry! You must be signed in to create an order!')
    }
    // Query the current user so we can populate their info and their cart info, we want to save the prodicts in their cart in case
    // these items change later
    const user = await context.lists.User.findOne({
      where: { id: userId },
      resolveFields: graphql`
        id
        name
        email
        cart {
          id
          product {
            name
            price
            description
            id
            image {
              id
              image {
                id
                publicUrlTransformed
              }
            }
          }
        }
      `
    });
    console.log('user', user)
    console.dir(user, { depth: null })
    // 2. calc the total price for their order
    const cartItems = user.cart.filter(cartItem => cartItem.product);
    const amount = cartItems.reduce(function(tally: number, cartItem: CartItemCreateInput) {
      return tally + cartItem.product.price;
    }, 0);
    console.log(amount);
    // 3. create the charge with the stripe library https://stripe.com/docs/payments/payment-intents
    // https://stripe.com/docs/payments/accept-a-payment?platform=web&ui=checkout#set-up-stripecons
    const charge = await stripeConfig.paymentIntents.create({
      amount,
      currency: 'EUR',
      // charge card immediately
      confirm: true,
      // token sent from browser
      payment_method: token,
      // send user an email
      receipt_email: user.email,
    }).catch(err => {
      console.log(err);
      throw new Error(err.message);
    });
    console.log(charge)
    // 4. Convert the cartItems to OrderItems
    const orderItems = cartItems.map(cartItem => {
      const orderItem = {
        name: cartItem.product.name,
        description: cartItem.product.description,
        price: cartItem.product.price,
        image: { connect: { id: cartItem.product.image.id }},
        product: { connect: { id: cartItem.product.id }},
      }
      const updateTutorial = async () => {
        const tutProduct = await context.lists.Product.findOne({
          where: {
            id: cartItem.product.id,
          },
          resolveFields: 'id, users',
        });
        console.log('42424', tutProduct.id, tutProduct.users)
        const {id, users} = tutProduct;
        if (users) {
          await context.lists.Product.updateOne({
            id: id,
            data: { users: [...users, userId] },
          });
        } else {
          await context.lists.Product.updateOne({
            id: id,
            data: { users: userId },
          });
        }
      };
      updateTutorial();
      return orderItem;
    })
    console.log('gonna create the order')
    // 5. Create the order and return it
    const order = await context.lists.Order.createOne({
      data: {
        total: charge.amount,
        charge: charge.id,
        items: { create: orderItems },
      //   use connect to connect the order to the user, user has an orders field that refs order schema
        user: { connect: { id: userId }}
      },
      resolveFields: false,
    });
    // Order looks like:
  //   data: Object { checkout: {…} }
  // checkout: Object { id: "61111f7f7325d10be93c3421", charge: "pi_3JMXazHsfCEsT9yw0j76Ytcl", total: 2898, … }
  // __typename: "Order"
  // charge: "pi_3JMXazHsfCEsT9yw0j76Ytcl"
  // id: "61111f7f7325d10be93c3421"
  // items: Array [ {…}, {…} ]​
  // 0: Object { id: "61111f7f7325d10be93c341f", name: "Git for Silly Devs", __typename: "OrderItem" }​
  // 1: Object { id: "61111f7f7325d10be93c3420", name: "Caffein for Devs", __typename: "OrderItem" }​
  // length: 2​
  // <prototype>: Array []
  // total: 2898
    // 6. Clean up any old cart item, delete everything from user's cart
    const cartItemIds = user.cart.map(cartItem => cartItem.id);
    console.log('gonna create delete cartItems')
    await context.lists.CartItem.deleteMany({
      //   expects an array of strings which we created about
      ids: cartItemIds
    });
    return order;
  }
  
  export default checkout;
  
