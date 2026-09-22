import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import sharp from 'sharp'

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
  readFile(join(process.cwd(), 'public/fonts/og/NotoSansArabic-Regular.ttf')),
  readFile(join(process.cwd(), 'public/fonts/og/NotoSansArabic-SemiBold.ttf')),
  readFile(join(process.cwd(), 'public/avatar.jpg'), 'base64'),
])

let nativeFontsReady: Promise<void> | undefined

function prepareNativeFonts() {
  return (nativeFontsReady ??= (async () => {
    // Explicit reads keep fonts in Next.js server-function file traces.
    await readFile(join(process.cwd(), 'public/fonts/og/NotoEmoji.ttf'))
    const fonts = [
      ['Geist-Regular.ttf', 'Geist 16', 'A'],
      ['Geist-SemiBold.ttf', 'Geist Semi-Bold 16', 'A'],
      ['NotoSansArabic-Regular.ttf', 'Noto Sans Arabic 16', 'ا'],
      ['NotoSansArabic-SemiBold.ttf', 'Noto Sans Arabic Semi-Bold 16', 'ا'],
      ['NotoEmoji.ttf', 'Noto Emoji 16', '🙂'],
    ]
    // Register the complete fallback stack once before concurrent layouts.
    for (const [file, font, text] of fonts) {
      await sharp({
        text: {
          text,
          font,
          fontfile: join(process.cwd(), 'public/fonts/og', file),
          rgba: true,
        },
      })
        .png()
        .toBuffer()
    }
  })())
}

function startsRightToLeft(text: string) {
  return /^\P{Letter}*\p{Script=Arabic}/u.test(text)
}

async function renderArabicText(
  text: string,
  fontSize: number,
  width: number,
  maxHeight: number,
  weight: 400 | 600,
  color: string,
) {
  // Satori lays out Arabic words independently. Pango preserves whole-line
  // bidi ordering and contextual shaping, including mixed Arabic/English.
  const escaped = text.replace(
    /[&<>]/g,
    (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' })[character]!,
  )
  await prepareNativeFonts()
  let size = fontSize
  for (;;) {
    const { data, info } = await sharp({
      text: {
        text: `<span foreground="${color}">${escaped}</span>`,
        font: `Noto Sans Arabic,Geist,Noto Emoji ${weight === 600 ? 'Semi-Bold ' : ''}${size}`,
        width,
        // Pango mirrors its start alignment automatically for RTL paragraphs.
        align: 'left',
        wrap: 'word-char',
        rgba: true,
        dpi: 72,
      },
    })
      .png()
      .toBuffer({ resolveWithObject: true })
    if (info.height <= maxHeight || size <= 12) {
      return {
        src: `data:image/png;base64,${data.toString('base64')}`,
        width: info.width,
        height: info.height,
      }
    }
    size = Math.max(12, Math.floor((size * maxHeight) / info.height))
  }
}

export async function generateOGImage({
  title,
  description,
  label,
  footer,
  detail,
}: OGImageContent) {
  const [regular, semibold, mono, arabicRegular, arabicSemibold, avatar] =
    await assets
  const arabicTitle = /\p{Script=Arabic}/u.test(title)
  const arabicDescription = /\p{Script=Arabic}/u.test(description)
  const titleSize = title.length > 70 ? 54 : title.length > 40 ? 64 : 80
  const [titleImage, descriptionImage] = await Promise.all([
    arabicTitle
      ? renderArabicText(title, titleSize, 1072, 216, 600, '#f3f4f6')
      : null,
    arabicDescription
      ? renderArabicText(description, 26, 960, 128, 400, '#a3a3a3')
      : null,
  ])

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '100%',
          padding: '52px 64px',
          background: '#1c1c1c',
          color: '#f3f4f6',
          fontFamily: 'Geist, Noto Sans Arabic',
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
          <span style={{ fontSize: 15, color: '#a3a3a3', letterSpacing: 2 }}>
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
          {titleImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              {...titleImage}
              alt=""
              style={{
                alignSelf: startsRightToLeft(title) ? 'flex-end' : 'flex-start',
              }}
            />
          ) : (
            <div
              style={{
                // Satori applies lineClamp only to block text elements.
                display: 'block',
                width: '100%',
                fontSize: titleSize,
                fontWeight: 600,
                letterSpacing: -2.5,
                lineHeight: 1.1,
                lineClamp: 3,
                wordBreak: 'break-word',
              }}
            >
              {title}
            </div>
          )}
          {descriptionImage ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              {...descriptionImage}
              alt=""
              style={{
                alignSelf: startsRightToLeft(description)
                  ? 'flex-end'
                  : 'flex-start',
                marginTop: 24,
              }}
            />
          ) : (
            <div
              style={{
                display: 'block',
                width: '100%',
                marginTop: 24,
                maxWidth: 960,
                fontSize: 26,
                lineHeight: 1.45,
                color: '#a3a3a3',
                lineClamp: 3,
                wordBreak: 'break-word',
              }}
            >
              {description}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid #404040',
            paddingTop: 24,
            fontFamily: 'Geist Mono',
            fontSize: 17,
          }}
        >
          <span>{footer}</span>
          <span style={{ color: '#a3a3a3' }}>{detail}</span>
        </div>
      </div>
    ),
    {
      ...OG_IMAGE_SIZE,
      fonts: [
        { name: 'Geist', data: regular, weight: 400, style: 'normal' },
        { name: 'Geist', data: semibold, weight: 600, style: 'normal' },
        { name: 'Geist Mono', data: mono, weight: 400, style: 'normal' },
        {
          name: 'Noto Sans Arabic',
          data: arabicRegular,
          weight: 400,
          style: 'normal',
        },
        {
          name: 'Noto Sans Arabic',
          data: arabicSemibold,
          weight: 600,
          style: 'normal',
        },
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
