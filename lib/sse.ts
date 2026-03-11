import { redis, roomChannel } from "@/lib/redis"
import Redis from "ioredis"
import type { SSEEvent } from "@/lib/types"

export async function publish(roomId: string, event: SSEEvent): Promise<void> {
  await redis.publish(roomChannel(roomId), JSON.stringify(event))
}

/**
 * Creates a ReadableStream that subscribes to a Redis pub/sub channel
 * and streams SSE-formatted events to the client.
 */
export function createSSEStream(roomId: string): ReadableStream {
  const channel = roomChannel(roomId)

  return new ReadableStream({
    start(controller) {
      const url = process.env.REDIS_URL ?? "redis://localhost:6379"
      const sub = new Redis(url, {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
        lazyConnect: true,
      })

      let closed = false

      const send = (data: string) => {
        if (closed) return
        try {
          controller.enqueue(new TextEncoder().encode(`data: ${data}\n\n`))
        } catch {
          // controller already closed
        }
      }

      sub.subscribe(channel, (err) => {
        if (err) {
          controller.error(err)
          sub.disconnect()
        }
      })

      sub.on("message", (_chan: string, message: string) => {
        send(message)
      })

      // Heartbeat every 15s to keep connection alive through proxies
      const heartbeat = setInterval(() => {
        send(JSON.stringify({ type: "heartbeat", payload: { ts: Date.now() } }))
      }, 15_000)

      // Cleanup on stream cancel (client disconnect)
      return () => {
        closed = true
        clearInterval(heartbeat)
        sub.unsubscribe(channel).then(() => sub.disconnect())
      }
    },
  })
}
