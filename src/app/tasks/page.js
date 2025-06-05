"use client"

import { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import AddTask from "../components/AddTask"
import Stats from "../components/Stats"
import TasksList from "../components/TasksList"
import SignOut from "../components/SignOut"

export default function Home() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser()
      if (error) {
        console.error("Error getting user:", error.message)
        return
      }
      setUser(data.user)
    }

    fetchUser()
  }, [])

  if (!user) return <p>Loading...</p>

  const fullName = user.user_metadata?.full_name || "User"

  return (
    <div className="p-8">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Welcome {fullName}</h1>
        <SignOut />
      </div>
      <Stats userId={user.id} />
      <AddTask userId={user.id} />
      <TasksList userId={user.id} />
    </div>
  )
}
