import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { ApiKey, Nullifier } from '@/lib/models'

export async function POST(request: Request) {
  try {
    const { apiKey, userId } = await request.json()

    if (!apiKey || !userId) {
      return NextResponse.json({ error: 'Missing apiKey or userId' }, { status: 400 })
    }

    await connectDB()

    // Look up the API key
    const apiKeyDoc = await ApiKey.findOne({ key: apiKey })
    if (!apiKeyDoc) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    // Check if user is enrolled
    const enrolled = await Nullifier.findOne({ userId, apiKey })
    if (!enrolled) {
      return NextResponse.json({ enrolled: false })
    }

    return NextResponse.json({
      enrolled: true,
      enrolledAt: enrolled.enrolledAt,
      lastVerifiedAt: enrolled.lastVerifiedAt,
    })
  } catch (error) {
    return NextResponse.json({ error: 'Check failed' }, { status: 500 })
  }
}