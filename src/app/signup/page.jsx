"use client"

import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const SignupPage = () => {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [fullName, setFullName] = useState("")
    const [loading, setLoading] = useState(false)
    const [errorMsg, setErrorMsg] = useState("")
    const router = useRouter()

    async function handleSignup(e) {
        e.preventDefault()
        setLoading(true)
        setErrorMsg("")

        try {
            const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        fullName,
                    },
                },
            })

            if (signUpError) {
                setErrorMsg(signUpError.message)
                return
            }

            const user = signUpData.user
            if (!user) {
                setErrorMsg("User not found.")
                return
            }

            const { error: profileError } = await supabase.from("profiles").insert({
                id: user.id,
                full_name: fullName,
            })

            if (profileError) {
                console.error("Profile insert error:", profileError)
                setErrorMsg("Error creating profile.")
                return
            }

            alert("Signup successful.")
            router.push("/tasks")
        } catch (error) {
            console.log(error)
            setErrorMsg("Unknown error.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen ">
            <Card className="w-full max-w-md p-6 shadow-lg">
                <CardContent>
                    <h2 className="text-xl font-semibold mb-4 text-center">Sign Up</h2>
                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <Label className="mb-2" htmlFor="fullName">Full Name</Label>
                            <Input
                                id="fullName"
                                type="text"
                                placeholder="Enter your full name"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required
                            />
                        </div>
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
                                placeholder="••••••••"
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
                            {loading ? "Loading..." : "Sign Up"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}

export default SignupPage
