'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Navbar from './components/Navbar'
import MovieGrid from './components/MovieGrid'

export default function Home() {
  const router = useRouter()
  const [user, setUser] = useState<{ email: string; verified: boolean } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('demonetflix_user')
    if (stored) {
      setUser(JSON.parse(stored))
    }
    setLoading(false)
  }, [])

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ color: '#E50914', fontSize: '28px', fontWeight: '900', fontStyle: 'italic' }}>Demo Netflix</div>
    </div>
  )

  if (!user) return (
    <div style={{ minHeight: '100vh', background: '#000' }}>
      <Navbar />
      <div style={{
        position: 'relative', height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'linear-gradient(135deg, #1a0000 0%, #0d0d0d 50%, #000814 100%)',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.8) 100%)',
        }}/>
        <div style={{ position: 'relative', textAlign: 'center', maxWidth: '680px', padding: '0 24px' }}>
          <div style={{
            fontSize: '13px', fontWeight: '600', color: '#E50914',
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px',
          }}>
            Powered by FaceGate
          </div>
          <h1 style={{
            fontSize: '64px', fontWeight: '900', lineHeight: '1.0',
            letterSpacing: '-2px', marginBottom: '20px',
          }}>
            Unlimited movies,<br />one face.
          </h1>
          <p style={{
            fontSize: '20px', color: '#B3B3B3', lineHeight: '1.5', marginBottom: '40px',
          }}>
            Watch anywhere. Only you can access your account.<br />
            Face verification powered by World ID.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <Link href="/signup">
              <button style={{
                background: '#E50914', color: '#fff', border: 'none',
                padding: '16px 36px', borderRadius: '4px',
                fontSize: '18px', fontWeight: '700', cursor: 'pointer',
              }}>
                Get Started
              </button>
            </Link>
            <Link href="/login">
              <button style={{
                background: 'rgba(109,109,110,0.7)', color: '#fff', border: 'none',
                padding: '16px 36px', borderRadius: '4px',
                fontSize: '18px', fontWeight: '700', cursor: 'pointer',
              }}>
                Sign In
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: '#000', paddingBottom: '60px' }}>
      <Navbar email={user.email} verified={user.verified} />

      <div style={{
        position: 'relative', height: '70vh',
        background: 'linear-gradient(135deg, #1a0a00 0%, #0a0a1a 100%)',
        display: 'flex', alignItems: 'flex-end',
        paddingBottom: '60px', paddingLeft: '60px',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to right, rgba(0,0,0,0.8) 40%, transparent 100%), linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 50%)',
        }}/>

        <div style={{ position: 'relative', maxWidth: '500px' }}>
          {user.verified && (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: 'rgba(70,211,105,0.15)', border: '1px solid rgba(70,211,105,0.4)',
              borderRadius: '4px', padding: '6px 12px', fontSize: '12px',
              color: '#46D369', fontWeight: '600', marginBottom: '16px', letterSpacing: '0.05em',
            }}>
              ✓ IDENTITY VERIFIED
            </div>
          )}

          <h1 style={{
            fontSize: '56px', fontWeight: '900', lineHeight: '1.05',
            letterSpacing: '-2px', marginBottom: '16px',
          }}>
            Stranger Things
          </h1>
          <p style={{
            fontSize: '16px', color: '#B3B3B3', lineHeight: '1.5', marginBottom: '24px',
          }}>
            When a young boy disappears, his mother, a police chief and his friends must confront terrifying supernatural forces.
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button style={{
              background: '#fff', color: '#000', border: 'none',
              padding: '12px 28px', borderRadius: '4px',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: '8px',
            }}>
              ▶ Play
            </button>
            <button style={{
              background: 'rgba(109,109,110,0.7)', color: '#fff', border: 'none',
              padding: '12px 28px', borderRadius: '4px',
              fontSize: '16px', fontWeight: '700', cursor: 'pointer',
            }}>
              ⓘ More Info
            </button>
          </div>
        </div>
      </div>

      <MovieGrid verified={user.verified} onUnlockClick={() => router.push('/login')} />
    </div>
  )
}