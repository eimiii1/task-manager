import { NextResponse } from 'next/server'
import { z } from 'zod'
import Task from '@/lib/models/Task'
import { connectDB } from '@/lib/db'
import jwt from 'jsonwebtoken'

// * POST /api/tasks

const postSchema = z.object({
    title: z.string(),
    description: z.string().optional(),
    completed: z.boolean().optional()
})

export async function POST(request) {
    try {
        await connectDB()
        const body = await request.json()
        const result = postSchema.safeParse(body)

        if (!result.success) {
            return NextResponse.json(
                { error: result.error.issues },
                { status: 400 }
            )
        }

        const { title, description } = result.data

        // * verify token 
        const token = request.cookies.get('accessToken')?.value
        if (!token) {
            return NextResponse.json(
                { error: 'Not authorized' },
                { status: 401 }
            )
        }

        // ! token verified -> decode 
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        await Task.create({
            title,
            description,
            userId: decoded.id
        })

        return NextResponse.json(
            { message: 'Task created successfully.' },
            { status: 201 }
        )
    } catch (err) {
        return NextResponse.json(
            { error: 'Internal server error.' },
            { status: 500 }
        )
    }
}

// * GET /api/tasks
export async function GET(request) {
    try {
        await connectDB()
        // ! verify token
        const token = request.cookies.get('accessToken')?.value
        if (!token) {
            return NextResponse.json(
                { message: 'No token provided.' },
                { status: 401 }
            )
        }

        // * token is provided -> decode
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const userId = decoded.id

        const task = await Task.find({ userId })
        return NextResponse.json(task)
    } catch (err) {
        console.log(err.message)
        return NextResponse.json(
            { message: err.message },
            { status: 500 }
        )
    }
}