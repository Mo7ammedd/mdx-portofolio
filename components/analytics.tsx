'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { Suspense, useEffect, useRef } from 'react'

import {
  getEngagementEvent,
  type AnalyticsParameters,
} from '@/lib/analytics-events'

declare global {
  interface Window {
    dataLayer?: unknown[]
    gtag?: (...args: unknown[]) => void
    clarity?: (command: string, ...args: unknown[]) => void
  }
}

export function trackEvent(name: string, parameters?: AnalyticsParameters) {
  if (typeof window !== 'undefined') window.gtag?.('event', name, parameters)
}

function AnalyticsTracker({
  googleAnalyticsId,
}: {
  googleAnalyticsId?: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const configuredId = useRef<string | null>(null)
  const previousPage = useRef<string | null>(null)

  useEffect(() => {
    if (!googleAnalyticsId) return

    if (configuredId.current !== googleAnalyticsId) {
      window.dataLayer ??= []
      window.gtag ??= function () {
        // Keep Google's documented dataLayer command format.
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments)
      }
      window.gtag('js', new Date())
      window.gtag('config', googleAnalyticsId, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false,
      })
      configuredId.current = googleAnalyticsId
      previousPage.current = null
    }

    const query = searchParams.toString()
    const pagePath = pathname + (query ? `?${query}` : '')
    if (previousPage.current !== pagePath) {
      trackEvent('page_view', {
        send_to: googleAnalyticsId,
        page_path: pagePath,
        page_location: window.location.href,
      })
      previousPage.current = pagePath
    }
  }, [pathname, searchParams, googleAnalyticsId])

  return null
}

function EngagementTracker() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (event.button !== 0 && event.button !== 1) return
      const anchor =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>('a[href]')
          : null
      if (!anchor) return

      const engagement = getEngagementEvent(
        anchor.href,
        window.location.origin,
        anchor.dataset.projectName,
        anchor.dataset.linkType,
      )
      if (engagement) trackEvent(engagement.name, engagement.parameters)
    }

    document.addEventListener('click', handleClick)
    document.addEventListener('auxclick', handleClick)
    return () => {
      document.removeEventListener('click', handleClick)
      document.removeEventListener('auxclick', handleClick)
    }
  }, [])

  return null
}

export function Analytics({
  googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID,
  microsoftClarityId = process.env.NEXT_PUBLIC_CLARITY_ID,
}: {
  googleAnalyticsId?: string
  microsoftClarityId?: string
}) {
  return (
    <>
      <EngagementTracker />
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Suspense fallback={null}>
            <AnalyticsTracker googleAnalyticsId={googleAnalyticsId} />
          </Suspense>
        </>
      )}
      {microsoftClarityId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", ${JSON.stringify(microsoftClarityId)});
          `}
        </Script>
      )}
    </>
  )
}
