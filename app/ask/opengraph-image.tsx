import { generateOGImage } from '@/lib/og-generator'
import { OG_IMAGE_SIZE } from '@/lib/og-metadata'

export const alt = 'Ask Mohammed — Good questions. Honest answers.'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'
export const runtime = 'nodejs'
export const dynamic = 'force-static'

export default function Image() {
  return generateOGImage({
    title: 'Good questions. Honest answers.',
    description:
      'Backend engineering, building things, finding your way. Ask me anything, anonymously.',
    label: 'QUESTIONS & ANSWERS',
    footer: 'Mohammed Mostafa',
    detail: 'ask.modev.me',
  })
}
