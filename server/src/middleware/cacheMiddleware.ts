import { Request, Response, NextFunction } from "express";

interface CacheEntry {
  body: any;
  contentType: string;
  expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry>();

/**
 * Clean up expired cache items periodically (every 5 minutes)
 */
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of memoryCache.entries()) {
    if (entry.expiresAt <= now) {
      memoryCache.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Cache middleware for Express GET routes
 * @param durationSeconds Time in seconds to hold in cache (default: 300s / 5m)
 */
export const cacheResponse = (durationSeconds: number = 300) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Only cache GET requests
    if (req.method !== "GET") {
      return next();
    }

    // Do not cache authenticated admin requests
    if (req.originalUrl.startsWith("/api/admin")) {
      return next();
    }

    const cacheKey = req.originalUrl || req.url;
    const cached = memoryCache.get(cacheKey);

    if (cached && cached.expiresAt > Date.now()) {
      res.setHeader("X-Cache", "HIT");
      res.setHeader("Content-Type", cached.contentType || "application/json");
      return res.send(cached.body);
    }

    res.setHeader("X-Cache", "MISS");

    // Intercept response send
    const originalSend = res.send.bind(res);
    res.send = (body: any) => {
      // Only cache successful 200 responses
      if (res.statusCode >= 200 && res.statusCode < 300) {
        memoryCache.set(cacheKey, {
          body,
          contentType: res.getHeader("Content-Type") as string || "application/json",
          expiresAt: Date.now() + durationSeconds * 1000,
        });
      }
      return originalSend(body);
    };

    next();
  };
};

/**
 * Instantly purge cache entries matching a prefix or substring pattern
 * @param pattern String prefix or regex to invalidate
 */
export const invalidateCache = (pattern?: string) => {
  if (!pattern) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.includes(pattern)) {
      memoryCache.delete(key);
    }
  }
};
