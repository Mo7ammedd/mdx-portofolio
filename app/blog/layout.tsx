import { ReadingProgress } from '@/components/ui/reading-progress'
import type { ReactNode } from 'react'

export default function LayoutBlogPost({
  children,
}: {
  children: ReactNode
}) {
  return (
    <>
      <div className="pointer-events-none fixed top-0 left-0 z-10 h-12 w-full bg-gray-100 to-transparent backdrop-blur-xl [-webkit-mask-image:linear-gradient(to_bottom,black,transparent)] dark:bg-zinc-950" />
      <ReadingProgress
        wordsPerMinute={200}
        showTimeEstimate={true}
      />

      <main className="prose prose-gray prose-h4:prose-base dark:prose-invert prose-h1:text-xl prose-h1:font-medium prose-h2:mt-12 prose-h2:scroll-m-20 prose-h2:text-lg prose-h2:font-medium prose-h3:text-base prose-h3:font-medium prose-h4:font-medium prose-h5:text-base prose-h5:font-medium prose-h6:text-base prose-h6:font-medium prose-strong:font-medium mt-24 pb-20 [&_h1_a]:!no-underline [&_h2_a]:!no-underline [&_h3_a]:!no-underline [&_h4_a]:!no-underline [&_h5_a]:!no-underline [&_h6_a]:!no-underline [&_h1_a]:![text-decoration:none] [&_h2_a]:![text-decoration:none] [&_h3_a]:![text-decoration:none]">{children}</main>
    </>
  )
}
