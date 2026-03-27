'use client'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'

const LoginForm = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)
    const [isLoggingIn, setIsLoggingIn] = useState(false)

    const router = useRouter()

    const handleSubmit = async e => {
        e.preventDefault()

        try {
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            })

            if (!response.ok) {
                const error = await response.json()
                throw new Error(error.message)
            }

            const data = await response.json()
            setIsLoggingIn(true)
            setMessage(data.message)
            setError(null)
            router.push('/dashboard')
        } catch (err) {
            setMessage(null)
            setError(err.message)
        }
    }

    return (
        <div className='flex justify-center md:items-center w-screen h-screen p-6'>
            <Card className='ring-0 w-100 shadow-none'>
                <CardHeader>
                    <CardTitle className='text-3xl font-bold'>Welcome Back</CardTitle>
                    <CardDescription>Pick up where you left off and stay productive.</CardDescription>
                </CardHeader>
                <CardContent className='flex flex-col gap-4'>
                    <form className='flex flex-col gap-6' onSubmit={handleSubmit}>
                        <div className='flex flex-col gap-2'>
                            <Label>Email Address</Label>
                            <Input
                                type='text'
                                placeholder='e.g eimii1@gmail.com'
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Password <span className='opacity-50'>(minimum of 8 characters)</span></Label>
                            <Input
                                type='password'
                                placeholder='e.g ••••••••'
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        {isLoggingIn ? (
                            <Button className='gap-2' disabled variant='outline'>
                                <Loader2 className="size-4 animate-spin" />
                                Logging In
                            </Button>
                        ) : (
                            <Button
                                variant='outline'
                                type='submit'
                            >Log in</Button>
                        )}
                    </form>
                    <Separator className='md:hidden' />
                    <span className='md:absolute md:top-0 md:right-0 md:p-6 flex justify-center'>
                        <span>Dont't have an account? <Link className='font-bold' href='/register'>Sign Up</Link> </span>
                    </span>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoginForm