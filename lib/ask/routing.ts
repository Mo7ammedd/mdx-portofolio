import { WEBSITE_URL } from '../constants'
import { ASK_URL } from './types'

export function isAskHost(hostname: string) {
  return hostname === 'ask.modev.me' || hostname === 'ask.localhost'
}

export function siteHref(href: string, hostname: string, localOrigin?: string) {
  const askPath =
    href === '/ask' || href.startsWith('/ask/') || href.startsWith('/ask#')
  if (askPath) {
    const path = href.slice(4) || '/'
    if (isAskHost(hostname)) return path.startsWith('#') ? `/${path}` : path
    if (hostname === 'modev.me' || hostname === 'www.modev.me') {
      return `${ASK_URL}${path.startsWith('#') ? '/' : ''}${path}`
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
