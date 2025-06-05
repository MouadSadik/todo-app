"use client"

import React, { useEffect, useState } from "react"
import { supabase } from "../lib/supabaseClient"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

const TasksList = ({ userId }) => {
    const [tasks, setTasks] = useState([])
    const [loading, setLoading] = useState(false)
    const [updating, setUpdating] = useState({})
    const [editingTaskId, setEditingTaskId] = useState(null)
    const [editTitle, setEditTitle] = useState("")
    const [editDescription, setEditDescription] = useState("")
    const [editPriority, setEditPriority] = useState(0)
    const [editDueDate, setEditDueDate] = useState("")

    // Fetch tasks
    useEffect(() => {
        if (!userId) return

        const fetchTasks = async () => {
            setLoading(true)
            const { data, error } = await supabase
                .from("tasks")
                .select("*")
                .eq("user_id", userId)
                .order("due_date", { ascending: true })

            if (error) {
                console.error("Fetching Error", error)
                setTasks([])
            } else {
                setTasks(data)
            }
            setLoading(false)
        }

        fetchTasks()
    }, [userId])

    // Toggle completed
    const handleCheckboxChange = async (taskId, isCompleted) => {
        setUpdating((prev) => ({ ...prev, [taskId]: true }))
        const { error } = await supabase
            .from("tasks")
            .update({ is_completed: isCompleted })
            .eq("id", taskId)

        if (error) {
            console.error("Update Error", error)
        } else {
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId ? { ...task, is_completed: isCompleted } : task
                )
            )
        }
        setUpdating((prev) => ({ ...prev, [taskId]: false }))
    }

    // Start editing
    const handleEdit = (task) => {
        setEditingTaskId(task.id)
        setEditTitle(task.title)
        setEditDescription(task.description)
        setEditPriority(task.priority)
        setEditDueDate(task.due_date.split("T")[0]) // YYYY-MM-DD
    }

    // Update task
    const handleUpdate = async (taskId) => {
        setUpdating((prev) => ({ ...prev, [taskId]: true }))
        const { error } = await supabase
            .from("tasks")
            .update({
                title: editTitle,
                description: editDescription,
                priority: editPriority,
                due_date: editDueDate,
            })
            .eq("id", taskId)

        if (error) {
            console.error("Update Error", error)
        } else {
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId
                        ? {
                            ...task,
                            title: editTitle,
                            description: editDescription,
                            priority: editPriority,
                            due_date: editDueDate,
                        }
                        : task
                )
            )
            setEditingTaskId(null)
        }
        setUpdating((prev) => ({ ...prev, [taskId]: false }))
    }

    // Delete task
    const handleDelete = async (taskId) => {
        const { error } = await supabase.from("tasks").delete().eq("id", taskId)
        if (error) {
            console.error("Delete Error", error)
        } else {
            setTasks((prev) => prev.filter((task) => task.id !== taskId))
        }
    }

    if (loading) {
        return (
            <div className="space-y-4 mt-4">
                {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-24 w-full rounded-xl" />
                ))}
            </div>
        )
    }

    if (tasks.length === 0) {
        return (
            <div className="mt-8 text-center text-muted-foreground">
                <h1 className="text-xl font-semibold">No tasks found</h1>
                <p className="mt-2 text-sm">Add your first task to get started!</p>
            </div>
        )
    }

    return (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-4">
            {tasks.map((task) => (
                <Card
                    key={task.id}
                    className="shadow-sm relative pt-6 pl-6 transition-transform hover:scale-[1.02]"
                >
                    {/* Checkbox en haut à gauche */}
                    <Input
                        type="checkbox"
                        checked={task.is_completed}
                        disabled={updating[task.id]}
                        onChange={(e) =>
                            handleCheckboxChange(task.id, e.target.checked)
                        }
                        className="absolute top-3 left-3 size-4 cursor-pointer accent-primary border border-gray-300 rounded transition-colors"
                    />

                    <CardContent className="p-4 space-y-2">
                        {editingTaskId === task.id ? (
                            <>
                                <Input
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="Title"
                                />
                                <Textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    placeholder="Description"
                                />
                                <div className="flex gap-2">
                                    <Input
                                        type="number"
                                        value={editPriority}
                                        onChange={(e) =>
                                            setEditPriority(Number(e.target.value))
                                        }
                                        placeholder="Priority"
                                        className="w-24"
                                    />
                                    <Input
                                        type="date"
                                        value={editDueDate}
                                        onChange={(e) => setEditDueDate(e.target.value)}
                                        className="w-40"
                                    />
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        size="sm"
                                        onClick={() => handleUpdate(task.id)}
                                        disabled={updating[task.id]}
                                    >
                                        Save
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => setEditingTaskId(null)}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex justify-between items-start">
                                    <h2 className="text-lg font-semibold">{task.title}</h2>
                                    <div className="flex gap-1">
                                        <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleEdit(task)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="destructive"
                                            onClick={() => handleDelete(task.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {task.description}
                                </p>
                                <div className="text-xs text-gray-500 flex flex-col gap-1">
                                    <span>
                                        Due:{" "}
                                        {new Date(task.due_date).toLocaleDateString()}
                                    </span>
                                    <span>Priority: {task.priority}</span>
                                </div>
                                <Badge
                                    variant={task.is_completed ? "secondary" : "default"}
                                    className="text-xs"
                                >
                                    {task.is_completed ? "Completed" : "Pending"}
                                </Badge>
                            </>
                        )}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}

export default TasksList
