export interface FaceGateConfig {
  apiKey: string
  baseUrl?: string
}

export interface EnrollResponse {
  enrolled: boolean
  rpContext?: {
    rp_id: string
    nonce: string
    created_at: number
    expires_at: number
    signature: string
  }
  appId?: string
  action?: string
  message?: string
  error?: string
}

export interface VerifyResponse {
  authorized: boolean
  error?: string
}

export interface CheckResponse {
  enrolled: boolean
  enrolledAt?: string
  lastVerifiedAt?: string
  error?: string
}

export class FaceGate {
  private apiKey: string
  private baseUrl: string

  constructor(config: FaceGateConfig) {
    this.apiKey = config.apiKey
    this.baseUrl = config.baseUrl ?? 'https://facegate.vercel.app'
  }

  async enroll(userId: string): Promise<EnrollResponse> {
    const res = await fetch(`${this.baseUrl}/api/enroll`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: this.apiKey, userId }),
    })
    return res.json()
  }

  async confirm(userId: string, idkitResponse: unknown): Promise<{ success: boolean; error?: string }> {
    const res = await fetch(`${this.baseUrl}/api/enroll/confirm`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: this.apiKey, userId, idkitResponse }),
    })
    return res.json()
  }

  async verify(userId: string, idkitResponse: unknown): Promise<VerifyResponse> {
    const res = await fetch(`${this.baseUrl}/api/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: this.apiKey, userId, idkitResponse }),
    })
    return res.json()
  }

  async check(userId: string): Promise<CheckResponse> {
    const res = await fetch(`${this.baseUrl}/api/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey: this.apiKey, userId }),
    })
    return res.json()
  }
}