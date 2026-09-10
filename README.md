# Mohammed Mostafa - Portfolio Website

## Open Graph images on Vercel

Social cards use Next.js `ImageResponse` from `next/og`, which includes Vercel's
image renderer. The standard build (`npm run build`) generates and caches the
1200 × 630 PNGs for deployment:

- `/opengraph-image` is the portfolio card, registered automatically by
  `app/opengraph-image.tsx`. Twitter uses the same image.
- `/og/<post-slug>` is an article card. `generateStaticParams` discovers every
  MDX post through `getAllBlogPosts`, so adding or editing an article updates its
  card on the next deployment. Unknown slugs return 404.
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
