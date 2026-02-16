import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'pullQuote',
  title: 'Pull Quote',
  type: 'object',
  fields: [
    defineField({
      name: 'quote',
      title: 'Quote text',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'speaker',
      title: 'Speaker',
      type: 'string',
      description: 'Person being quoted (optional)',
    }),
    defineField({
      name: 'context',
      title: 'Context',
      type: 'string',
      description: 'Optional: e.g. “2026 Marathon Winner”',
    }),
  ],
  preview: {
    select: {title: 'quote', subtitle: 'speaker'},
    prepare({title, subtitle}) {
      const t = (title || '').trim()
      const short = t.length > 60 ? `${t.slice(0, 60)}…` : t || 'Pull Quote'
      return {title: short, subtitle: subtitle ? `— ${subtitle}` : ''}
    },
  },
})
