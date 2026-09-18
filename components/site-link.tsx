'use client'

import Link from 'next/link'
import { useSyncExternalStore, type ComponentProps } from 'react'
import { isAskHost, isAskPath, siteHref } from '@/lib/ask/routing'

export { isAskHost } from '@/lib/ask/routing'

const subscribe = () => () => {}
const serverHost = () => ''
const clientHost = () => window.location.hostname

export function useSiteHost() {
  return useSyncExternalStore(subscribe, clientHost, serverHost)
}

export function SiteLink({
  href,
  reloadDocument = false,
  ...props
}: Omit<ComponentProps<'a'>, 'href'> & {
  href: string
  reloadDocument?: boolean
}) {
  const hostname = useSiteHost()
  const resolved = siteHref(
    href,
    hostname,
    typeof window !== 'undefined' ? window.location.origin : undefined,
  )
  // Crossing into/out of Q&A uses a full navigation so session-replay scripts
  // loaded on the portfolio are never carried into the anonymous form or inbox.
  if (reloadDocument || isAskPath(href) || isAskHost(hostname)) {
    return <a href={resolved} {...props} />
  }
  return <Link href={resolved} {...props} />
}
