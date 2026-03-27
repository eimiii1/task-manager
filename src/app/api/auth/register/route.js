import { NextResponse } from "next/server";
import bcrypt from 'bcrypt'
import { z } from 'zod'
import User from "@/lib/models/User";
import { connectDB } from "@/lib/db";

// * user schema for zod validation
const USER = z.object({
    username: z.string().min(3).max(20),
    email: z.email(),
    password: z.string().min(8)
})

export async function POST(request) {
    await connectDB()
    const body = await request.json()
    const result = USER.safeParse(body)
    if (!result.success) {
        return NextResponse.json(
            { error: result.error.issues },
            { status: 401 }
        )
    }

    const { username, email, password } = result.data
    try {
        const hashedPassword = await bcrypt.hash(password, 10)
        // ? Query to dataase
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        })

        return NextResponse.json(
            { message: { messageHeader: 'Account created successfully!', messageDescription: 'Your account has been created successfully. You can now start saving your tasks.' } },
            { status: 201 }
        )
    } catch {
        return
    }
}