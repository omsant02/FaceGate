'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import FaceGateModal from '../components/FaceGateModal'
import { enrollUser } from '@/lib/facegate'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showFaceGate, setShowFaceGate] = useState(false)
  const [enrollData, setEnrollData] = useState<any>(null)
  const [blocked, setBlocked] = useState(false)

  const handleSubmit = async () => {
    if (!email || !password) { setError('Please fill in all fields'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/signin', {
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

  const handleFaceVerified = () => {
    localStorage.setItem('demonetflix_user', JSON.stringify({ email, verified: true }))
    router.push('/')
  }

  const handleBlocked = () => {
    setShowFaceGate(false)
    setBlocked(true)
  }

  if (blocked) return (
    <div style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      textAlign: 'center', padding: '24px',
    }}>
      <div style={{ fontSize: '72px', marginBottom: '24px' }}>🚫</div>
      <h1 style={{ fontSize: '36px', fontWeight: '900', color: '#E50914', marginBottom: '12px' }}>
        Access Blocked
      </h1>
      <p style={{ color: '#B3B3B3', fontSize: '18px', marginBottom: '8px' }}>
        Face not recognized for <strong style={{ color: '#fff' }}>{email}</strong>
      </p>
      <p style={{ color: '#666', fontSize: '14px', marginBottom: '40px', maxWidth: '400px', lineHeight: '1.6' }}>
        This account is registered to a different person. FaceGate prevented unauthorized access.
      </p>
      <div style={{
        background: '#141414', border: '1px solid #E50914',
        borderRadius: '8px', padding: '16px 24px',
        fontSize: '13px', color: '#E50914', marginBottom: '32px',
      }}>
        🔐 Security alert: Unauthorized access attempt blocked by FaceGate
      </div>
      <button
        onClick={() => { setBlocked(false); setEmail(''); setPassword('') }}
        style={{
          background: '#E50914', color: '#fff', border: 'none',
          padding: '14px 32px', borderRadius: '4px',
          fontSize: '16px', fontWeight: '700', cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh', background: '#000',
      backgroundImage: 'radial-gradient(ellipse at top, #1a0000 0%, #000 60%)',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{
        position: 'absolute', top: '24px', left: '40px',
        fontSize: '24px', fontWeight: '900', color: '#E50914',
        letterSpacing: '-1px', fontStyle: 'italic',
      }}>
        Demo Netflix
      </div>

      <div style={{
        background: 'rgba(0,0,0,0.75)', border: '1px solid #333',
        borderRadius: '8px', padding: '60px 68px',
        width: '100%', maxWidth: '450px',
      }}>
        <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px' }}>Sign In</h1>
        <p style={{ color: '#B3B3B3', fontSize: '14px', marginBottom: '28px' }}>
          Welcome back. Face verification confirms it's really you.
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
            opacity: loading ? 0.7 : 1, marginBottom: '20px',
          }}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <p style={{ color: '#B3B3B3', fontSize: '14px', textAlign: 'center' }}>
          New to Demo Netflix?{' '}
          <Link href="/signup" style={{ color: '#fff', fontWeight: '700' }}>Sign up now</Link>
        </p>
      </div>

      {showFaceGate && enrollData && (
        <FaceGateModal
          email={email}
          isEnrolled={true}
          enrollData={enrollData}
          onSuccess={handleFaceVerified}
          onClose={handleBlocked}
        />
      )}
    </div>
  )
}