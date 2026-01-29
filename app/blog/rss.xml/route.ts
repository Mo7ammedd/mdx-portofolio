import { getAllBlogPosts } from '@/lib/blog-utils'
import { WEBSITE_URL } from '@/lib/constants'

export async function GET() {
  const posts = await getAllBlogPosts()
  
  const rssItems = posts
    .map(
      (post) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.description}]]></description>
      <link>${WEBSITE_URL}/blog/${post.slug}</link>
      <guid isPermaLink="true">${WEBSITE_URL}/blog/${post.slug}</guid>
      <pubDate>${new Date(post.publishedTime).toUTCString()}</pubDate>
      ${post.modifiedTime ? `<lastBuildDate>${new Date(post.modifiedTime).toUTCString()}</lastBuildDate>` : ''}
      ${post.tags?.map((tag) => `<category>${tag}</category>`).join('\n      ') || ''}
      <author>mohammedmostafanazih@gmail.com (Mohammed Mostafa)</author>
    </item>`
    )
    .join('\n')

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Mohammed Mostafa's Blog</title>
    <description>Software Engineering, Backend Development, ASP.NET Core, and Programming Tutorials</description>
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
    </image>
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
