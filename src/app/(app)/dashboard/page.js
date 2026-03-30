'use client'
import { Loading } from "@/components/custom/loading"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Dashboard() {
    const router = useRouter()
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const checkAuthorization = async () => {
            const response = await fetch(['/api/auth/check'])
            if (!response.ok) {
                const error = await response.json()
                setError(error.message)
                router.push('/login')
            }
            const data = await response.json()
            setUser(data.user)
            setError(null)
        }

        checkAuthorization()
    }, [])
    
    if (!user) {
        return <Loading />
    }
    
    return (
        <div>
            asd
        </div>
    )
}