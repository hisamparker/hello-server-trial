# Learnings

Create a main folder
Git init and add git ignore in the main folder
Make the main branch main and chill on that branch git branch -M main
Make a remote repo on Github
Add the remote : git remote add origin <link github gives youuououo>
Stage the starter files: from the main folder $ git add .
Commint the starter files: from the main folder $ git commit -m "starter files"
Push the files to your remote: git push -u origin main
Only capitalize the first letter of a file if it's a (reusable) component (like with classes) not for pages
2 special files in next js that allow you to access all the things 
1) _app.js :
Next.js uses the App component to initialize pages. You can override it by creating an _app.js file in the pages folder, and then control the page initialization. https://nextjs.org/docs/advanced-features/custom-app
So you can:
    - Persist layout between page changes
    - Keep state when navigating pages
    - Create custom error handling using componentDidCatch
    - Inject additional data into pages
    - Add global CSS
    Your custom app needs two props passed into it: Component and pageProps.
        - The Component prop is the active page, so whenever you navigate between routes, Component will change to the new page. Therefore, any props you send to Component will be received by the page. 
        - pageProps is an object with the initial props that were preloaded for your page by one of Next's data fetching methods, otherwise it's an empty object.
    You'll add a Page component inside your custom app, then add the Component component and spread the pageProps into it as a prop
    *** after creating / implementing _app.js you'll need to restart the server to see changes
2) _document :
Use a custom Document to add / change <html> and <body> tags. Because Next.js pages skip the definition surrounding document's markup, you'll need this to customize anything related to HTM, like add GoogleFonts or change the lang :D To override the default Document, create an _document.js file in your pages folder and extend the Document class... Your document needs to be a class component to do this, weird huh!
````
class MyDocument extends Document {
    static async getInitialProps(ctx) {
        const initialProps = await Document.getInitialProps(ctx)
        return { ...initialProps }
    }
    render() {
        return (
            <Html>
                <Head />
                <body>
                <Main />
                <NextScript />
                </body>
            </Html>
        )
    }
}
````
To link to a page, use the next Link component, this will push you to the new url real fast no jumpiness!
````
import Link from 'next/link';
<Link href="/">hello</Link>
````
If you run into weird errors, or fix something and it doesn't seem to take, try deleting the .next file where all the cache is :D
For the backend, use keystone with mongodb

Graph ql is an idea!  GraphQL is a syntax that describes how to ask for data, and is generally used to load data from a server to a client. It's a specification that's used by things like keystone. GraphQL is typed :D
https://www.graphqlbin.com/v2/new

You right queries and mutations.

Queries pull data down from the api. With GraphQL, you have to explicitly ask for the data that you want. You enter a query that looks like an object but without the values:
````
query {
    allProducts {
        name
        description
        price
    }
} 
````
and you get back a json object with all the values! So, you don't need to specify a ton of different end points! It's also relational, so you can nest requests and get relational data:
````
query {
    allUsers {
        name
        email
        cart {
            id
            product {
                name 
                price
            }
        }
    }
} 
````

Mutations send up the data, create new data and update data.

````
mutation {
    updateUser(id: "adshfjshdfkj", data: {
        passwordRestToken: "sldjfljks"
    }) {
        passwordResetToken_is_set
        magicAuthIssuedAt
        magicAuthRedeemedAt
        magicAuthToken_is_set
    }
} 
````

KeystoneJS
Keystone.js provides a standardized set of components that allow for fast and easy development of web applications that can be quickly developed, maintained, and extended.

Keystone.js has a number of key features that makes it worth using including:

    - Modularity - Keystone will configure express - the de facto web server for node.js - for you and connect to your MongoDB      database using Mongoose, the leading ODM package.
    - Auto-generated Admin UI - Whether you use it while you’re building out your application, or in production as a database content management system, Keystone’s Admin UI will save you time and make managing your data easy.
    - Session Management - Keystone comes ready out of the box with session management and authentication features, including automatic encryption for password fields.
    - Email Sending - Keystone makes it easy to set up, preview, and send template-based emails for your application. It also integrates with Mandrill.
    - Form Processing - Want to validate a form, upload an image, and update your database with a single line? Keystone can do that, based on the data models you’ve already defined.
Resources : https://www.pullrequest.com/blog/keystonejs-and-graphql-crash-course-book-headless-cms/

BASICS: 

Lists

Lists are a way of representing data. If you worked with Node.js and MongoDB, you could associate lists with models. For instance, in this application, we have a list for users. That is a model for the user. The list specifies what you store about each user, where the fields come into play. Read more about lists here.

Fields

Lists are made of fields. A field represents a piece of information (in our example, information about the user). For instance, in the “user” list, you might add fields such as:

    firstName
    lastName
    email
    … etc.

Remember to use th graphql playground connecting to your keystone cms.
Hint, on a mac, option space shows you all the available options! From your Dashboard click the ... near your username and select API Explorer to open the playground

Apollo Client

Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. Use it to fetch, cache, and modify application data, all while automatically updating your UI.

Features

    - Declarative data fetching: Write a query and receive data without manually tracking loading states.
    - Excellent developer experience: Enjoy helpful tooling for TypeScript, Chrome / Firefox devtools, and VS Code.
    - Designed for modern React: Take advantage of the latest React features, such as hooks.
    - Incrementally adoptable: Drop Apollo into any JavaScript app and incorporate it feature by feature.
    - Universally compatible: Use any build setup and any GraphQL API.
    - Community driven: Share knowledge with thousands of developers in the GraphQL community.
https://www.apollographql.com/docs/react/#features

We use this for pagination! Apollo looks at cache to be quick!

Apollo client is made up of a bunch of links, each link is responsable for handling how to deal with outgoing request and responses and the cache. We need a cache, and fetch, and pushing data. They don't handle image uploads, so we use a third party package and that's tricky!