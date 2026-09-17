# Mohammed Mostafa - Portfolio Website

## Development

```sh
npm ci
npm run dev
npm run lint
npm test
npm run build
```

Use npm and the committed `package-lock.json` for reproducible installs.
Lint uses the Next.js 16 flat ESLint configuration. Tests cover MDX navigation,
scheduler and replica-recovery correctness, related-article ranking, and
engagement-event classification.

## Anonymous Q&A

`/ask` accepts anonymous questions and shows searchable, topic-filtered answers.
Review questions and publish replies at the password-protected `/ask/inbox`.
Host-based routing also supports `ask.modev.me` in the same Vercel project.
Next.js server routes use Supabase in production and an ignored local file in
development. Run `node scripts/setup-ask.mjs` to generate a local inbox password.
See [Q&A setup](docs/ask-setup.md) for the database migration, environment
variables, privacy behavior, and domain setup.

## Experience

Edit `WORK_EXPERIENCE` in `app/data.tsx` for company summaries, roles, dates,
and optional `highlights`. Highlights appear in native "Selected work"
disclosures, keeping the homepage compact. CarLink and the learning platforms
share the Medica Scope entry. Descriptions summarize the organization
repositories at the product level.

## Projects and writing

The homepage features compact rows for SimuKernel, LSMSharp, and AeroUDP, each
with a small architecture thumbnail. `/projects` shows all five projects,
including Disk-Mesh and HungerStation Microservices, with case studies, source
links, technical previews, and evidence highlights. SimuKernel and Disk-Mesh
cards link directly to their browser demos on the case-study pages.

Edit `app/data.tsx` for project summaries, evidence highlights, visual kinds,
and homepage selection (`featured`). `components/project-visual.tsx` contains
the accessible SVG architecture sketches; these are static illustrations.
Edit `lib/project-case-studies.ts` for the LSMSharp, AeroUDP, and SimuKernel
narratives, and `lib/additional-project-case-studies.ts` for Disk-Mesh and
HungerStation. All entries share the main registry, which also generates case
study routes, sitemap entries, and Open Graph cards. Highlights link to each
case study's `#evidence` section and its pinned repository references.
Demo and evidence links use native fragment navigation so the browser resolves
the scroll destination after the case study loads.

Project-to-article relationships live in `lib/project-links.ts`; related articles
are ranked by shared tags, then publication date, without recommending the
current article or unrelated topics.

Articles live in `app/blog/<slug>/page.mdx`. During compilation,
`lib/rehype-blog-post.mjs` assigns stable, unique IDs to Markdown headings and
builds the table of contents from the same headings. It wraps each article with
the server component in `components/blog-post-layout.tsx`, registered through
`mdx-components.tsx`. Metadata exports stay in the MDX file. The article header,
table of contents, related links, navigation, and structured data render on the
server; interactive reading controls remain client components. No per-article
layout or hand-maintained list of headings is needed.
Pages render their static content directly, without a global loading fallback,
so articles and native heading navigation remain visible when JavaScript is
disabled.

The first Markdown H1 becomes the article header, with the metadata description
as its introduction. The contents list groups subsections and stays beside the
article on wide screens; a small client component highlights the current section.
See [the blog authoring guide](docs/blog-authoring.md) for code filenames, line
highlights, callouts, steps, tabs, and image captions.

Full-content search is served from the statically built `/blog/search-index.json`
and fetched only when a reader searches. Its section anchors share the article
compiler's heading logic. Guided paths live at `/blog/paths`; browser-local
progress offers an explicit resume link. Scoped PostgreSQL and .NET example
checks support freshness labels; see [the verification record](docs/verification/2026-09-16.md).

The scheduling playground is at `/projects/simukernel#scheduler`. It supports
FCFS, non-preemptive SJF, and Round Robin, editable workloads, idle intervals,
playback, and per-process results. `lib/scheduler.ts` contains the pure scheduling
engine. The model uses a single CPU, known integer bursts, no I/O, and zero
context-switch cost. New arrivals at a quantum boundary enter the ready queue
before the running process is requeued.

