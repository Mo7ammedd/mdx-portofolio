import createMDX from '@next/mdx'
import bundleAnalyzer from '@next/bundle-analyzer'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  pageExtensions: ['js', 'jsx', 'ts', 'tsx', 'md', 'mdx'],
  
  // Image optimization configuration
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',
        port: '',
        pathname: '/image/**',
      },
    ],
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  
  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'motion',
      '@radix-ui/react-slot',
      'next-themes',
      'react-markdown',
      'react-chat-agent',
    ],
    optimizeCss: true,
  },
  
  // Turbopack configuration for Next.js 16
  turbopack: {
    // Empty config to silence the warning
    // Turbopack handles optimizations automatically
  },
  
  // Server external packages (moved from experimental in Next.js 15)
  serverExternalPackages: ['canvas'],
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  
  // Headers for better caching and security
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
  webpack: (config, { dev, isServer }) => {
    // Optimize bundle size
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          default: false,
          vendors: false,
          // Separate motion/framer-motion into its own chunk
          motion: {
            name: 'motion',
            test: /[\\/]node_modules[\\/](motion|framer-motion)[\\/]/,
            priority: 30,
            reuseExistingChunk: true,
          },
          // Lucide icons
          icons: {
            name: 'icons',
            test: /[\\/]node_modules[\\/]lucide-react[\\/]/,
            priority: 25,
            reuseExistingChunk: true,
          },
          // Next.js specific
          nextVendor: {
            name: 'next-vendor',
            test: /[\\/]node_modules[\\/](next|next-themes)[\\/]/,
            priority: 20,
            reuseExistingChunk: true,
          },
          // React
          react: {
            name: 'react',
            test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/,
            priority: 15,
            reuseExistingChunk: true,
          },
          // Other vendors
          vendor: {
            name: 'vendor',
            chunks: 'all',
            test: /node_modules/,
            priority: 10,
            reuseExistingChunk: true,
          },
          common: {
            name: 'common',
            minChunks: 2,
            priority: 5,
            reuseExistingChunk: true,
          },
        },
      }
      
      // Minimize JS
      config.optimization.minimize = true
      
      // Tree shaking
      config.optimization.usedExports = true
      config.optimization.sideEffects = false
      
      // Concatenate modules for better performance
      config.optimization.concatenateModules = true
    }
    return config
  },
}

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      // GitHub Flavored Markdown (tables, strikethrough, task lists, etc.)
      remarkGfm,
    ],
    rehypePlugins: [
      // Generate IDs for headings (e.g., ## Introduction → id="introduction")
      rehypeSlug,
      // Add anchor links to headings
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          properties: {
            className: ['heading-anchor'],
          },
        },
      ],
    ],
  },
})

export default withBundleAnalyzer(withMDX(nextConfig))
