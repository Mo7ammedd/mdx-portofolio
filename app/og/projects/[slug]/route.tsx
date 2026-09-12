import { notFound } from 'next/navigation'

import { generateOGImage } from '@/lib/og-generator'
import {
  getProjectCaseStudy,
  PROJECT_CASE_STUDIES,
} from '@/lib/project-case-studies'

export const runtime = 'nodejs'
export const dynamic = 'force-static'
export const dynamicParams = false

export function generateStaticParams() {
  return PROJECT_CASE_STUDIES.map(({ slug }) => ({ slug }))
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params
  const project = getProjectCaseStudy(slug)
  if (!project) notFound()

  return generateOGImage({
    title: project.title,
    description: project.description,
    label: 'PROJECT CASE STUDY',
    footer: 'Mohammed Mostafa',
    detail: project.technologies.slice(0, 2).join(' · '),
  })
}
