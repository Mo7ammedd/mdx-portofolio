import { BLOG_POSTS } from '@/app/data'
import { getReadingTimeForPost } from '@/lib/reading-time'

const SITE_URL = 'https://www.mohammedd.tech' 
const SITE_TITLE = 'Mohammed Mostafa - Software Engineer Blog'
const SITE_DESCRIPTION = 'Technical blog about backend development, system design, databases, and software engineering'
const SITE_LANGUAGE = 'en-us'
const AUTHOR_NAME = 'Mohammed Mostafa'
const AUTHOR_EMAIL = 'MohammedMostafaNazih@gmail.com'

function escapeXml(unsafe: string): string {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

async function generateRSSFeed(): Promise<string> {
  const postsWithReadingTime = await Promise.all(
    BLOG_POSTS.map(async (post) => {
      const slug = post.link.replace('/blog/', '')
      const readingTime = await getReadingTimeForPost(slug)
      return { ...post, readingTime: readingTime.text }
    })
  )

  const rssItems = postsWithReadingTime
    .map((post) => {
      const postUrl = `${SITE_URL}${post.link}`
      const pubDate = new Date().toUTCString() // You can add actual publish dates to your data

      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${pubDate}</pubDate>
      <author>${AUTHOR_EMAIL} (${AUTHOR_NAME})</author>
      <category>Software Engineering</category>
      <content:encoded><![CDATA[
        <p>${escapeXml(post.description)}</p>
        <p><strong>Reading time:</strong> ${post.readingTime}</p>
        <p><a href="${postUrl}">Read full article</a></p>
      ]]></content:encoded>
    </item>`
    })
    .join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" 
     xmlns:content="http://purl.org/rss/1.0/modules/content/"
     xmlns:dc="http://purl.org/dc/elements/1.1/"
     xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>${SITE_LANGUAGE}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <generator>Next.js</generator>
    <managingEditor>${AUTHOR_EMAIL} (${AUTHOR_NAME})</managingEditor>
    <webMaster>${AUTHOR_EMAIL} (${AUTHOR_NAME})</webMaster>
    <copyright>Copyright ${new Date().getFullYear()}, ${AUTHOR_NAME}</copyright>
    <category>Technology</category>
    <category>Software Engineering</category>
    <ttl>60</ttl>
    ${rssItems}
  </channel>
</rss>`
}

export async function GET() {
  try {
    const feed = await generateRSSFeed()

    return new Response(feed, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error generating RSS feed:', error)
    return new Response('Error generating RSS feed', { status: 500 })
  }
}

