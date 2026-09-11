import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { User } from '@/lib/models'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    await connectDB()
    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: 'No account found. Please sign up.' }, { status: 404 })
    }
    if (user.password !== password) {
      return NextResponse.json({ error: 'Wrong password.' }, { status: 401 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Signin failed' }, { status: 500 })
  }
}