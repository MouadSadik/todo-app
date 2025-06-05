"use client"

import React, { useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible"

const AddTask = ({ userId }) => {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState(0)
  const [dueDate, setDueDate] = useState("")
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")
  const [successMsg, setSuccessMsg] = useState("")

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setErrorMsg("")
    setSuccessMsg("")

    if (!userId) {
      setErrorMsg("Missing user.")
      setLoading(false)
      return
    }

    try {
      const { error } = await supabase.from("tasks").insert({
        user_id: userId,
        title,
        description,
        priority,
        due_date: dueDate,
      })

      if (error) {
        setErrorMsg("Error: " + error.message)
      } else {
        setSuccessMsg("Task added successfully.")
        setTitle("")
        setDescription("")
        setDueDate("")
      }
    } catch (err) {
      setErrorMsg("Error: " + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Collapsible className="w-full max-w-md mt-4">
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-full bg-neutral-900 text-white">
          Add Task
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Card className="p-4 mt-2 shadow-md">
          <CardContent>
            <h2 className="text-xl font-semibold mb-4 text-center">Add Task</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label className="mb-2" htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>
              <div>
                <Label className="mb-2" htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Task description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
              <div>
                <Label className="mb-2" htmlFor="priority">Priority</Label>
                <Input
                  id="priority"
                  type="number"
                  placeholder="Priority (0-10)"
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                />
              </div>
              <div>
                <Label className="mb-2" htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>

              {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}
              {successMsg && <p className="text-green-500 text-sm">{successMsg}</p>}

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Loading..." : "Add Task"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  )
}

export default AddTask

