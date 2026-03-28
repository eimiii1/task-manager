'use client'
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

const Dashboard = () => {
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
            } catch {
                return
            }
        }
        
        checkAuthorization()
    }, [])

    return (
        <div>
            ads
        </div>
    )
}

export default Dashboard