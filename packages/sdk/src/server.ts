import { signRequest } from '@worldcoin/idkit-core/signing'

export async function generateRpSignature(
  signingKey: string,
  action: string,
  ttl: number = 30
) {
  const { sig, nonce, createdAt, expiresAt } = signRequest({
    signingKeyHex: signingKey,
    action,
    ttl,
  })

  return {
    sig,
    nonce,
    created_at: createdAt,
    expires_at: expiresAt,
  }
}

export async function verifyProof(
  rpId: string,
  idkitResponse: unknown
): Promise<{ success: boolean; nullifier?: string; error?: string }> {
  const response = await fetch(
    `https://developer.world.org/api/v4/verify/${rpId}`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(idkitResponse),
    }
  )

  if (!response.ok) {
    return { success: false, error: 'Verification failed' }
  }

  const data = await response.json()
  const nullifier = data.results?.[0]?.nullifier

  return { success: true, nullifier }
}