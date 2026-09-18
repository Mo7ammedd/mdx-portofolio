import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

import type { BlogPost } from './blog-utils'
import { WEBSITE_URL } from './constants'
import { OG_IMAGE_SIZE } from './og-metadata'

type OGImageContent = {
  title: string
  description: string
  label: string
  footer: string
  detail: string
}

// Satori needs TTF/OTF/WOFF fonts; the site's WOFF2 fonts are not supported.
const assets = Promise.all([
  readFile(join(process.cwd(), 'public/fonts/og/Geist-Regular.ttf')),
  readFile(join(process.cwd(), 'public/fonts/og/Geist-SemiBold.ttf')),
  readFile(join(process.cwd(), 'public/fonts/og/GeistMono-Regular.ttf')),
  readFile(join(process.cwd(), 'public/avatar.jpg'), 'base64'),
])

export async function generateOGImage({
  title,
  description,
  label,
  footer,
  detail,
}: OGImageContent) {
  const [regular, semibold, mono, avatar] = await assets

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '52px 64px',
          background: '#000000',
          color: '#ededed',
          fontFamily: 'Geist',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontFamily: 'Geist Mono',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* ImageResponse renders images directly, without next/image. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`data:image/jpeg;base64,${avatar}`}
              alt=""
              width={48}
              height={48}
              style={{ borderRadius: 24, objectFit: 'cover' }}
            />
            <span style={{ fontSize: 22 }}>
              {new URL(WEBSITE_URL).hostname.replace(/^www\./, '')}
            </span>
          </div>
          <span style={{ fontSize: 15, color: '#a1a1aa', letterSpacing: 2 }}>
            {label}
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '28px 0',
          }}
        >
          <div
            style={{
              // Satori applies lineClamp only to block text elements.
              display: 'block',
              fontSize: title.length > 70 ? 54 : title.length > 40 ? 64 : 80,
              fontWeight: 600,
              letterSpacing: -2.5,
              lineHeight: 1.1,
              lineClamp: 3,
              wordBreak: 'break-word',
            }}
          >
            {title}
          </div>
          <div
            style={{
              display: 'block',
              marginTop: 24,
              maxWidth: 960,
              fontSize: 26,
              lineHeight: 1.45,
              color: '#a1a1aa',
              lineClamp: 3,
              wordBreak: 'break-word',
            }}
          >
            {description}
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #27272a',
            paddingTop: 24,
            fontFamily: 'Geist Mono',
            fontSize: 17,
          }}
        >
          <span>{footer}</span>
          <span style={{ color: '#a1a1aa' }}>{detail}</span>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        { name: 'Geist', data: regular, weight: 400, style: 'normal' },
        { name: 'Geist', data: semibold, weight: 600, style: 'normal' },
        { name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
      ],
    },
  )
}

export function generateBlogOGImage(post: BlogPost) {
  const date = new Date(post.publishedTime).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })

  return generateOGImage({
    title: post.title,
    description: post.description,
    label: 'WRITING',
    footer: 'Mohammed Mostafa',
    detail: `${date} · ${post.readingTime} min read`,
  })
}
