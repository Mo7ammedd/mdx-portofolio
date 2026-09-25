import { generateOGImage } from '@/lib/og-generator'
import { OG_IMAGE_SIZE } from '@/lib/og-metadata'

export const alt = 'Ask Mohammed: questions and answers'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'
export const runtime = 'nodejs'
export const dynamic = 'force-static'

export default function Image() {
  return generateOGImage({
    title: 'Ask me anything.',
    description:
      'Ask a question anonymously. You don’t need to leave your name.',
    label: 'QUESTIONS & ANSWERS',
    footer: 'Mohammed Mostafa',
    detail: 'ask.modev.me',
  })
}
