'use client'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

const Tasks = () => {
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const router = useRouter()

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await fetch('/api/auth/check')
                if (!response.ok) {
                    router.push('/login')
                    const error = await response.json()
                    throw new Error(error.message)
                }

                const data = await response.json()
                setUser(data.user)
                setError(null)
            } catch {
                return
            }
        }
        checkAuthorization()

    }, [])

    return (
        <div className='relative flex'>
        </div>
    )
}

export default Tasks