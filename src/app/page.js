"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "./components/ModeToggle"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center pt-24">
      

      <section className="text-center max-w-2xl">
        <h2 className="text-4xl font-bold mb-4">Simplify Your Tasks</h2>
        <p className="text-lg text-gray-600 mb-8">
          Organize your tasks efficiently and stay on track with MyTaskApp. Collaborate, track, and manage your work with ease.
        </p>
        <Link href="/signup">
          <Button size="lg">Get Started</Button>
        </Link>
      </section>
    </main>
  )
}
