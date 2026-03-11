import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { COOKIE_NAME } from "@/lib/identity"
import { GameNav } from "@/components/rxarena/game-nav"

export default async function GameLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const guestId = cookieStore.get(COOKIE_NAME)?.value

  if (!guestId) {
    redirect("/")
  }

  return (
    <div className="min-h-screen bg-background flex">
      <GameNav />
      <main className="flex-1 pb-20 md:pb-0 md:pl-20">
        {children}
      </main>
    </div>
  )
}
