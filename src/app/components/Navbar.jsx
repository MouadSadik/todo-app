import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ModeToggle } from './ModeToggle'

const Navbar = () => {
  return (
    <div className='flex flex-col items-center justify-cente mt-5 '>
        <header className="flex justify-between w-full max-w-4xl mb-12">
        <a href="/"><h1 className="text-3xl font-bold">MyTaskApp</h1></a>
        <div className="space-x-2">
          <Link href="/login">
            <Button variant="outline">Login</Button>
          </Link>
          <Link href="/signup">
            <Button>Signup</Button>
          </Link>
          <ModeToggle className="mt-5" />
        </div>
      </header>
    </div>
  )
}

export default Navbar