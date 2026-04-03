'use client'
import { Loading } from "@/components/custom/loading"
import { SearchBar } from "@/components/custom/searhbar"
import { UserData } from "@/components/custom/user"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from 'framer-motion'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown } from "lucide-react"
import { Plus } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

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
    const [isNewTaskToggled, setIsNewTaskToggled] = useState(false)
    return (
        <div
            className="w-full h-screen bg-secondary p-5 overflow-y-scroll relative"
        >
            <NewTask isNewTaskToggled={isNewTaskToggled} setIsNewTaskToggled={setIsNewTaskToggled} />
            <div
                className="text-xl font-bold text-shadow-2xs p-5 rounded-xl flex justify-between items-center"
            >
                <div>
                    <h1>Hello {user.username}!</h1>
                    <p className='text-sm font-medium opacity-50'>Welcome back!</p>
                </div>
                <Button
                    className='bg-blue-500 hover:bg-blue-400'
                    onClick={() => setIsNewTaskToggled(prev => !prev)}
                >
                    <Plus />
                    <span
                    >New Task</span>
                </Button>
            </div>
            <div
                className='p-5 flex flex-col gap-4'
            >
                <header>
                    <h1 className='text-2xl font-light'>Task List</h1>
                    <p className='text-sm font-medium opacity-50'>Here is a list of tasks that you have created.</p>
                </header>
                <Tasks />
            </div>
        </div>
    )

    function Tasks() {
        const [activeTab, setActiveTab] = useState('inProgress')
        const [tasks, setTasks] = useState(null)
        const [error, setError] = useState(null)
        const [isCompleted, setIsCompleted] = useState(false)

        useEffect(() => {
            const fetchTasks = async () => {
                try {
                    const response = await fetch('/api/tasks')
                    if (!response.ok) {
                        const error = await response.json()
                        setError(error.message)
                        console.log('Response error:', error)
                    }

                    const data = await response.json()
                    setTasks(data)
                } catch (err) {
                    setError('Error:', err.message)
                }
            }
            fetchTasks()
        }, [])

        const handleDelete = async (taskId) => {
            try {
                setTasks(tasks.filter(t => t._id !== taskId))
                const response = await fetch(`/api/tasks/${taskId}`, {method: 'DELETE'})
            } catch (err) {
                setError(err.message)
            }
        }

        return (
            <div
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {tasks ? (
                    <>
                        {tasks.map(task => (
                            <motion.div
                                key={task._id}
                                className='flex flex-col gap-6 p-5 shadow-2xl border rounded-xl bg-white'
                                whileHover={{ scale: 1.025 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className='flex justify-between items-center flex-wrap'>
                                    <Badge
                                        className='bg-white'
                                        variant='secondary'
                                    >
                                        {new Date(task.createdAt).toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                    </Badge>
                                    <Badge
                                        className='rounded-sm bg-white'
                                        variant='secondary'
                                    >
                                        <span className={task.completed ? 'text-green-600' : 'text-blue-600'}>{task.completed ? 'Done' : 'In Progress'}</span>
                                    </Badge>
                                </div>
                                <div className='flex flex-col justify-center items-start text-wrap'>
                                    <h1 className='max-w-full truncate md:truncate'>{task.title}</h1>
                                    <p className='opacity-70 text-xs max-w-full max-h-full truncate'>{task.description}</p>
                                </div>
                                <Separator />
                                <div className="flex justify-start items-center gap-2">
                                    <Button
                                        className='bg-blue-500 hover:bg-blue-400 shadow-md'
                                        asChild
                                    >
                                        <Link href={`/tasks/${task._id}`}>
                                            Edit
                                        </Link>
                                    </Button>
                                    <Button
                                        variant='destructive'
                                        onClick={() => handleDelete(task._id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </motion.div>
                        ))}
                    </>
                ) : 'Empty'}
            </div>
        )
    }
}

function NewTask({ isNewTaskToggled, setIsNewTaskToggled }) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [error, setError] = useState(null)
    const [message, setMessage] = useState(null)

    const handleSubmit = async (e) => {
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            })

            if (!response.ok) {
                const error = await response.json()
                setError(error.message)
                console.log('Response error:', error.message)
            }

            const data = await response.json()
            setMessage(data.message)
            setError(null)
            console.log('New task:', data)
            setIsNewTaskToggled(false)
        } catch (err) {
            setError(err.message)
        }
    }

    return (
        <AnimatePresence>
            <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 300,
                    damping: 30
                }}
                className={`${isNewTaskToggled ? 'flex' : 'hidden'} gap-4 rounded-4xl bg-white flex-col absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-60 border w-100 shadow-2xl p-5`}
            >
                <div>
                    <h1 className='text-2xl font-semibold'>New Task</h1>
                    <h2 className='text-sm'>Enter your new task</h2>
                </div>
                <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                    <div className='flex flex-col gap-2'>
                        <Label>Title</Label>
                        <Input
                            placeholder="e.g. Show to code"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <Label>Description</Label>
                        <Input
                            placeholder='e.g. A description of how to code'
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        className='bg-blue-500 hover:bg-blue-400'
                        variant='default'
                        type='submit'
                    >Submit</Button>
                </form>
            </motion.div>
        </AnimatePresence>
    )
}