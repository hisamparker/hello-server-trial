import { relationship, select, text, timestamp } from '@keystone-next/fields';
import { list } from '@keystone-next/keystone/schema';

export const Post = list({
  fields: {
    title: text(),
    // TODO: expand this out into a proper example project
    // Enable this line to test custom field views
    // test: text({ ui: { views: require.resolve('./admin/fieldViews/Test.tsx') } }),
    status: select({
      options: [
        { label: 'Published', value: 'published' },
        { label: 'Draft', value: 'draft' },
      ],
      ui: {
        displayMode: 'segmented-control',
      },
    }),
    product: relationship({
      ref: 'Product.post',
    }),
    image: relationship({
      ref: 'PostImage.post',
      ui: {
        // sets the display to card because that's nice for editing images
        displayMode: 'cards',
        // the fileds we want to see are image and altText, same for when we want to create or edti
        cardFields: ['image', 'altText'],
        inlineCreate: { fields: ['image', 'altText'] },
        inlineEdit: { fields: ['image', 'altText'] },
      },
    }),
    content: text({
      ui: {
        displayMode: 'textarea',
      },
    }),
    publishDate: timestamp(),
  },
});
