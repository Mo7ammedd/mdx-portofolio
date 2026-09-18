import type { Metadata } from 'next'
import { getQuestionOGImagePath, OG_IMAGE_SIZE } from '../og-metadata'
import { generateSEO } from '../seo'
import { ASK_URL, type PublicQuestion } from './types'

export function previewText(text: string, maxLength: number) {
  const normalized = text.replace(/\s+/g, ' ').trim()
  const characters = Array.from(normalized)
  return characters.length > maxLength
    ? `${characters
        .slice(0, maxLength - 1)
        .join('')
        .trimEnd()}…`
    : normalized
}

export function generateAskMetadata(question?: PublicQuestion): Metadata {
  const title = question
    ? previewText(question.question, 160)
    : 'Ask me anything'
  const description = question
    ? previewText(question.answer, 240)
    : 'Whatever is on your mind, ask Mohammed Mostafa. Leave an anonymous question and read his answers. No account needed.'
  const url = question
    ? `${ASK_URL}/?question=${encodeURIComponent(question.id)}`
    : ASK_URL
  const image = question
    ? `${ASK_URL}${getQuestionOGImagePath(question.id)}?v=${encodeURIComponent(question.answeredAt)}`
    : `${ASK_URL}/ask/opengraph-image`
  const seo = generateSEO({ title, description, path: '/ask' })

  return {
    ...seo,
    metadataBase: new URL(ASK_URL),
    alternates: { canonical: url },
    openGraph: {
      ...seo.openGraph,
      url,
      siteName: 'Ask Mohammed',
      images: [{ url: image, ...OG_IMAGE_SIZE, alt: title, type: 'image/png' }],
    },
    twitter: { ...seo.twitter, images: [image] },
  }
}
