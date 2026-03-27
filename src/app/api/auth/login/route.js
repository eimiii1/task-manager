import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { connectDB } from '@/lib/db'
import User from '@/lib/models/User'
import { z } from 'zod'

const USER = z.object({
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

    const { email, password } = result.data
    try {
        const user = await User.findOne({ email })
        const compare = await bcrypt.compare(password, user.password)
        if (!compare) {
            return NextResponse.json(
                { message: "Password doesn't match!" },
                { status: 401 }
            )
        }

        // * compare is success -> create a token
        const token = jwt.sign(
            { id: user._id, username: user.username, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '1d' }
        )

        // * save to browser cookies
        const response = NextResponse.json(
            { message: 'Successfully logged in!' },
            { status: 200 }
        )

        response.cookies.set('accessToken', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 // 1 day
        })

        return response
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}