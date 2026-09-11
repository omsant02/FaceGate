'use client'

import { IDKitRequestWidget, selfieCheckLegacy } from '@worldcoin/idkit'
import { confirmEnrollment, verifyUser } from '@/lib/facegate'

interface FaceGateModalProps {
  email: string
  isEnrolled: boolean
  enrollData: any
  onSuccess: () => void
  onClose: () => void
}

export default function FaceGateModal({ email, isEnrolled, enrollData, onSuccess, onClose }: FaceGateModalProps) {

  const handleVerify = async (proof: any) => {
    if (!isEnrolled) {
      const result = await confirmEnrollment(email, proof)
      if (!result.success) throw new Error('Enrollment failed')
    } else {
      const result = await verifyUser(email, proof)
      if (!result.authorized) throw new Error('Face not recognized')
    }
  }

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(0,0,0,0.85)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      backdropFilter: 'blur(4px)',
    }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#141414',
          border: '1px solid #333',
          borderRadius: '8px',
          padding: '40px',
          maxWidth: '420px',
          width: '100%',
          textAlign: 'center',
        }}
      >
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            width: '48px', height: '48px',
            background: '#3B82F6',
            borderRadius: '10px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
          }}>
            <svg width="22" height="24" viewBox="0 0 16 18" fill="none">
              <path d="M8 0L0 3V9C0 13.4 3.4 17.5 8 18C12.6 17.5 16 13.4 16 9V3L8 0Z" fill="white"/>
              <circle cx="8" cy="9" r="3" fill="#3B82F6"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '8px' }}>
            {isEnrolled ? 'Verify Your Identity' : 'Enroll Your Face'}
          </h2>
          <p style={{ fontSize: '14px', color: '#B3B3B3', lineHeight: '1.5' }}>
            {isEnrolled
              ? "Confirm it's really you to access content"
              : 'One-time face enrollment to protect your account'
            }
          </p>
          <div style={{
            fontSize: '12px', color: '#46D369', marginTop: '8px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
          }}>
            <span>🔒</span> Powered by FaceGate · World ID Selfie Check
          </div>
        </div>

        {enrollData?.appId ? (
          <IDKitRequestWidget
            open={true}
            onOpenChange={() => {}}
            app_id={enrollData.appId}
            action={enrollData.action}
            rp_context={enrollData.rpContext}
            allow_legacy_proofs={true}
            preset={selfieCheckLegacy({})}
            handleVerify={handleVerify}
            onSuccess={onSuccess}
            environment="sandbox"
          />
        ) : (
          <div style={{ color: '#B3B3B3', fontSize: '14px' }}>Initializing...</div>
        )}

        <button
          onClick={onClose}
          style={{
            background: 'transparent', border: 'none',
            color: '#B3B3B3', fontSize: '13px',
            marginTop: '16px', cursor: 'pointer',
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}