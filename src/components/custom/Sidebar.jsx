'use client'
import { useState, useEffect } from 'react'
import { Logo } from './logo'
import { LayoutDashboard } from 'lucide-react'
import { Check } from 'lucide-react'
import { Separator } from '../ui/separator'
import { usePathname } from 'next/navigation'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import { LogOut } from 'lucide-react'
import { CircleUserRound } from 'lucide-react'
import { Bell } from 'lucide-react'
import { motion } from 'framer-motion'

export function Sidebar() {
    const [user, setUser] = useState(null)
    const [isToggled, setIsToggled] = useState(false)
    const router = useRouter()

    useEffect(() => {
        fetch('/api/auth/check')
            .then(res => res.json())
            .then(data => setUser(data.user))
    }, [])

    const handleLogout = async () => {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/login')
        } catch {
            router.push('/login')
        }
    }

    return (
        <motion.div
            className='hidden md:flex flex-col justify-between w-65 h-screen border overflow-hidden'
            initial={{width: '0px'}}
            animate={{width: '250px'}}
            transition={{
                type: 'spring',
                stiffness: 500,
                damping: 50
            }}
        >
            <div>
                <header
                    className='w-full flex justify-center h-fit p-5 relative'
                >
                    <Logo />
                </header>
                <Separator />
                <Menu />
            </div>
            <Separator className='mt-auto' />
            <NavFooter
                className='p-5 flex gap-3 justify-between'
            >
                <NavFooterItem
                    variant='destructive'
                    onClick={handleLogout}
                    className='flex justify-center items-center'
                    size='icon'
                >
                    <LogOut className='rotate-180' />
                </NavFooterItem>
                <NavFooterItem
                    className="flex justify-center items-center"
                    variant='outline'
                    size='icon'
                >
                    <Settings />
                </NavFooterItem>
                <NavFooterItem
                    className="flex justify-center items-center"
                    variant='outline'
                    size='icon'
                >
                    <CircleUserRound />
                </NavFooterItem>
                <NavFooterItem
                    className="flex justify-center items-center"
                    variant='outline'
                    size='icon'
                >
                    <Bell />
                </NavFooterItem>
            </NavFooter>
        </motion.div>
    )
}

function Menu() {
    const menu = {
        title: 'MENU',
        navigations: [
            { icon: <LayoutDashboard size={20} className='text-primary/50' />, name: 'Dashboard', path: '/dashboard' },
            { icon: <Check size={20} className='text-primary/50' />, name: 'Tasks', path: '/tasks' }
        ]
    }

    return (
        <div
            className='p-5 flex flex-col gap-4'
        >
            <h1 className='font-semibold text-xs opacity-40'>
                {menu.title}
            </h1>
            <ul
                className='flex flex-col gap-2'
            >
                {menu.navigations.map(item => (
                    <NavItem key={item.name} icon={item.icon} name={item.name} path={item.path} />
                ))}
            </ul>
        </div>
    )
}

function NavItem({ icon, name, path }) {
    const pathname = usePathname()
    const router = useRouter()

    return (
        <Button
            className={`flex justify-start`}
            variant={pathname === path ? 'secondary' : 'ghost'}
            onClick={() => router.push(path)}
        >
            {icon}
            <span
                className='font-semibold opacity-50 text-[0.85rem]'
            >
                {name}
            </span>
        </Button>
    )
}

function NavFooter({ children, className }) {
    return (
        <div className={className}>
            {children}
        </div>
    )
}

function NavFooterItem({ children, variant, onClick, className, size }) {
    return (
        <Button
            variant={variant}
            className={className}
            onClick={onClick}
            size={size}
        >
            {children}
        </Button>
    )
}