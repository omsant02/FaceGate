import { selfieCheckLegacy, proofOfHuman } from '@worldcoin/idkit-core'
import type { RpContext } from './types'

export interface FaceGateWidgetConfig {
  appId: string
  rpId: string
  rpContext: RpContext
  action: string
  userId: string
  onSuccess: () => void
  onError?: (code: string) => void
}

export function getFaceGatePreset(userId: string, useSelfieCheck: boolean = true) {
  if (useSelfieCheck) {
    return selfieCheckLegacy({ signal: userId })
  }
  return proofOfHuman({ signal: userId })
}

export function getFaceGateWidgetProps(config: FaceGateWidgetConfig) {
  return {
    app_id: config.appId as `app_${string}`,
    action: config.action,
    rp_context: config.rpContext,
    allow_legacy_proofs: true,
    preset: getFaceGatePreset(config.userId),
    onSuccess: config.onSuccess,
    onError: (error: { code: string }) => config.onError?.(error.code),
    environment: 'sandbox' as const,
  }
}