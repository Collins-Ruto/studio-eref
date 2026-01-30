import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {structure} from './structure'

export default defineConfig({
  name: 'default',
  title: 'eref',

  projectId: 'fq24s489',
  dataset: 'production',

  plugins: [
    structureTool(),
    visionTool(),
    structureTool({
      structure: structure,
    }),
  ],

  schema: {
    types: schemaTypes,
  },
})
