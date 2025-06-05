"use client"

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import React from 'react'
import { supabase } from '../lib/supabaseClient'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"


const LoginPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const router = useRouter()

    async function handleLogin(e) {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")

        try {
            const { data: LoginData, error: LoginError } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (LoginError) {
                setErrorMsg(LoginError.message)
                return
            }

            if (!LoginData.user) {
                setErrorMsg("User not found.")
                return
            }

            alert("Login successful.")
            router.push("/tasks")
        }

        catch (error) {
            console.log(error)
            setErrorMsg("Unkown Error")
        }
        finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Card className="w-full max-w-md p-6 shadow-lg">
                <CardContent>
                    <h2 className="text-xl font-semibold mb-4 text-center">Log In</h2>
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <Label className="mb-2" htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="example@mail.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <Label className="mb-2" htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="•••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {errorMsg && <p className="text-red-500 text-sm">{errorMsg}</p>}

                        <Button
                            type="submit"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? "Loading..." : "Log In"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginPage