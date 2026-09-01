import { getAllBlogPosts } from '@/lib/blog-utils'
import { WEBSITE_URL } from '@/lib/constants'
import fs from 'fs'
import path from 'path'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { renderToStaticMarkup } from 'react-dom/server'

function sanitizeMdxForRss(content: string): string {
  return (
    content
      // Remove metadata export block.
      .replace(/export const metadata = generateBlogPostSEO\({[\s\S]*?}\)/g, '')
      // Remove import/export statements.
      .replace(/^import .+$/gm, '')
      .replace(/^export .+$/gm, '')
      // Remove JSX-style self-closing components that RSS readers can't render.
      .replace(/^\s*<[A-Z][\w.-]*(?:\s+[^>]*)?\/>\s*$/gm, '')
      // Remove JSX-style component blocks.
      .replace(/<([A-Z][\w.-]*)(?:\s[^>]*)?>[\s\S]*?<\/\1>/g, '')
      .trim()
  )
}

function mdxToHtml(content: string): string {
  const safeContent = sanitizeMdxForRss(content)

  return renderToStaticMarkup(
    React.createElement(
      ReactMarkdown,
      {
        components: {
          img: ({ src, alt }) =>
            React.createElement('img', {
              src: src
                ? src.startsWith('http')
                  ? src
                  : `${WEBSITE_URL}${src}`
                : undefined,
              alt: alt ?? '',
            }),
        },
      },
      safeContent
    )
  )
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
    .map((post) => {
      const fullContent = getFullPostContent(post.slug)
      const imageUrl = post.image
        ? `${WEBSITE_URL}${post.image}`
        : `${WEBSITE_URL}/og/${post.slug}.png`

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
    })
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
