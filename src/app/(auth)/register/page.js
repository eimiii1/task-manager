'use client'
import { useState } from "react"
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"

const RegisterForm = () => {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [isRegistered, setIsRegistered] = useState(false)

    const router = useRouter()

    const handleSubmit = async e => {
        e.preventDefault()
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message)
            }
            
            const data = await response.json()
            setMessage(data.message)
            setIsRegistered(true)
            router.push('/login')
            setError(null)
        } catch (err) {
            setMessage(null)
            setError(err.message)
        }
    }


    return (
        <div className="flex justify-center md:items-center w-screen h-screen p-6">
            <Card className="ring-0 w-100 shadow-none">
                <CardHeader>
                    <CardTitle className='text-3xl font-bold'>Join Us Today</CardTitle>
                    <CardDescription>Sign up to organize your tasks, track progress, and stay productive every day.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <form
                        className="flex flex-col gap-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="flex flex-col gap-2">
                            <Label>Username <span className="opacity-50">(optional)</span></Label>
                            <Input
                                placeholder='e.g eimii1'
                                type='text'
                                value={username}
                                onChange={e => setUsername(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Email Address</Label>
                            <Input
                                type='email'
                                placeholder="e.g mark@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Password <span className="opacity-50">(minimum of 8 characters)</span></Label>
                            <Input
                                type='password'
                                placeholder='e.g ••••••••'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        {isRegistered ? (
                            <Button className='gap-2'disabled variant='outline'>
                                <Loader2 className="size-4 animate-spin"/>
                                Signing in
                            </Button>
                        ) : (
                            <Button>Sign Up</Button>
                        )}
                    </form>
                    <Separator className='md:hidden' />
                    <span className="flex justify-center">
                        <span
                            className="md:absolute md:top-0 md:right-0 md:p-6 text-sm"
                        >Already a member? <Link href='/login' className="text-black font-bold">Login</Link> </span>
                    </span>

                </CardContent>
            </Card>
        </div>
    )
}

export default RegisterForm