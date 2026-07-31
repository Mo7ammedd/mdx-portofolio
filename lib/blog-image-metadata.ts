type BlogImageDimensions = {
  width: number
  height: number
}

const BLOG_IMAGE_DIMENSIONS: Record<string, BlogImageDimensions> = {
  '/blog/BoxingUnboxing/boxing-performance-allocation.png': { width: 800, height: 916 },
  '/blog/BoxingUnboxing/csharp-boxing-unboxing-overview.png': { width: 800, height: 401 },
  '/blog/BoxingUnboxing/stack-vs-heap-dotnet.webp': { width: 1024, height: 768 },
  '/blog/cluster-index/btree-structure.jpg': { width: 1093, height: 569 },
  '/blog/cluster-index/clustered-index-structure.jpg': { width: 2126, height: 1181 },
  '/blog/cluster-index/clustered-vs-nonclustered-overview.png': { width: 718, height: 428 },
  '/blog/cluster-index/nonclustered-index-structure.jpg': { width: 1949, height: 1418 },
  '/blog/middlewares/aspnetcore-middleware-pipeline-sequence.png': { width: 474, height: 272 },
  '/blog/nginx/nginx-architecture-overview.webp': { width: 2626, height: 1330 },
  '/blog/nginx/nginx-cache-1.jpg': { width: 720, height: 405 },
  '/blog/nginx/nginx-cache-2.png': { width: 1114, height: 650 },
  '/blog/nginx/nginx-load-balancing.png': { width: 683, height: 342 },
  '/blog/nginx/nginx-location-matching-2.webp': { width: 2522, height: 1324 },
  '/blog/nginx/nginx-request-lifecycle-1.png': { width: 625, height: 254 },
  '/blog/nginx/nginx-reverse-proxy-diagram.jpg': { width: 618, height: 328 },
  '/blog/nginx/nginx-reverse-proxy.png': { width: 1184, height: 802 },
  '/blog/nginx/nginx-ssl-termination.png': { width: 540, height: 274 },
  '/blog/pagination-strategies/btree-traversal-comparison.webp': { width: 1376, height: 768 },
  '/blog/pagination-strategies/cursor-api-flow.webp': { width: 1376, height: 768 },
  '/blog/pagination-strategies/cursor-pagination-mechanics.webp': { width: 1376, height: 768 },
  '/blog/pagination-strategies/offset-pagination-mechanics.webp': { width: 1376, height: 768 },
  '/blog/pagination-strategies/offset-phantom-records.webp': { width: 1376, height: 768 },
  '/blog/pagination-strategies/offset-vs-cursor-performance.webp': { width: 1376, height: 768 },
}

export function getBlogImageDimensions(src: string): BlogImageDimensions | undefined {
  return BLOG_IMAGE_DIMENSIONS[src]
}
