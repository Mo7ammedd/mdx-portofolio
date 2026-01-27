#!/usr/bin/env tsx

import { promises as fs } from 'fs'
import path from 'path'
import { generateOGImageForPost } from '../lib/og-generator'

// Blog posts data (copied to avoid React import issues)
const BLOG_POSTS = [
  {
    title: 'Difference Between Cluster and Non-Cluster Index',
    description:
      'An index is a disk-based structure linked to a table or view that speeds up the retrieval of rows.',
    link: '/blog/difference-between-cluster-and-non-cluster-index',
    uid: 'blog-1',
  },
  {
    title: '3 Ways to Build Custom Middleware in ASP.NET Core',
    description:
      'Middleware is software that is assembled into an app pipeline to handle requests and responses.',
    link: '/blog/3-ways-to-build-custom-middleware-in-aspnet-core',
    uid: 'blog-2',
  },
  {
    title: 'Boxing and Unboxing in C#',
    description:
      'Boxing is the process of converting a value type to the type object or to any interface type implemented by this value type.',
    link: '/blog/boxing-and-unboxing-in-csharp',
    uid: 'blog-3',
  },
  {
    title: 'SimuKernel: OS Concepts Explained',
    description:'SimuKernel is a kernel simulator that allows you to explore the internals of an operating system.',
    link: '/blog/simukernel-operating-system-concepts',
    uid: 'blog-4',
  },
]

const OUTPUT_DIR = path.join(process.cwd(), 'public', 'og')

async function ensureDirectoryExists(dir: string) {
  try {
    await fs.access(dir)
  } catch {
    await fs.mkdir(dir, { recursive: true })
  }
}

async function generateOGImages() {
  console.log('🎨 Starting OG image generation...')
  
  // Ensure output directory exists
  await ensureDirectoryExists(OUTPUT_DIR)

  for (const post of BLOG_POSTS) {
    try {
      console.log(`📝 Generating OG image for: ${post.title}`)
      
      // Extract slug from link (remove /blog/ prefix)
      const slug = post.link.replace('/blog/', '')
      
      // Generate OG image
      const imageBuffer = await generateOGImageForPost(
        post.title,
        post.description,
        {
          author: 'Mohammed Mostafa',
          readTime: '5 min', // You can customize this or extract from content
        }
      )
      
      // Save image
      const imagePath = path.join(OUTPUT_DIR, `${slug}.png`)
      await fs.writeFile(imagePath, imageBuffer)
      
      console.log(`✅ Generated: ${imagePath}`)
    } catch (error) {
      console.error(`❌ Failed to generate OG image for ${post.title}:`, error)
    }
  }
  
  console.log('🎉 OG image generation completed!')
}

// Execute if run directly
if (require.main === module) {
  generateOGImages().catch((error) => {
    console.error('❌ OG image generation failed:', error)
    process.exit(1)
  })
}

export { generateOGImages }