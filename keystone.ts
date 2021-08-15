import { config, createSchema } from '@keystone-next/keystone/schema';
import { createAuth } from '@keystone-next/auth';
import {
  withItemData,
  statelessSessions,
} from '@keystone-next/keystone/session';
import { User } from './schemas/User';
import { Product } from './schemas/Product';
import { ProductImage } from './schemas/ProductImage';
import { CartItem } from './schemas/CartItem';
import { Order } from './schemas/Order';
import { OrderItem } from './schemas/OrderItem';
import 'dotenv/config';
import { insertSeedData } from './seed-data';
import { sendPasswordResetEmail } from './lib/mail';
import { extendGraphqlSchema } from './mutations/index';

const databaseURI =
  process.env.DATABASE_URI || 'mongodb://localhost/hello-tutorials';

// config our session, set a cookie (will have a jwt)
const sessionConfig = {
  maxAge: 60 * 60 * 24 * 365, // how long user stays signed in
  secret: process.env.COOKIE_SECRET,
};

// make a function using createAuth method from keystone to add auth to our config
const { withAuth } = createAuth({
  // reference User schema when creating auth (becuase it's user that logs in)
  listKey: 'User',
  // how we identify the user
  identityField: 'email',
  // where we get the info we use to authenticate from
  secretField: 'password',
  // TODO: put session data here if upgrade keystone
  // so we can start right away, not have to turn off auth to create a user (just inits a first user for us)
  initFirstItem: {
    fields: ['name', 'email', 'password'],
    // TODO: add initial roles for admin roles
  },
  // this is an object with an async sendToken method, this method gives us access to args
  passwordResetLink: {
    async sendToken({ token, identity }) {
      // send the email
      await sendPasswordResetEmail(token, identity);
    },
    // set how long token is valid
    tokensValidForMins: 120,
  },
});

// default the keystone config
// everytime this changes you need to reboot :/
export default withAuth(
  config({
    // server config
    server: {
      // set cors to recognize our local front end server during development
      cors: {
        origin: [process.env.FRONTEND_URL],
        credentials: true,
      },
    },
    db: {
      // the adapter we're using is mongoose
      adapter: 'mongoose',
      url: databaseURI,
      // the database has an onConnect function (like a hook) that we can 'hook' into when the db connects
      // this is one option for injecting seed data
      async onConnect(keystone) {
        console.log('connection achieved');
        // the seed data script (in package.json) command includes --seed-data, to run this: npm run seed-data
        if (process.argv.includes('--seed-data')) {
          await insertSeedData(keystone);
        }
      },
    },
    // keystone refers to datatypes as lists
    lists: createSchema({
      // add schema items here
      User,
      Product,
      ProductImage,
      CartItem,
      Order,
      OrderItem,
    }),
    // custom Mutation! you can see this in the graphql playground
    extendGraphqlSchema,
    // where can people access? can they only access via the front end, or can they access via keystone itself
    ui: {
      // Only show ui to people who pass this test (add any logic here, are they an admin... etc...):
      isAccessAllowed: ({ session }) =>
        // console.log(session);
        // the session object (for the first inited user) looks like { listKey: 'User', itemId: 'aldfjlajflk808309830', data: [Object: null prototype] { id: 'aldfjlajflk808309830' }}
        // if there's a session and session.data !! coerces it into a boolean
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
        !!session?.data,
    },
    // set up a session! The session property of the system configuration object allows you to configure session management of your Keystone system. It has a TypeScript type of SessionStrategy<any>. In general you will use SessionStrategy objects from the @keystone-next/keystone/session package, rather than writing this yourself.
    // In a stateless session all session data is stored in a cookie.
    // withItemData is deprecated in newer versions of keystone: https://keystonejs.com/releases/2021-06-02#with-item-data-replaced-with-session-data
    session: withItemData(statelessSessions(sessionConfig), {
      // anything added here is passed along and added to the session object, if you put User: 'id name email', you'd get that info too
      // GraphQL query
      User: 'id email name',
    }),
  })
);
