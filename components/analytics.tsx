'use client'

import Script from 'next/script'
import { usePathname, useSearchParams } from 'next/navigation'
import { useEffect, Suspense } from 'react'

interface AnalyticsProps {
  googleAnalyticsId?: string
  microsoftClarityId?: string
}

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag: (
      command: string,
      targetId: string,
      config?: Record<string, any>
    ) => void
    clarity: (command: string, ...args: any[]) => void
  }
}

function AnalyticsTracker({ googleAnalyticsId }: { googleAnalyticsId?: string }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  // Track page views
  useEffect(() => {
    if (googleAnalyticsId && typeof window.gtag !== 'undefined') {
      window.gtag('config', googleAnalyticsId, {
        page_path: pathname + searchParams.toString(),
      })
    }
  }, [pathname, searchParams, googleAnalyticsId])

  return null
}

export function Analytics({ 
  googleAnalyticsId = process.env.NEXT_PUBLIC_GA_ID,
  microsoftClarityId = process.env.NEXT_PUBLIC_CLARITY_ID 
}: AnalyticsProps) {
  return (
    <>
      {/* Google Analytics */}
      {googleAnalyticsId && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`}
            strategy="afterInteractive"
          />
          <Script id="google-analytics" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${googleAnalyticsId}', {
                page_path: window.location.pathname,
                anonymize_ip: true,
                allow_google_signals: false,
                allow_ad_personalization_signals: false
              });
            `}
          </Script>
          <Suspense fallback={null}>
            <AnalyticsTracker googleAnalyticsId={googleAnalyticsId} />
          </Suspense>
        </>
      )}

      {/* Microsoft Clarity */}
      {microsoftClarityId && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "${microsoftClarityId}");
          `}
        </Script>
      )}
    </>
  )
}

// Custom event tracking utility
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

// Track contact form submissions
export const trackContactSubmission = () => {
  trackEvent('contact_form_submit', {
    event_category: 'engagement',
    event_label: 'Contact Form',
  })
}

// Track project link clicks
export const trackProjectClick = (projectName: string, linkType: 'demo' | 'source') => {
  trackEvent('project_click', {
    event_category: 'engagement',
    event_label: projectName,
    link_type: linkType,
  })
}

// Track blog post engagement
export const trackBlogEngagement = (postTitle: string, action: 'view' | 'scroll_50' | 'scroll_100') => {
  trackEvent('blog_engagement', {
    event_category: 'content',
    event_label: postTitle,
    action,
  })
}
