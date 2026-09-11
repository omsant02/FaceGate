'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FaceGateModal from '../components/FaceGateModal'
import { enrollUser } from '@/lib/facegate'

export default function SignUp() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showFaceGate, setShowFaceGate] = useState(false)
  const [enrollData, setEnrollData] = useState<any>(null)

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      const enroll = await enrollUser(email)
      setEnrollData(enroll)
      setShowFaceGate(true)
    } catch (e) {
      setError('Something went wrong')
    }
    setLoading(false)
  }

  const handleFaceEnrolled = () => {
    localStorage.setItem('demonetflix_user', JSON.stringify({ email, verified: true }))
    router.push('/')
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#000',
      backgroundImage: 'radial-gradient(ellipse at top, #1a0000 0%, #000 60%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', top: '24px', left: '40px',
        fontSize: '24px', fontWeight: '900', color: '#E50914',
        letterSpacing: '-1px', fontStyle: 'italic',
      }}>
        Demo Netflix
      </div>

      <div style={{
        background: 'rgba(0,0,0,0.75)',
        border: '1px solid #333',
        borderRadius: '8px',
        padding: '60px 68px',
        width: '100%',
        maxWidth: '450px',
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Sign Up</h1>
        <p style={{ color: '#B3B3B3', fontSize: '14px', marginBottom: '28px' }}>
          Create your account — face verification sets up automatically.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <input type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSubmit()} />
        </div>

        {error && (
          <div style={{
            background: 'rgba(229,9,20,0.1)', border: '1px solid rgba(229,9,20,0.3)',
            borderRadius: '4px', padding: '12px', fontSize: '14px',
            color: '#E50914', marginBottom: '16px',
          }}>
            {error}
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', background: '#E50914', color: '#fff',
            border: 'none', padding: '16px', borderRadius: '4px',
            fontSize: '16px', fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.7 : 1, marginBottom: '16px',
          }}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <div style={{
          background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: '4px', padding: '12px', fontSize: '13px',
          color: '#93C5FD', marginBottom: '20px', lineHeight: '1.5',
        }}>
          🔒 Face verification via World ID Selfie Check follows automatically.
        </div>

        <p style={{ color: '#B3B3B3', fontSize: '14px', textAlign: 'center' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#fff', fontWeight: '700' }}>Sign in</Link>
        </p>
      </div>

      {showFaceGate && enrollData && (
        <FaceGateModal
          email={email}
          isEnrolled={false}
          enrollData={enrollData}
          onSuccess={handleFaceEnrolled}
          onClose={() => {}}
        />
      )}
    </div>
  )
}