import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

export async function GET(request) {
    try {
        const token = request.cookies.get('accessToken')?.value
        if (!token) {
            return NextResponse.json(
                { error: 'Token is not provided. Not Authorized.' },
                { status: 401 }
            )
        }

        // * if token is provided -> verify
        jwt.verify(token, process.env.JWT_SECRET)

        return NextResponse.json(
            { message: 'Authorized' },
            { status: 200 }
        )
    } catch {
        return NextResponse.json(
            { error: 'Invalid or expired token.' },
            { status: 401 }
        )
    }
}