The replica recovery demo is at `/projects/disk-mesh#replication`. Visitors can
take any of four storage nodes offline, bring them back, and play or step through
heartbeat detection and direct chunk copies. `lib/replication.ts` models three
equal-size chunks with a target of three live replicas, a two-step timeout, and
one repair at a time. Partial copies do not count; playback stops when recovery
finishes or needs another node. Returning nodes retain their stored chunks and
can leave extra replicas. This companion model illustrates event order without
running the Java cluster or measuring network and disk performance. Tests cover
node failures during transfers, missing sources, too few live nodes, playback,
reset, and deterministic state transitions.

Case-study measurements are attributed to their sources. The LSMSharp figure is
a published write-submission sample, not a new benchmark or a synchronous durable
commit result. AeroUDP's proxy percentages describe an example test workload.
Case-study references link to the reviewed GitHub revisions. SimuKernel's C#
console simulator and the companion browser playground are described separately
because they offer different scheduling policies.

## Analytics and Vercel

The existing `NEXT_PUBLIC_GA_ID` enables Google Analytics. Navigation emits one
manual `page_view` per pathname/query change; automatic configuration page views
are disabled. The existing optional `NEXT_PUBLIC_CLARITY_ID` still enables Clarity.
For this manual page-view strategy, open the GA4 web stream's **Enhanced
measurement → Page views** settings and disable **Page changes based on browser
history events**. Otherwise GA4 can send an additional event for the same
navigation.

| Event            | Meaning                               | Parameters                                                                 |
| ---------------- | ------------------------------------- | -------------------------------------------------------------------------- |
| `resume_open`    | A visitor opens the résumé link       | `file_name`                                                                |
| `contact_click`  | A visitor clicks an email link        | `contact_method`                                                           |
| `project_click`  | A visitor opens a project destination | `project_name`, `link_type` (`source`, `case_study`, `article`, or `demo`) |
| `scheduler_play` | A visitor starts or resumes the demo  | `algorithm`, `process_count`, `quantum`                                    |

Click tracking uses one delegated listener, so server-rendered links retain their
normal navigation and middle-click behavior. New project links should include
`data-project-name` and `data-link-type`. Résumé and email links are recognized
automatically. These events measure clicks, not completed file downloads or sent
emails; no email address or message body is included in event parameters.

`@vercel/speed-insights/next` is installed in the root layout. Enable **Speed
Insights** for this project in the Vercel dashboard, then deploy to collect real
visitor performance data. The SDK does not collect metrics in development.
See [Vercel's setup guide](https://vercel.com/docs/speed-insights/quickstart).

## Open Graph images on Vercel

Social cards use Next.js `ImageResponse` from `next/og`, which includes Vercel's
image renderer. The standard build (`npm run build`) generates and caches the
1200 × 630 PNGs for deployment:

- `/opengraph-image` is the portfolio card, registered automatically by
  `app/opengraph-image.tsx`. Twitter uses the same image.
- `/og/<post-slug>` is an article card. `generateStaticParams` discovers every
  MDX post through `getAllBlogPosts`, so adding or editing an article updates its
  card on the next deployment. Unknown slugs return 404.
- `/og/projects/<project-slug>` is the matching card for a project case study.
- Article Open Graph metadata, Twitter cards, and RSS all use the generated URL.

Edit `lib/og-generator.tsx` to change the shared design and
`app/opengraph-image.tsx` to change the portfolio text. Fonts and the avatar are
loaded locally, without requests to a font service or the deployed site. The
Geist fonts in `public/fonts/og` come from
[vercel/geist-font](https://github.com/vercel/geist-font) and include their OFL
license.

Use `npm run dev` to preview the image URLs locally. Vercel's deployment
[Open Graph preview](https://vercel.com/docs/deployments/og-preview) can inspect
the cards after deployment. No separate generation command, API key, or Vercel
configuration is required.

References: [Vercel OG image generation](https://vercel.com/docs/og-image-generation)
and [Next.js image metadata](https://nextjs.org/docs/app/api-reference/file-conventions/metadata/opengraph-image).
