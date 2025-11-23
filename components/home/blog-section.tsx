'use client'

import dynamic from 'next/dynamic'
import Link from 'next/link'

const AnimatedBackground = dynamic(() => import('@/components/ui/animated-background').then(mod => ({ default: mod.AnimatedBackground })), {
  ssr: false,
})

interface BlogPost {
  uid: string
  title: string
  description: string
  link: string
  readingTime?: string
}

interface BlogSectionProps {
  posts: BlogPost[]
}

export function BlogSection({ posts }: BlogSectionProps) {
  return (
    <div className="flex flex-col space-y-0">
      <AnimatedBackground
        enableHover
        className="h-full w-full rounded-lg bg-zinc-100 dark:bg-zinc-900/80"
        transition={{
          type: 'spring',
          bounce: 0,
          duration: 0.2,
        }}
      >
        {posts.map((post) => (
          <Link
            key={post.uid}
            className="-mx-3 rounded-xl px-3 py-3"
            href={post.link}
            data-id={post.uid}
            prefetch
          >
            <div className="flex flex-col space-y-1">
              <div className="flex items-start justify-between gap-2">
                <h4 className="flex-1 font-normal dark:text-zinc-100">
                  {post.title}
                </h4>
                {post.readingTime && (
                  <span className="text-xs text-zinc-400 dark:text-zinc-500 whitespace-nowrap">
                    {post.readingTime}
                  </span>
                )}
              </div>
              <p className="text-zinc-500 dark:text-zinc-400">
                {post.description}
              </p>
            </div>
          </Link>
        ))}
      </AnimatedBackground>
    </div>
  )
}
