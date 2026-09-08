import { NextResponse } from 'next/server'
import { PrivyClient } from '@privy-io/node'
import connectDB from '@/lib/mongodb'
import { ApiKey } from '@/lib/models'
import crypto from 'crypto'

const privy = new PrivyClient({
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  appSecret: process.env.PRIVY_APP_SECRET!,
})

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const claims = await privy.utils().auth().verifyAccessToken(token)
    const userId = claims.user_id

    await connectDB()

    const { appName } = await request.json()

    const existing = await ApiKey.findOne({ userId })
    if (existing) {
      return NextResponse.json({ apiKey: existing.key, appName: existing.appName })
    }

    const key = `fg_live_${crypto.randomBytes(16).toString('hex')}`
    const action = `facegate_${crypto.randomBytes(8).toString('hex')}`

    const apiKey = await ApiKey.create({
      key,
      userId,
      email: userId,
      appName,
      action,
    })

    return NextResponse.json({ apiKey: apiKey.key })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate API key' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const claims = await privy.utils().auth().verifyAccessToken(token)

    await connectDB()

    const apiKey = await ApiKey.findOne({ userId: claims.user_id })
    if (!apiKey) {
      return NextResponse.json({ apiKey: null })
    }

    return NextResponse.json({ apiKey: apiKey.key, appName: apiKey.appName })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch API key' }, { status: 500 })
  }
}