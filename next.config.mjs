import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import githubDark from 'shiki/themes/github-dark.mjs'
import rehypeBlogPost from './lib/rehype-blog-post.mjs'
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  turbopack: {},
  // Local development questions must never be bundled into a deployment.
  outputFileTracingExcludes: {
    '/*': ['./.data/**/*'],
  },
  async rewrites() {
    const askHost = [{ type: 'host', value: 'ask\\.(modev\\.me|localhost)' }]
    return {
      beforeFiles: [
        { source: '/', has: askHost, destination: '/ask' },
        { source: '/inbox', has: askHost, destination: '/ask/inbox' },
      ],
    }
  },
  async redirects() {
    const askHost = [{ type: 'host', value: 'ask\\.(modev\\.me|localhost)' }]
    return [
      { source: '/ask', has: askHost, destination: '/', permanent: true },
      {
        source: '/ask/inbox',
        has: askHost,
        destination: '/inbox',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/ask/inbox',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
        ],
      },
      {
        source: '/inbox',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' },
          { key: 'Referrer-Policy', value: 'no-referrer' },
        ],
      },
    ]
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'motion'],
  },
}

/** @type {import('rehype-pretty-code').Options} */
const prettyCodeOptions = {
  theme: {
    ...githubDark,
    tokenColors: [
      ...githubDark.tokenColors,
      // Keep comments readable against the site's dark code background.
      {
        scope: ['comment', 'punctuation.definition.comment', 'string.comment'],
        settings: { foreground: '#8b949e' },
      },
    ],
  },
  keepBackground: true,
  defaultLang: 'plaintext',
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    rehypePlugins: [
      [rehypePrettyCode, prettyCodeOptions],
      rehypeUnwrapImages,
      rehypeBlogPost,
    ],
  },
})

export default withMDX(nextConfig)
