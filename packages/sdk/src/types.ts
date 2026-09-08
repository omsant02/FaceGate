export interface FaceGateConfig {
  apiKey: string
  baseUrl?: string
}

export interface EnrollResult {
  success: boolean
  nullifier?: string
  error?: string
}

export interface VerifyResult {
  success: boolean
  isAuthorized: boolean
  nullifier?: string
  error?: string
}

export interface RpContext {
  rp_id: string
  nonce: string
  created_at: number
  expires_at: number
  signature: string
}

export interface FaceGateSession {
  userId: string
  nullifier: string
  enrolledAt: Date
  lastVerifiedAt: Date
  appId: string
}