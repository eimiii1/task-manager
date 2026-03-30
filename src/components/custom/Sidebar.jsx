'use client'
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { Loader2 } from "lucide-react"
import { Home } from "lucide-react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from 'framer-motion'
import { LayoutDashboard } from "lucide-react"
import { FolderCheck } from "lucide-react"
import { Separator } from "../ui/separator"
import { LogOut } from "lucide-react"
import { UserRoundPlus } from "lucide-react"
import { routerServerGlobal } from "next/dist/server/lib/router-utils/router-server-context"
import { SidebarIcon } from "lucide-react"

const Sidebar = () => {
    const pathname = usePathname()
    const router = useRouter()
    const [isToggled, setIsToggled] = useState(false)
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    const [userToggled, setUserToggled] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/check')
                if (!response.ok) {
                    const error = await response.json()
                    throw new Error(error.message)
                }

                const data = await response.json()
                setUser(data.user)
                setError(null)
            } catch (err) {
                setError(err.message)
            }
        }
        fetchUser()
    }, [])

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/login')
        } catch (err) {
            setError(err.message)
        }
    }


    if (pathname === '/login' || pathname === '/register' || pathname === '/') {
        return null
    }


    if (!user) {
        return (
            <div className="w-screen h-screen flex flex-col gap-4 justify-center items-center">
                <span className="text-5xl flex subpixel-antialiased gap-1 justify-center items-center">
                    Noto
                    <span className="block w-3 h-3 rounded-full bg-[#43d870] subpixel-antialiased mt-auto"></span>
                </span>
                <Loader2 className="animate-spin" />
            </div>
        )
    }

    return (
        <div
        >
            <motion.div
                onClick={() => setIsToggled(prev => !prev)}
                className={`flex flex-col gap-1 absolute top-0 left-0 p-5 ${isToggled ? 'z-60' : 'z-0'}`}
                animate={isToggled ? { x: 200 } : { x: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                }}
            >
                <motion.span
                    animate={isToggled ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30
                    }}
                    className="block h-0.5 w-5 bg-primary/60 rounded-2xl"
                />
                <motion.span
                    animate={isToggled ? { rotate: -45, y: -2 } : { rotate: 0, y: 0 }}
                    transition={{
                        type: 'spring',
                        stiffness: 300,
                        damping: 30
                    }}
                    className="block h-0.5 w-5 bg-primary/60 rounded-2xl"
                />
            </motion.div>
            {/* Overlay background */}
            <motion.div
                className="fixed h-screen w-screen bg-primary/10 -z-10"
                animate={{
                    opacity: isToggled ? 1 : 0
                }}
            />

            <motion.div
                className={`flex flex-col gap-5 overflow-auto h-screen border shadow-xs bg-secondary ${isToggled ? 'z-50' : 'z-0'}`}
                initial={{ width: isToggled ? '15.925em' : '0px' }}
                animate={{ width: isToggled ? '15.925em' : '0px' }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                }}
            >
                <header
                    className="p-3"
                >
                    <Button
                        className="flex gap-1 border-0 relative"
                        variant="secondary"
                        onClick={() => setUserToggled(prev => !prev)}
                    >
                        {user.username}
                        <ChevronDown className="w-3"
                        />
                    </Button>
                    <div
                        className={`absolute top-15 left-5 flex-col shadow-md gap-3 bg-secondary rounded-md w-65 z-60 p-3 border justify-center items-center ${!isToggled && 'opacity-0'} ${userToggled ? 'flex' : 'hidden'}`}
                    >
                        <Button
                            variant="secondary"
                            className="flex w-full gap-2 justify-start"
                        >
                            <UserRoundPlus className="w-4 opacity-50" />
                            <span className="opacity-50 text-sm">Create new account</span>
                        </Button>
                        <Button
                            variant="secondary"
                            className="flex w-full gap-2 justify-start"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-4 opacity-50" />
                            <span className="opacity-50 text-sm">Sign out</span>
                        </Button>
                    </div>
                </header>
                <div className="p-5 flex flex-col gap-2">
                    <Link
                        href='/login'
                    >
                        <Button
                            className='w-full flex justify-start items-center gap-2'
                            variant="secondary"
                        >
                            <Home className="opacity-60 w-4" />
                            Home
                        </Button>
                    </Link>
                    <Link
                        href='/dashboard'
                    >
                        <Button
                            className={`w-full flex justify-start items-center gap-2 ${pathname === '/dashboard' && 'bg-[#43d870] text-white'}`}
                            variant="secondary"
                        >
                            <LayoutDashboard className="opacity-60 w-4" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link
                        href='/tasks'
                    >
                        <Button
                            className={`w-full flex justify-start items-center gap-2 ${pathname === '/tasks' && 'bg-[#43d870] text-white'}`}
                            variant="secondary"
                        >
                            <FolderCheck className="opacity-60 w-4" />
                            My Tasks
                        </Button>
                    </Link>
                </div>
            </motion.div>
        </div>
    )
}

export default Sidebar