import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'
import Task from "@/lib/models/Task";
import { z } from 'zod'
import { connectDB } from "@/lib/db";

// * GET api/tasks/[id]
export async function GET(request, { params }) {
    try {
        await connectDB()
        const token = request.cookies.get('accessToken')?.value
        if (!token) {
            return NextResponse.json(
                { message: 'No token provided.' },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { id } = await params
        const userId = decoded.id

        // ? find task by id 
        const task = await Task.findById(id)

        // * if task not exist -> return status 404
        if (!task) {
            return NextResponse.json(
                { message: 'Task not found.' },
                { status: 404 }
            )
        }

        // * additional security for ownership check
        if (task.userId.toString() !== userId) {
            return NextResponse.json(
                { message: 'Forbidden' },
                { status: 403 }
            )
        }

        return NextResponse.json(task)

    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}

// * PUT /api/tasks/[id]
const putSchema = z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    completed: z.boolean().optional()
})

export async function PUT(request, { params }) {
    try {
        await connectDB()
        const token = request.cookies.get('accessToken')?.value
        if (!token) {
            return NextResponse.json(
                { message: 'Token not provided.' },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { id } = await params
        const userId = decoded.id

        const taskId = await Task.findById(id)
        if (!taskId) {
            return NextResponse.json(
                { message: 'Task not found.' },
                { status: 404 }
            )
        }

        if (taskId.userId.toString() !== userId) {
            return NextResponse.json(
                { message: 'Forbidden' },
                { status: 403 }
            )
        }

        const body = await request.json()
        const result = putSchema.safeParse(body)
        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues },
                { status: 400 }
            )
        }

        const { title, description, completed } = result.data
        const task = await Task.findByIdAndUpdate(id, { title, description, completed }, { new: true })

        return NextResponse.json(
            { message: 'Task updated!', task },
            { status: 200 }
        )
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}

// * DELETE /api/tasks/[id]
export async function DELETE(request, { params }) {
    try {
        await connectDB()
        const token = request.cookies.get('accessToken')?.value
        if (!token) {
            return NextResponse.json(
                { message: 'Token not provided' },
                { status: 401 }
            )
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const { id } = await params
        const userId = decoded.id

        const taskId = await Task.findById(id)
        if (!taskId) {
            return NextResponse.json(
                { message: 'Task not found.' },
                { status: 404 }
            )
        }

        if (taskId.userId.toString() !== userId) {
            return NextResponse.json(
                { message: 'Forbidden' },
                { status: 403 }
            )
        }

        await Task.findByIdAndDelete(id)
        return NextResponse.json(
            { message: 'Task deleted!' },
            { status: 200 }
        )
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}