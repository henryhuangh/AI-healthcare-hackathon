import Redis from "ioredis"

const globalForRedis = globalThis as unknown as {
  redis: Redis | undefined
  redisSub: Redis | undefined
}

function createClient() {
  const url = process.env.REDIS_URL ?? "redis://localhost:6379"
  const client = new Redis(url, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true,
  })
  client.on("error", (err) => {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[redis] connection error:", err.message)
    }
  })
  return client
}

// Main client for regular commands
export const redis = globalForRedis.redis ?? createClient()
if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis

// Dedicated subscriber client (cannot run regular commands while subscribed)
export const redisSub = globalForRedis.redisSub ?? createClient()
if (process.env.NODE_ENV !== "production") globalForRedis.redisSub = redisSub

export function roomChannel(roomId: string) {
  return `room:events:${roomId}`
}
