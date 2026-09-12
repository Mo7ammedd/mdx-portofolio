export type AnalyticsParameters = Record<string, string | number | boolean>

export type EngagementEvent = {
  name: 'resume_open' | 'contact_click' | 'project_click'
  parameters: AnalyticsParameters
}

export function getEngagementEvent(
  href: string,
  origin: string,
  projectName?: string,
  linkType?: string,
): EngagementEvent | null {
  let url: URL
  try {
    url = new URL(href, origin)
  } catch {
    return null
  }

  if (url.protocol === 'mailto:') {
    return { name: 'contact_click', parameters: { contact_method: 'email' } }
  }
  if (url.origin === origin && url.pathname === '/resume.pdf') {
    return { name: 'resume_open', parameters: { file_name: 'resume.pdf' } }
  }
  if (
    projectName &&
    ['source', 'case_study', 'demo', 'article'].includes(linkType ?? '')
  ) {
    return {
      name: 'project_click',
      parameters: { project_name: projectName, link_type: linkType! },
    }
  }
  return null
}
