interface CacheEntry<T> {
  data: T
  timestamp: number
  ttl: number
}

/**
 * Serverless-compatible in-memory cache
 * 
 * Important: This cache is per-instance and won't persist across serverless invocations.
 * For persistent caching across requests, use:
 * - Next.js built-in caching (fetch with cache options)
 * - Redis/Upstash Redis for distributed caching
 * - Vercel KV for edge-compatible key-value storage
 * 
 * This is useful for:
 * - Caching within a single request
 * - Avoiding duplicate API calls in the same execution context
 * - Rate limiting within an instance
 */
class SimpleCache {
  private cache = new Map<string, CacheEntry<any>>()
  private cleanupScheduled = false

  set<T>(key: string, data: T, ttlSeconds: number = 300): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttlSeconds * 1000
    })

    // Schedule cleanup on next tick (serverless-safe)
    this.scheduleCleanup()
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return null
    }

    const now = Date.now()
    const isExpired = now - entry.timestamp > entry.ttl

    if (isExpired) {
      this.cache.delete(key)
      return null
    }

    return entry.data as T
  }

  has(key: string): boolean {
    const entry = this.cache.get(key)
    
    if (!entry) {
      return false
    }

    const now = Date.now()
    const isExpired = now - entry.timestamp > entry.ttl

    if (isExpired) {
      this.cache.delete(key)
      return false
    }

    return true
  }

  clear(): void {
    this.cache.clear()
  }

  // Clean up expired entries (called lazily)
  cleanup(): void {
    const now = Date.now()
    
    for (const [key, entry] of this.cache.entries()) {
      const isExpired = now - entry.timestamp > entry.ttl
      if (isExpired) {
        this.cache.delete(key)
      }
    }
  }

  // Schedule cleanup using queueMicrotask (serverless-safe alternative to setInterval)
  private scheduleCleanup(): void {
    if (this.cleanupScheduled) return
    
    this.cleanupScheduled = true
    
    // Use queueMicrotask for serverless environments
    queueMicrotask(() => {
      this.cleanup()
      this.cleanupScheduled = false
    })
  }

  // Get cache statistics (useful for monitoring)
  getStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    }
  }
}

export const cache = new SimpleCache()

/**
 * Helper function for caching async operations
 * 
 * Usage:
 * const data = await cachedFetch('my-key', () => fetchExpensiveData(), 300)
 */
export async function cachedFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds: number = 300
): Promise<T> {
  const cached = cache.get<T>(key)
  if (cached !== null) {
    return cached
  }

  const data = await fetchFn()
  cache.set(key, data, ttlSeconds)
  return data
}