'use client'
import { Loading } from "@/components/custom/loading"
import { SearchBar } from "@/components/custom/searhbar"
import { UserData } from "@/components/custom/user"
import { useRouter } from "next/navigation"
import { Fragment, useEffect, useState } from "react"
import { motion } from 'framer-motion'
import { ActivitySquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default function Dashboard() {
    const router = useRouter()
    const [error, setError] = useState(null)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const checkAuthorization = async () => {
            try {
                const response = await fetch('/api/auth/check')
                if (!response.ok) {
                    router.push('/login')
                }
                const data = await response.json()
                setUser(data.user)
                setError(null)
            } catch {
                router.push('/login')
            }
        }

        checkAuthorization()
    }, [])

    if (!user) {
        return <Loading />
    }

    return (
        <div className="h-full relative flex flex-col items-center justify-center flex-2">
            <DashboardHeader user={user} />
            <DashboardContent user={user} />
        </div>
    )
}


function DashboardHeader({ user }) {
    return (
        <div className="hidden md:flex p-5 w-full justify-between items-center">
            <SearchBar classname='relative w-fit' />
            <UserData userdata={user} className="flex items-center justify-center gap-2 flex-row-reverse" />
        </div>
    )
}

function DashboardContent({ user }) {
    return (
        <div
            className="w-full h-screen bg-secondary p-5 overflow-y-scroll"
        >
            <div
                className="block text-xl font-bold text-shadow-2xs p-5 rounded-xl"
            >
                <h1>Hello {user.username}!</h1>
                <p className='text-sm font-medium opacity-50'>Welcome back!</p>
            </div>
            <div
                className='p-5 flex flex-col gap-4'
            >
                <header>
                    <h1 className='text-2xl font-light'>Task List</h1>
                    <p className='text-sm font-medium opacity-50'>Here is a list of tasks that you have created.</p>
                </header>
                <TaskTabs />
            </div>
        </div>
    )

    function TaskTabs() {
        const [activeTab, setActiveTab] = useState('inProgress')
        const tabs = [
            { name: 'In Progress', state: 'inProgress', task: <InProgressTasks /> },
            { name: 'Completed', state: 'completed', task: <CompletedTasks /> }
        ]
        return (
            <div
                className="flex flex-col gap-10"
            >
                <div
                    className='flex justify-center md:justify-start gap-4 p-5 bg-white rounded-xl'
                >
                    {tabs.map(tab => (
                        <motion.span
                            whileTap={{ scale: 0.95 }}
                            key={tab.name}
                            className={`opacity-50 font-semibold text-sm cursor-pointer select-none ${activeTab === tab.state && 'text-blue-500 opacity-100'}`}
                            onClick={() => setActiveTab(tab.state)}
                        >
                            {tab.name}
                        </motion.span>
                    ))}
                </div>
                <div
                    className="p-5 grid grid-cols-1 lg:grid-cols-5 gap-4"
                >
                    {activeTab === tabs[0].state && tabs[0].task}
                    {activeTab === tabs[1].state && tabs[1].task}
                </div>
            </div>
        )
    }

    function InProgressTasks() {
        const [tasks, setTasks] = useState(null)
        const [error, setError] = useState(null)

        useEffect(() => {
            const fetchTasks = async () => {
                try {
                    const response = await fetch('/api/tasks')
                    if (!response.ok) {
                        const error = await response.json()
                        setError(error.message)
                    }

                    const data = await response.json()
                    setTasks(data)
                    setError(null)
                    console.log(data)
                } catch (err) {
                    setError(err.message)
                }
            }
            fetchTasks()
        }, [])

        return (
            <>
                {tasks && (
                    <>
                        {tasks.map(task => (
                            !task.completed && (
                                <div
                                    key={task._id}
                                    className="shadow-sm p-5 flex flex-col h-75 gap-5 relative rounded-xl"
                                >
                                    <Badge
                                        variant="default"
                                        className='flex justify-center items-center'
                                    >
                                        {new Date(task.createdAt)?.toLocaleDateString()}
                                    </Badge>
                                    <div className=''>
                                        <h1 className="text-xl truncate md:truncate font-medium wrap-break-word">
                                            {task.title}
                                        </h1>
                                        <p className="opacity-50 text-sm font-medium wrap-break-word truncate md:truncate">
                                            {task.description}
                                        </p>
                                    </div>
                                </div>
                            )
                        ))}
                    </>
                )}
            </>
        )
    }

    function CompletedTasks() {
        return "gago"
    }
}