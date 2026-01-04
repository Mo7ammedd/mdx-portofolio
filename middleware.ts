import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  // Enable DNS prefetch for faster domain resolution
  response.headers.set('X-DNS-Prefetch-Control', 'on')
  
  // Security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  // Add resource hints via Link header for critical resources
  // This helps browsers discover and fetch critical resources earlier
  const linkHeaders = [
    '<https://i.scdn.co>; rel=preconnect; crossorigin',
    '<https://avatars.githubusercontent.com>; rel=preconnect; crossorigin',
    '<https://api.github.com>; rel=preconnect',
  ].join(', ')
  
  response.headers.set('Link', linkHeaders)
  
  const cspHeader = `
    default-src 'self';
    script-src 'self' 'unsafe-eval' 'unsafe-inline' https://vercel.live https://va.vercel-scripts.com;
    style-src 'self' 'unsafe-inline';
    img-src 'self' blob: data: https://i.scdn.co https://avatars.githubusercontent.com;
    font-src 'self' data:;
    connect-src 'self' https://api.github.com https://api.spotify.com https://accounts.spotify.com https://vercel.live https://vitals.vercel-insights.com;
    media-src 'self' https://p.scdn.co;
    frame-src 'self';
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    upgrade-insecure-requests;
  `.replace(/\s{2,}/g, ' ').trim()
  
  response.headers.set('Content-Security-Policy', cspHeader)

  return response
}

export const config = {
  matcher: [
    {
      source: '/((?!api|_next/static|_next/image|favicon.ico).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
