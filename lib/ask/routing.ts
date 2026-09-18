import { WEBSITE_URL } from '../constants'
import { ASK_URL } from './types'

export function isAskHost(hostname: string) {
  return hostname === 'ask.modev.me' || hostname === 'ask.localhost'
}

export function isAskPath(href: string) {
  return (
    href === '/ask' ||
    href.startsWith('/ask/') ||
    href.startsWith('/ask?') ||
    href.startsWith('/ask#')
  )
}

export function getQuestionHref(id: string) {
  const encodedId = encodeURIComponent(id)
  return `/ask?question=${encodedId}#question-${encodedId}`
}

export function siteHref(href: string, hostname: string, localOrigin?: string) {
  const askPath = isAskPath(href)
  if (askPath) {
    const suffix = href.slice(4)
    const path = suffix.startsWith('/') ? suffix : `/${suffix}`
    if (isAskHost(hostname)) return path
    if (hostname === 'modev.me' || hostname === 'www.modev.me') {
      return `${ASK_URL}${path}`
    }
  }
  if (isAskHost(hostname) && href.startsWith('/') && !askPath) {
    const origin =
      hostname === 'ask.localhost' && localOrigin
        ? localOrigin.replace('ask.localhost', 'localhost')
        : WEBSITE_URL
    return `${origin}${href}`
  }
  return href
}
