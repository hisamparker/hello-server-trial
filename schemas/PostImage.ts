import 'dotenv/config';
import { relationship, text } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';
import { cloudinaryImage } from '@keystone-next/cloudinary';

export const cloudinary = {
  cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  apiKey: process.env.CLOUDINARY_KEY,
  apiSecret: process.env.CLOUDINARY_SECRET,
  folder: 'hello-tutorials',
};

export const PostImage = list({
  // keystone knows exactly what to make the input look like and everything so you can easily create / upload images on your keystone dashboard
  fields: {
    image: cloudinaryImage({
      // from the config above
      cloudinary,
      label: 'Source',
    }),
    altText: text(),
    // the image is related to a product, so we reference the Product schema, in the Product schema we reference the ProductImage schema which creates a two-way relationship
    post: relationship({ ref: 'Post.image' }),
  },
  ui: {
    listView: {
      initialColumns: ['image', 'altText', 'post'],
    },
  },
});
