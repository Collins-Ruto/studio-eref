import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'metaTitle',
      title: 'Meta title',
      type: 'string',
      description: 'If empty, we’ll use the Post Title',
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: 'metaDescription',
      title: 'Meta description',
      type: 'text',
      rows: 2,
      description: 'If empty, we’ll use the Excerpt',
      validation: (Rule) => Rule.max(180),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social share image (optional)',
      type: 'image',
      options: {hotspot: true},
      description: 'Overrides cover image for link previews',
    }),
    defineField({
      name: 'noIndex',
      title: 'No index',
      type: 'boolean',
      initialValue: false,
      description: 'Ask search engines not to index this page',
    }),
  ],
})
