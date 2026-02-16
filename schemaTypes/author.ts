import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Full name',
      type: 'string',
      validation: (R) => R.required(),
    }),
    defineField({name: 'title', title: 'Title / Role', type: 'string'}), // e.g. "Volunteer", "Guest Writer"
    defineField({name: 'photo', title: 'Photo', type: 'image', options: {hotspot: true}}),
    defineField({name: 'bio', title: 'Short bio', type: 'text', rows: 3}),
    defineField({
      name: 'link',
      title: 'Link (optional)',
      type: 'url',
      description: 'Personal site / social link',
    }),
    defineField({
      name: 'affiliation',
      title: 'Affiliation (optional)',
      type: 'string',
      description: 'e.g. Independent, University of Nairobi, etc.',
    }),
  ],
})
