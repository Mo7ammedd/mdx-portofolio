import createMDX from '@next/mdx'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeUnwrapImages from 'rehype-unwrap-images'
import githubDark from 'shiki/themes/github-dark.mjs'
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
      rehypePlugins: [[rehypePrettyCode, prettyCodeOptions], rehypeUnwrapImages],
  },
})

export default withMDX(nextConfig)
