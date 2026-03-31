'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Logo } from './logo'
import { LayoutDashboard } from 'lucide-react'
import { Check } from 'lucide-react'
import { Button } from '../ui/button'
import { usePathname, useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import { LogOut } from 'lucide-react'
import { CircleUserRound } from 'lucide-react'
import { Bell } from 'lucide-react'
import { SearchBar } from './searhbar'
import { UserData } from './user'
import { Search } from 'lucide-react'

export function MobileHeader() {
    const [isToggled, setIsToggled] = useState(false)
    const router = useRouter()
    const pathname = usePathname()
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/auth/check')
                const data = await response.json()
                setUser(data.user)
            } catch (err) {
                setError(err)
            }
        }
        fetchUser()
    }, [])

    if (pathname === '/login' || pathname === 'register') {
        return null
    }

    return (
        <div className='flex flex-col justify-start relative md:hidden'>
            <div className='relative border-b flex justify-between items-center p-5 md:hidden z-0'>
                <div className='flex justify-center items-center gap-5'>
                    <Burger isToggled={isToggled} setIsToggled={setIsToggled} />
                    <Button
                        variant='outline'
                        size='icon'
                    >
                        <Search
                            className="opacity-50 text-muted-foreground"
                        />
                    </Button>
                    <UserData userdata={user} className='flex justify-center items-center gap-2' />
                </div>
                <Logo />
            </div>
            <MobileSidebar isToggled={isToggled} router={router} pathname={pathname} />
        </div>
    )
}

function Burger({ isToggled, setIsToggled }) {
    return (
        <div
            className='flex flex-col gap-1'
            onClick={() => setIsToggled(prev => !prev)}
        >
            <motion.span
                className='block h-0.5 w-5 bg-primary/70 rounded-2xl'
                initial={isToggled ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                animate={isToggled ? { rotate: 45, y: 4 } : { rotate: 0, y: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                }}
            />
            <motion.span
                className='block h-0.5 w-5 bg-primary/70 rounded-2xl'
                initial={isToggled ? { scaleX: 0 } : { scaleX: 1 }}
                animate={isToggled ? { scaleX: 0 } : { scaleX: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                }}
            />
            <motion.span
                className='block h-0.5 w-5 bg-primary/70 rounded-2xl'
                initial={isToggled ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                animate={isToggled ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30
                }}
            />
        </div>
    )
}

function MobileSidebar({ isToggled, router, pathname }) {
    const [error, setError] = useState(null)
    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/login')
        } catch {
            router.push('/login')
        }
    }

    const menu = {
        title: 'MENU',
        navigations: [
            { icon: <LayoutDashboard size={20} className='text-primary/50' />, name: 'Dashboard', path: '/dashboard' },
            { icon: <Check size={20} className='text-primary/50' />, name: 'Tasks', path: '/tasks' }
        ]
    }

    const other = {
        title: "OTHER",
        items: [
            { icon: <Bell className='text-primary/50' />, name: 'Notifications', variant: 'outline', route: () => router.push('/notifications') },
            { icon: <Settings className='text-primary/50' />, name: 'Settings', variant: 'outline', route: () => router.push('/settings') },
            { icon: <CircleUserRound className='text-primary/50' />, name: 'Profile', variant: 'outline', route: () => router.push('/profile') },
            { icon: <LogOut className='text-primary/50' />, name: 'Sign out', variant: 'destructive', route: handleLogout },
        ]
    }

    return (
        <motion.div
            className='fixed left-0 z-20 h-screen w-screen bg-white top-17 shadow-xs overflow-hidden'
            initial={{ width: isToggled ? '100%' : '0' }}
            animate={{ width: isToggled ? '100%' : '0' }}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 50,
            }}
        >
            <div
                className='p-5 flex flex-col gap-3'
            >
                <h1
                    className='font-semibold text-xs opacity-40'
                >
                    {menu.title}
                </h1>
                <ul
                    className='flex flex-col gap-2'
                >
                    {menu.navigations.map(item => (
                        <Button
                            key={item.name}
                            className='w-full flex justify-start'
                            variant={pathname === item.path ? 'active' : 'ghost'}
                            onClick={() => router.push(item.path)}
                        >
                            {item.icon}
                            <span
                                className={`font-bold opacity-50 text-[0.85rem] ${pathname === pathname && 'opacity-100'}`}
                            >
                                {item.name}
                            </span>
                        </Button>
                    ))}
                </ul>
            </div>
            <div className='p-5 flex flex-col gap-3'>
                <h1
                    className='font-semibold text-xs opacity-40'
                >
                    {other.title}
                </h1>
                <ul
                    className='flex flex-col gap-2'
                >
                    {other.items.map(item => (
                        <Button
                            key={item.name}
                            className='w-full flex justify-start'
                            variant={item.variant}
                            onClick={item.route}
                        >
                            {item.icon}
                            <span
                                className='font-semibold opacity-50 text-[0.85rem]'
                            >
                                {item.name}
                            </span>
                        </Button>
                    ))}
                </ul>
            </div>
            <div>

            </div>
        </motion.div>
    )
}