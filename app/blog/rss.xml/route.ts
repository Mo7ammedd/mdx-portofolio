import { getAllBlogPosts } from '@/lib/blog-utils'
import { WEBSITE_URL } from '@/lib/constants'
import fs from 'fs'
import path from 'path'

function mdxToHtml(content: string): string {
  // Remove metadata export
  content = content.replace(/export const metadata = generateBlogPostSEO\({[\s\S]*?}\)/g, '')
  
  content = content.replace(/^import .+$/gm, '')
  
  // Convert headings
  content = content.replace(/^# (.+)$/gm, '<h1>$1</h1>')
  content = content.replace(/^## (.+)$/gm, '<h2>$1</h2>')
  content = content.replace(/^### (.+)$/gm, '<h3>$1</h3>')
  content = content.replace(/^#### (.+)$/gm, '<h4>$1</h4>')
  
  // Convert code blocks with language
  content = content.replace(/```(\w+)\n([\s\S]*?)```/g, 
    '<pre><code class="language-$1">$2</code></pre>')
  
  // Convert inline code
  content = content.replace(/`([^`]+)`/g, '<code>$1</code>')
  
  // Convert bold
  content = content.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
  
  // Convert italic
  content = content.replace(/\*(.+?)\*/g, '<em>$1</em>')
  
  // Convert links
  content = content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  
  // Convert images
  content = content.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, 
    '<img src="' + WEBSITE_URL + '$2" alt="$1" />')
  
  // Convert lists
  content = content.replace(/^\* (.+)$/gm, '<li>$1</li>')
  content = content.replace(/^- (.+)$/gm, '<li>$1</li>')
  content = content.replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>')
  
  // Wrap consecutive list items in ul/ol tags
  content = content.replace(/(<li>.*<\/li>\n?)+/g, (match) => {
    return '<ul>' + match + '</ul>'
  })
  
  // Convert paragraphs (text not in tags)
  content = content.split('\n\n').map(para => {
    para = para.trim()
    if (!para) return ''
    if (para.startsWith('<')) return para
    return '<p>' + para + '</p>'
  }).join('\n')
  
  // Clean up extra whitespace
  content = content.replace(/\n{3,}/g, '\n\n')
  
  return content
}

function getFullPostContent(slug: string): string {
  try {
    const mdxPath = path.join(process.cwd(), 'app', 'blog', slug, 'page.mdx')
    const content = fs.readFileSync(mdxPath, 'utf-8')
    return mdxToHtml(content)
  } catch (error) {
    console.error(`Error reading content for ${slug}:`, error)
    return ''
  }
}

export async function GET() {
  const posts = await getAllBlogPosts()
  
  const rssItems = posts
    .map(
      (post) => {
        const fullContent = getFullPostContent(post.slug)
        const imageUrl = post.image ? `${WEBSITE_URL}${post.image}` : `${WEBSITE_URL}/og/${post.slug}.png`
        
        return `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <content:encoded><![CDATA[
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333;">
          <img src="${imageUrl}" alt="${post.title}" style="max-width: 100%; height: auto; margin-bottom: 2rem; border-radius: 8px;" />
          ${fullContent}
          <hr style="margin: 2rem 0; border: none; border-top: 1px solid #e0e0e0;" />
          <p style="font-size: 0.9rem; color: #666;">
            <strong>Author:</strong> Mohammed Mostafa<br/>
            <strong>Published:</strong> ${new Date(post.publishedTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}<br/>
            <strong>Reading Time:</strong> ${post.readingTime} min read<br/>
            <strong>Tags:</strong> ${post.tags?.join(', ') || 'Programming'}<br/>
            <a href="${WEBSITE_URL}/blog/${post.slug}" style="color: #0066cc; text-decoration: none;">Read on modev.me →</a>
          </p>
        </div>
      ]]></content:encoded>
      <link>${WEBSITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${WEBSITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedTime).toUTCString()}</pubDate>
      ${post.modifiedTime ? `<lastBuildDate>${new Date(post.modifiedTime).toUTCString()}</lastBuildDate>` : ''}
      ${post.tags?.map((tag) => `<category>${tag}</category>`).join('\n      ') || ''}
      <author>mohammedmostafanazih@gmail.com (Mohammed Mostafa)</author>
      <enclosure url="${imageUrl}" type="image/png" length="0"/>
    </item>`
      }
    )
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:atom="http://www.w3.org/2005/Atom"
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>Mohammed Mostafa's Blog</title>
    <description>Software Engineering, Backend Development, ASP.NET Core, Node.js, and Programming Tutorials by Mohammed Mostafa</description>
    <link>${WEBSITE_URL}/blog</link>
    <language>en</language>
    <managingEditor>mohammedmostafanazih@gmail.com (Mohammed Mostafa)</managingEditor>
    <webMaster>mohammedmostafanazih@gmail.com (Mohammed Mostafa)</webMaster>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${WEBSITE_URL}/blog/rss.xml" rel="self" type="application/rss+xml"/>
    <image>
      <url>${WEBSITE_URL}/avatar.jpg</url>
      <title>Mohammed Mostafa's Blog</title>
      <link>${WEBSITE_URL}/blog</link>
      <width>400</width>
      <height>400</height>
    </image>
    <copyright>Copyright ${new Date().getFullYear()} Mohammed Mostafa</copyright>
    <category>Technology</category>
    <category>Software Engineering</category>
    <category>Backend Development</category>
    <ttl>60</ttl>
${rssItems}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  })
}
