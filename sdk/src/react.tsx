import React, { useEffect, useState, useRef } from 'react'
import { IDKit, selfieCheckLegacy } from '@worldcoin/idkit-core'
import QRCode from 'qrcode'
import { FaceGate } from './index'

interface FaceGateWidgetProps {
  apiKey: string
  userId: string
  onSuccess: () => void
  onBlocked?: () => void
  onError?: (error: string) => void
  baseUrl?: string
}

export function FaceGateWidget({
  apiKey,
  userId,
  onSuccess,
  onBlocked,
  onError,
  baseUrl,
}: FaceGateWidgetProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null)
  const [status, setStatus] = useState<'loading' | 'ready' | 'scanning' | 'error'>('loading')
  const [isEnrolling, setIsEnrolling] = useState(false)
  const pollRef = useRef<any>(null)

  const gate = React.useMemo(
    () => new FaceGate({ apiKey, baseUrl }),
    [apiKey, baseUrl]
  )

  useEffect(() => {
    let cancelled = false

    const init = async () => {
      try {
        // Get rpContext from our server
        const enrollData = await gate.enroll(userId)

        if (!enrollData.rpContext || !enrollData.appId || !enrollData.action) {
          throw new Error('Invalid enroll response')
        }

        setIsEnrolling(!enrollData.enrolled)

        // Create IDKit request using idkit-core (no .wasm)
        const request = await IDKit.request({
          app_id: enrollData.appId as `app_${string}`,
          action: enrollData.action,
          rp_context: enrollData.rpContext,
          allow_legacy_proofs: true,
          environment: 'sandbox',
        }).preset(selfieCheckLegacy({ signal: userId }))

        // Generate QR from connectorURI
        const qr = await QRCode.toDataURL(request.connectorURI, {
          width: 280,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        })

        if (cancelled) return

        setQrDataUrl(qr)
        setStatus('ready')

        // Poll for completion in background
        pollRef.current = request.pollUntilCompletion()
        const result = await pollRef.current

        if (cancelled) return

        setStatus('scanning')

        // Verify the proof
        if (!enrollData.enrolled) {
          const confirmResult = await gate.confirm(userId, result)
          if (!confirmResult.success) throw new Error('Enrollment failed')
        } else {
          const verifyResult = await gate.verify(userId, result)
          if (!verifyResult.authorized) {
            onBlocked?.()
            return
          }
        }

        onSuccess()
      } catch (e: any) {
        if (cancelled) return
        if (e.message === 'Face not recognized') {
          onBlocked?.()
        } else {
          setStatus('error')
          onError?.(e.message || 'FaceGate error')
        }
      }
    }

    init()

    return () => {
      cancelled = true
    }
  }, [userId, apiKey])

  if (status === 'loading') {
    return React.createElement('div', {
      style: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
        padding: '32px',
      }
    },
      React.createElement('div', {
        style: {
          width: '280px',
          height: '280px',
          background: '#f5f5f5',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }
      },
        React.createElement('div', {
          style: { color: '#888', fontSize: '14px' }
        }, 'Loading...')
      )
    )
  }

  if (status === 'error') {
    return React.createElement('div', {
      style: { textAlign: 'center', color: '#f87171', fontSize: '14px', padding: '16px' }
    }, 'FaceGate initialization failed. Please try again.')
  }

  if (status === 'scanning') {
    return React.createElement('div', {
      style: { textAlign: 'center', color: '#888', fontSize: '14px', padding: '16px' }
    }, 'Verifying... Please wait.')
  }

  // QR ready
  return React.createElement('div', {
    style: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '16px',
    }
  },
    // QR container styled like World's QR
    React.createElement('div', {
      style: {
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        boxShadow: '0 2px 16px rgba(0,0,0,0.12)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '12px',
      }
    },
      // World-style header
      React.createElement('div', {
        style: {
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '4px',
        }
      },
        React.createElement('div', {
          style: {
            width: '24px',
            height: '24px',
            background: '#000',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }
        },
          React.createElement('div', {
            style: {
              width: '10px',
              height: '10px',
              background: '#fff',
              borderRadius: '50%',
            }
          })
        ),
        React.createElement('span', {
          style: { fontSize: '14px', fontWeight: '600', color: '#000' }
        }, 'Verify with World ID')
      ),
      // QR image
      qrDataUrl && React.createElement('img', {
        src: qrDataUrl,
        width: 240,
        height: 240,
        style: { borderRadius: '8px' },
        alt: 'World ID QR Code',
      }),
      // Instructions
      React.createElement('p', {
        style: {
          fontSize: '12px',
          color: '#888',
          textAlign: 'center',
          margin: '0',
          maxWidth: '200px',
        }
      }, 'Scan with your World App camera')
    )
  )
}