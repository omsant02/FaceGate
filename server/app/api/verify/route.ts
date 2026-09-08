import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import { ApiKey, Nullifier } from '@/lib/models'

export async function POST(request: Request) {
  try {
    const { apiKey, userId, idkitResponse } = await request.json()

    if (!apiKey || !userId || !idkitResponse) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    await connectDB()

    // Look up the API key
    const apiKeyDoc = await ApiKey.findOne({ key: apiKey })
    if (!apiKeyDoc) {
      return NextResponse.json({ error: 'Invalid API key' }, { status: 401 })
    }

    // Verify proof with World's API
    const response = await fetch(
      `https://developer.world.org/api/v4/verify/${process.env.WORLD_RP_ID}`,
      {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(idkitResponse),
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'World ID verification failed' }, { status: 400 })
    }

    const data = await response.json()
    const nullifier = data.results?.[0]?.nullifier

    if (!nullifier) {
      return NextResponse.json({ error: 'No nullifier returned' }, { status: 400 })
    }

    // Check if this nullifier is enrolled for this API key
    const enrolled = await Nullifier.findOne({ nullifier, apiKey })
    if (!enrolled) {
      return NextResponse.json({ 
        authorized: false, 
        error: 'Face not recognized as authorized account holder' 
      }, { status: 403 })
    }

    // Update last verified timestamp
    await Nullifier.updateOne(
      { nullifier, apiKey },
      { lastVerifiedAt: new Date() }
    )

    return NextResponse.json({ authorized: true })
  } catch (error) {
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}