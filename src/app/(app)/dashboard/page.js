'use client'
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { motion } from 'framer-motion'
import { Loader2 } from "lucide-react"

const Dashboard = () => {
    const [user, setUser] = useState(null)
    const [isAuthorized, setIsAuthorized] = useState(false)
    const router = useRouter()

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await fetch('/api/auth/check')
                if (!response.ok) {
                    router.push('/login')
                    return
                }

                const data = await response.json()
                setUser(data.user)
                setIsAuthorized(true)
            } catch {
                router.push('/login')
            }
        }
        checkAuthorization()
    }, [router])
    
    if (!isAuthorized) return <Loader2 className="animate-spin" />

    return (
        <>
            <motion.div
                className='relative flex'
            >
                <div>
                </div>
            </motion.div>
        </>
    )
}

export default Dashboard