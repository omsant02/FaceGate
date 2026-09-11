// ============================================
// FaceGate Integration — plug in after auth
// ============================================
// This is the ONLY file you need to touch
// to add face verification to your platform.
//
// After signup  → call enrollUser()
// After login   → call verifyUser()
// ============================================

import { FaceGate } from '@facegate/sdk'

const gate = new FaceGate({
  apiKey: process.env.NEXT_PUBLIC_FACEGATE_API_KEY!,
})

// Call after signup — starts face enrollment
export const enrollUser = (userId: string) =>
  gate.enroll(userId)

// Call after first face scan on signup — confirms enrollment
export const confirmEnrollment = (userId: string, proof: unknown) =>
  gate.confirm(userId, proof)

// Call after login — verifies same face returns
export const verifyUser = (userId: string, proof: unknown) =>
  gate.verify(userId, proof)

// Call to check if user is already enrolled
export const checkUser = (userId: string) =>
  gate.check(userId)