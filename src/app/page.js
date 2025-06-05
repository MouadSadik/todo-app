"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-8 bg-gray-50">
      <header className="flex justify-between w-full max-w-4xl mb-12">
        <h1 className="text-3xl font-bold">MyTaskApp</h1>
        <div className="space-x-2">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Signup</Button>
          </Link>
        </div>
      </header>

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
