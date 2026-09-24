import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { blogGlossary } from '@/lib/blog-glossary.mjs'
import { generateSEO } from '@/lib/seo'

export const metadata = generateSEO({
  title: 'Engineering glossary',
  description:
    'Short explanations of the database, networking, C# and operating system concepts used in the articles.',
  path: '/blog/glossary',
})

export default function GlossaryPage() {
  const terms = Object.entries(blogGlossary).sort(([, a], [, b]) =>
    a.term.localeCompare(b.term),
  )
  return (
    <main>
      <Link href="/blog" className="text-link mb-5">
        <ArrowLeft aria-hidden="true" className="size-3.5" />
        All writing
      </Link>
      <h1 className="text-3xl font-medium tracking-tight text-zinc-100">
        Engineering glossary
      </h1>
      <p className="mt-4 text-sm leading-7 text-zinc-400">
        Short definitions with concrete examples. In an article, tap a term with
        a dotted underline to read its definition in place.
      </p>
      <nav
        aria-label="Glossary terms"
        className="mt-6 flex flex-wrap gap-x-4 gap-y-1"
      >
        {terms.map(([id, term]) => (
          <a
            key={id}
            href={`#${id}`}
            className="text-link underline decoration-zinc-700 underline-offset-4"
          >
            {term.term}
          </a>
        ))}
      </nav>
      <dl className="mt-8 divide-y divide-white/10">
        {terms.map(([id, term]) => (
          <div key={id} id={id} className="scroll-mt-8 py-6">
            <dt className="text-lg font-medium text-zinc-100">{term.term}</dt>
            <dd>
              <p className="mt-3 text-sm leading-7 text-zinc-300">
                {term.definition}
              </p>
              <p className="mt-3 border-l border-sky-300/30 pl-4 text-sm leading-7 text-zinc-400">
                {term.example}
              </p>
              <Link href={term.href} className="text-link mt-3">
                Read the explanation{' '}
                <ArrowUpRight aria-hidden="true" className="size-3" />
              </Link>
            </dd>
          </div>
        ))}
      </dl>
    </main>
  )
}
