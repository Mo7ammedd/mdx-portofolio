import { generateOGImage } from '@/lib/og-generator'
import { OG_IMAGE_SIZE } from '@/lib/og-metadata'

export const alt = 'Mohammed Mostafa — Software Engineer'
export const size = OG_IMAGE_SIZE
export const contentType = 'image/png'
export const runtime = 'nodejs'
export const dynamic = 'force-static'

export default function Image() {
  return generateOGImage({
    title: 'Mohammed Mostafa',
    description:
      'I’m a software engineer in Egypt. I build backend systems at Oblien and Medica Scope.',
    label: 'SOFTWARE ENGINEER · EGYPT',
    footer: 'ASP.NET Core · Node.js · TypeScript',
    detail: 'Portfolio & writing',
  })
}
