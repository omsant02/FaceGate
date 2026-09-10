import { NextResponse } from "next/server";
import { signRequest } from "@worldcoin/idkit-core/signing";
import connectDB from "@/lib/mongodb";
import { ApiKey, Nullifier } from "@/lib/models";

export async function POST(request: Request) {
  try {
    const { apiKey, userId } = await request.json();

    if (!apiKey || !userId) {
      return NextResponse.json(
        { error: "Missing apiKey or userId" },
        { status: 400 },
      );
    }

    await connectDB();

    // Look up the API key
    const apiKeyDoc = await ApiKey.findOne({ key: apiKey });
    if (!apiKeyDoc) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
    }

    // Check if user is already enrolled
    const existing = await Nullifier.findOne({ userId, apiKey });
    if (existing) {
      const { sig, nonce, createdAt, expiresAt } = signRequest({
        signingKeyHex: process.env.WORLD_SIGNING_KEY!,
        action: apiKeyDoc.action,
        ttl: 30,
      });

      return NextResponse.json({
        enrolled: true,
        rpContext: {
          rp_id: process.env.WORLD_RP_ID!,
          nonce,
          created_at: createdAt,
          expires_at: expiresAt,
          signature: sig,
        },
        appId: process.env.WORLD_APP_ID!,
        action: apiKeyDoc.action,
      });
    }

    // Generate RP signature for World ID Selfie Check
    const { sig, nonce, createdAt, expiresAt } = signRequest({
      signingKeyHex: process.env.WORLD_SIGNING_KEY!,
      action: apiKeyDoc.action,
      ttl: 30,
    });

    return NextResponse.json({
      enrolled: false,
      rpContext: {
        rp_id: process.env.WORLD_RP_ID!,
        nonce,
        created_at: createdAt,
        expires_at: expiresAt,
        signature: sig,
      },
      appId: process.env.WORLD_APP_ID!,
      action: apiKeyDoc.action,
    });
  } catch (error) {
    return NextResponse.json({ error: "Enroll failed" }, { status: 500 });
  }
}
