import { promises as fs } from 'fs'
import path from 'path'


export function calculateReadingTime(text: string, wordsPerMinute: number = 200): number {
  const cleanText = text
    .replace(/import\s+.*?from\s+['"].*?['"]/g, '') 
    .replace(/export\s+.*?{[\s\S]*?}/g, '') 
    .replace(/```[\s\S]*?```/g, '') 
    .replace(/<[^>]*>/g, '') 
    .replace(/[#*`_~\[\]()]/g, '') 
    .replace(/!\[.*?\]\(.*?\)/g, '') 
    .replace(/\[.*?\]\(.*?\)/g, '') 
    .trim()

  const wordCount = cleanText.split(/\s+/).filter((word) => word.length > 0).length

  const readingTime = Math.ceil(wordCount / wordsPerMinute)

  return Math.max(1, readingTime)
}


export async function getReadingTimeForPost(slug: string): Promise<{
  minutes: number
  text: string
}> {
  try {
    const filePath = path.join(process.cwd(), 'app', 'blog', slug, 'page.mdx')
    const content = await fs.readFile(filePath, 'utf-8')
    
    const minutes = calculateReadingTime(content)
    
    return {
      minutes,
      text: `${minutes} min read`,
    }
  } catch (error) {
    console.warn(`Could not read file for slug: ${slug}`, error)
    return {
      minutes: 5,
      text: '5 min read',
    }
  }
}


export function getWordCount(text: string): number {
  const cleanText = text
    .replace(/import\s+.*?from\s+['"].*?['"]/g, '')
    .replace(/export\s+.*?{[\s\S]*?}/g, '')
    .replace(/```[\s\S]*?```/g, '')
    .replace(/<[^>]*>/g, '')
    .replace(/[#*`_~\[\]()]/g, '')
    .replace(/!\[.*?\]\(.*?\)/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .trim()

  return cleanText.split(/\s+/).filter((word) => word.length > 0).length
}

