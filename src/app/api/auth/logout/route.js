import { NextResponse } from "next/server";

export async function POST(request) {
    try {
        const response = NextResponse.json(
            { message: 'Successfully signed out!' },
            { status: 200 }
        )

        response.cookies.delete('accessToken')
        console.log('deleted token')
        return response
    } catch (err) {
        return NextResponse.json(
            { error: err.message },
            { status: 500 }
        )
    }
}