import Redis from "ioredis";

let redis: Redis | null = null;

try {
  redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) {
        console.log("⚠️  Redis not available, running without cache");
        return null;
      }
      const delay = Math.min(times * 50, 2000);
      return delay;
    },
    lazyConnect: true,
  });

  redis.on("error", (err) => {
    console.warn("⚠️  Redis not available:", err.message);
  });

  redis.on("connect", () => {
    console.log("✅ Connected to Redis");
  });

  // Try to connect
  redis.connect().catch(() => {
    console.log("⚠️  Redis not available, running without cache");
    redis = null;
  });
} catch (error) {
  console.log("⚠️  Redis not available, running without cache");
  redis = null;
}

export default redis;

// Cache utilities
export const CACHE_TTL = {
  SHORT: 60 * 5, // 5 minutes
  MEDIUM: 60 * 15, // 15 minutes
  LONG: 60 * 60, // 1 hour
};

export async function getCached<T>(key: string): Promise<T | null> {
  if (!redis) return null;
  try {
    const cached = await redis.get(key);
    if (cached) {
      return JSON.parse(cached);
    }
    return null;
  } catch (error) {
    console.error("Redis get error:", error);
    return null;
  }
}

export async function setCache(key: string, value: any, ttl: number = CACHE_TTL.MEDIUM) {
  if (!redis) return;
  try {
    await redis.setex(key, ttl, JSON.stringify(value));
  } catch (error) {
    console.error("Redis set error:", error);
  }
}

export async function invalidateCache(pattern: string) {
  if (!redis) return;
  try {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  } catch (error) {
    console.error("Redis invalidate error:", error);
  }
}
