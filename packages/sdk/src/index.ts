// Server-side exports (use in your backend/API routes)
export { generateRpSignature, verifyProof } from './server'

// Client-side exports (use in your frontend)
export { getFaceGatePreset, getFaceGateWidgetProps } from './client'
export type { FaceGateWidgetConfig } from './client'

// Types
export type { RpContext, EnrollResult, VerifyResult, FaceGateSession } from './types'