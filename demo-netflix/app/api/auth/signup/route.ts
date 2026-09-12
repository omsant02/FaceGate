import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { User } from '@/lib/models'

export async function POST(request: Request) {
  try {
    const { email, password, checkOnly } = await request.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 })
    }
    await connectDB()
    const existing = await User.findOne({ email })
    if (existing) {
      return NextResponse.json({ error: 'Account already exists' }, { status: 409 })
    }
    // If checkOnly — email is available, don't create user yet
    if (checkOnly) {
      return NextResponse.json({ success: true })
    }
    await User.create({ email, password })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Signup failed' }, { status: 500 })
  }
}