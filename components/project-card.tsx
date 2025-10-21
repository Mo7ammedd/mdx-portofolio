import Link from 'next/link'
import { Star, GitFork } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

interface Props {
  title: string
  description: string
  tags: readonly string[]
  link?: string
  image?: string
  links?: readonly {
    icon: React.ReactNode
    type: string
    href: string
  }[]
  githubStats?: {
    stars: number
    forks: number
  } | null
}

export function ProjectCard({ title, description, tags, links, githubStats }: Props) {
  return (
    <Card
      className={
        'flex h-full flex-col gap-3 overflow-hidden border p-2 transition-all duration-300 ease-out hover:shadow-lg'
      }
    >
      <CardHeader className="px-2">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <CardTitle className="mt-1 text-base">{title}</CardTitle>
            {githubStats && (
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Star className="h-3 w-3" />
                  <span>{githubStats.stars}</span>
                </div>
                <div className="flex items-center gap-1">
                  <GitFork className="h-3 w-3" />
                  <span>{githubStats.forks}</span>
                </div>
              </div>
            )}
          </div>
          <p className="prose text-muted-foreground dark:prose-invert max-w-full font-sans text-xs text-pretty">
            {description}
          </p>
        </div>
      </CardHeader>
      <CardContent className="mt-auto flex flex-col px-2">
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {tags?.map((tag) => (
              <Badge
                className="px-1 py-0 text-[9px]"
                variant="secondary"
                key={tag}
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="px-2 pb-2">
        {links && links.length > 0 && (
          <div className="flex flex-row flex-wrap items-start gap-1">
            {links?.map((link, idx) => (
              <Link href={link?.href} key={idx} target="_blank">
                <Badge key={idx} className="flex gap-2 px-2 py-1 text-[10px]">
                  {link.icon}
                  {link.type}
                </Badge>
              </Link>
            ))}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
