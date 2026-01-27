/* eslint-disable no-undef */
import 'dotenv/config'
import fs from 'node:fs'
import path from 'node:path'
import { createClient } from '@sanity/client'

const BLOGS_JSON_PATH = path.resolve('./assets/blogs.json') // change if needed
const IMAGES_ROOT = path.resolve(process.cwd()) // set to your site root if images are relative

const AUTHOR_ID = '4f430d7c-08bc-4bea-87f2-d5e79081b398'

const client = createClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_TOKEN,
  apiVersion: '2025-01-01',
  useCdn: false,
})

function slugify(input = '') {
  return input
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .slice(0, 96)
}

function parsePublishDate(str) {
  const d = new Date(str)
  return Number.isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString()
}

function paragraphToBlock(text) {
  return {
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [{_type: 'span', text: text ?? '', marks: []}],
  }
}

async function uploadCoverImage(localRelativePath, title) {
  if (!localRelativePath) return null

  const abs = path.resolve(IMAGES_ROOT, localRelativePath)
  if (!fs.existsSync(abs)) {
    console.warn(`⚠️ Image not found: ${abs} (skipping coverImage)`)
    return null
  }

  const stream = fs.createReadStream(abs)
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(abs),
    title,
  })

  return asset?._id ?? null
}

async function run() {
  // quick check that author exists
  const author = await client.fetch(`*[_type=="author" && _id==$id][0]{_id,name}`, {id: AUTHOR_ID})
  if (!author?._id) throw new Error(`Author not found for id: ${AUTHOR_ID}`)
  console.log(`Using author: ${author.name} (${author._id})`)

  const blogs = JSON.parse(fs.readFileSync(BLOGS_JSON_PATH, 'utf8'))

  for (const b of blogs) {
    const postId = `post-${b.id}-${slugify(b.title)}`

    const body = []
    for (const s of b?.content?.sections ?? []) {
      if (s.type === 'paragraph') body.push(paragraphToBlock(s.content))
      if (s.type === 'quote') body.push({_type: 'pullQuote', quote: s.content ?? ''})
    }

    const tagSet = new Set([...(b.tags ?? []), ...(b.categories ?? [])].map(String))
    const tags = Array.from(tagSet).filter(Boolean)

    const coverAssetId = await uploadCoverImage(b.image, b.title)

    const doc = {
      _id: postId,
      _type: 'post',
      title: b.title,
      excerpt: b.description ?? '',
      slug: {_type: 'slug', current: slugify(b.title)},
      publishedAt: parsePublishDate(b.publishDate),
      tags,
      author: {_type: 'reference', _ref: AUTHOR_ID},
      body,
      ...(coverAssetId
        ? {coverImage: {_type: 'image', asset: {_type: 'reference', _ref: coverAssetId}}}
        : {}),
    }

    await client.createOrReplace(doc)
    console.log(`✅ Imported: ${b.title}`)
  }

  console.log('🎉 Done.')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
