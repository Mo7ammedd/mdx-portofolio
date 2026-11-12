import { generateOGImage } from '@/lib/og-generator'
import { OG_IMAGE_SIZE } from '@/lib/og-metadata'

export const alt = 'Mohammed Mostafa — Backend and Platform Software Engineer'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'
export const runtime = 'nodejs'
export const dynamic = 'force-static'

export default function Image() {
  return generateOGImage({
    title: 'Mohammed Mostafa',
    description:
      'Backend and platform software engineer in Cairo. Deployment platforms, agent runtimes, and application backends.',
    label: 'BACKEND & PLATFORM · EGYPT',
    footer: 'C# · TypeScript · Go',
    detail: 'Portfolio & writing',
  })
}
