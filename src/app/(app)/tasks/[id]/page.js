'use client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useParams } from "next/navigation"
import { useState, useEffect } from 'react'

export default function TaskCard() {
    const [task, setTask] = useState(null)
    const [error, setError] = useState(null)
    const [newTitle, setNewTitle] = useState('')
    const [newDescription, setNewDescription] = useState('')
    const [newStatus, setNewStatus] = useState('')

    const params = useParams()
    const id = params.id

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await fetch(`/api/tasks/${id}`)
                if (!response.ok) {
                    const error = await response.json()
                    setError(error.message)
                }

                const data = await response.json()
                setTask(data)
                console.log('Task data:', data)
                setError(null)
            } catch (err) {
                setError(err.message)
            }
        }
        fetchTask()
    }, [id])

    console.log(newStatus)

    const handleUpdate = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTitle,
                    description: newDescription,
                    completed: newStatus
                })
            })

            if (!response.ok) {
                const error = await response.json()
                setError(error.error)
                console.log('Response error:', error.error)
                console.log({ newTitle, newDescription })
            }
        } catch (err) {
            setError('Catch error:', err.error)
        }
    }

    return (
        <div className='flex-1 flex justify-center p-10'>
            {!task ? 'Loading...' : (
                <div className='flex flex-col gap-2 justfiy-center items-center'>
                    <div>
                        <h1 className="text-2xl font-medium">Edit your task</h1>
                    </div>
                    <form className="flex flex-col gap-6" onSubmit={handleUpdate}>
                        <div className="flex flex-col gap-2">
                            <Label>Title</Label>
                            <Input
                                placeholder='Enter your new title'
                                type='text'
                                value={newTitle}
                                onChange={e => setNewTitle(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Description</Label>
                            <Input
                                placeholder='Enter your new description'
                                type='text'
                                value={newDescription}
                                onChange={e => setNewDescription(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Label>Description</Label>
                            <select value={newStatus ? 'true' : 'false'} onChange={e => setNewStatus(e.target.value === 'true')}>
                                <option value='false'>In Progress</option>
                                <option value='true'>Done</option>
                            </select>
                        </div>
                        <Button
                            variant='default'
                            className='bg-blue-500 hover:bg-blue-400'
                            type='submit'
                        >Update</Button>
                    </form>
                </div>
            )}
        </div>
    )
}