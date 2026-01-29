import fs from 'fs'
import path from 'path'

export interface BlogPost {
  slug: string
  title: string
  description: string
  publishedTime: string
  modifiedTime?: string
  tags?: string[]
  readingTime: number
  image?: string
}

/**
 * Auto-discovers all blog posts from the filesystem
 * Reads metadata from each page.mdx file
 */
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  const blogDir = path.join(process.cwd(), 'app', 'blog')
  
  try {
    const entries = fs.readdirSync(blogDir, { withFileTypes: true })
    
    const posts: BlogPost[] = []
    
    for (const entry of entries) {
      if (!entry.isDirectory()) continue
      
      const slug = entry.name
      const mdxPath = path.join(blogDir, slug, 'page.mdx')
      
      if (!fs.existsSync(mdxPath)) continue
      
      try {
        const content = fs.readFileSync(mdxPath, 'utf-8')
        const metadata = extractMetadataFromMDX(content, slug)
        
        if (metadata) {
          posts.push(metadata)
        }
      } catch (error) {
        console.error(`Error reading ${slug}:`, error)
      }
    }
    
    // Sort by published date (newest first)
    return posts.sort((a, b) => 
      new Date(b.publishedTime).getTime() - new Date(a.publishedTime).getTime()
    )
  } catch (error) {
    console.error('Error reading blog directory:', error)
    return []
  }
}

/**
 * Extracts metadata from MDX file content
 */
function extractMetadataFromMDX(content: string, slug: string): BlogPost | null {
  try {
    // Extract metadata export
    const metadataMatch = content.match(/export const metadata = generateBlogPostSEO\({([^}]+)}\)/s)
    if (!metadataMatch) return null
    
    const metadataContent = metadataMatch[1]
    
    // Extract values
    const title = metadataContent.match(/title:\s*['"]([^'"]+)['"]/)?.[1] || ''
    const description = metadataContent.match(/description:\s*['"]([^'"]+)['"]/)?.[1] || ''
    const publishedTime = metadataContent.match(/publishedTime:\s*['"]([^'"]+)['"]/)?.[1] || new Date().toISOString()
    const modifiedTime = metadataContent.match(/modifiedTime:\s*['"]([^'"]+)['"]/)?.[1]
    
    // Extract tags array
    let tags: string[] = []
    const tagsMatch = metadataContent.match(/tags:\s*\[([^\]]+)\]/s)
    if (tagsMatch) {
      tags = tagsMatch[1]
        .split(',')
        .map(tag => tag.trim().replace(/['"]/g, ''))
        .filter(Boolean)
    }
    
    // Calculate reading time
    const readingTime = calculateReadingTime(content)
    
    return {
      slug,
      title,
      description,
      publishedTime,
      modifiedTime,
      tags,
      readingTime,
      image: `/og/${slug}.png`,
    }
  } catch (error) {
    console.error(`Error parsing metadata for ${slug}:`, error)
    return null
  }
}

/**
 * Calculates reading time based on word count
 */
function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
