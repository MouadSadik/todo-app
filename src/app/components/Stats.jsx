"use client"

import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Card, CardContent } from "@/components/ui/card"

const Stats = ({ userId }) => {
    const [totalTasks, setTotalTasks] = useState(0)
    const [completedTasks, setCompletedTasks] = useState(0)
    const [pendingTasks, setPendingTasks] = useState(0)
    const [overdueTasks, setOverdueTasks] = useState(0)

    useEffect(() => {
        if (!userId) return

        const fetchStats = async () => {
            try {
                // fetch total tasks
                const { count: total, error: totalError } = await supabase.from("tasks")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", userId)

                // fetch completed tasks
                const { count: completed, error: completedError } = await supabase.from("tasks")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", userId)
                    .eq("is_completed", true)

                // fetch pending tasks
                const { count: pending, error: pendingError } = await supabase.from("tasks")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", userId)
                    .eq("is_completed", false)

                // fetch overdue tasks
                const now = new Date().toISOString()
                const { count: overdue, error: overdueError } = await supabase.from("tasks")
                    .select("*", { count: "exact", head: true })
                    .eq("user_id", userId)
                    .eq("is_completed", false)
                    .lt("due_date", now)

                // errors
                if (totalError || completedError || pendingError || overdueError) {
                    console.error("Error fetching stats:", totalError || completedError || pendingError || overdueError)
                    return
                }

                setTotalTasks(total || 0)
                setCompletedTasks(completed || 0)
                setPendingTasks(pending || 0)
                setOverdueTasks(overdue || 0)
            } catch (error) {
                console.error("Unexpected error:", error)
            }
        }

        fetchStats()
    }, [userId])

    const completionPercentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100)

    return (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-20 mb-20">
            <Card>
                <CardContent className="p-4">
                    <p className='text-lg font-semibold'>Total Tasks</p>
                    <p className='text-2xl'>{totalTasks}</p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <p className='text-lg font-semibold'>Completed</p>
                    <p className='text-2xl'>{completedTasks}</p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <p className='text-lg font-semibold'>Pending</p>
                    <p className='text-2xl'>{pendingTasks}</p>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-4">
                    <p className='text-lg font-semibold'>Overdue</p>
                    <p className='text-2xl'>{overdueTasks}</p>
                </CardContent>
            </Card>

            <Card className="">
                <CardContent className="p-4">
                    <p className="text-lg font-semibold">Completion</p>
                    <p className="text-2xl">{completionPercentage}%</p>
                </CardContent>
            </Card>
        </div>
    )
}

export default Stats
