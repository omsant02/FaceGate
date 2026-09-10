import { NextResponse } from 'next/server'
import { PrivyClient } from '@privy-io/node'
import connectDB from '@/lib/mongodb'
import { ApiKey, Nullifier } from '@/lib/models'

const privy = new PrivyClient({
  appId: process.env.NEXT_PUBLIC_PRIVY_APP_ID!,
  appSecret: process.env.PRIVY_APP_SECRET!,
})

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const claims = await privy.utils().auth().verifyAccessToken(token)

    await connectDB()

    const apiKeyDoc = await ApiKey.findOne({ userId: claims.user_id })
    if (!apiKeyDoc) {
      return NextResponse.json({ enrollments: 0 })
    }

    const enrollments = await Nullifier.countDocuments({ apiKey: apiKeyDoc.key })

    return NextResponse.json({ enrollments })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 })
  }
}