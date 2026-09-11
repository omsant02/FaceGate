'use client'

import Link from 'next/link'

interface NavbarProps {
  email?: string
  verified?: boolean
}

export default function Navbar({ email, verified }: NavbarProps) {
  const handleSignOut = () => {
    localStorage.removeItem('demonetflix_user')
    window.location.href = '/'
  }

  return (
    <nav style={{
      position: 'fixed',
      top: 0, left: 0, right: 0,
      zIndex: 100,
      padding: '0 60px',
      height: '68px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)',
    }}>
      {/* Logo */}
      <Link href="/">
        <div style={{
          fontSize: '28px', fontWeight: '900',
          color: '#E50914', letterSpacing: '-1px', fontStyle: 'italic',
        }}>
          Demo Netflix
        </div>
      </Link>

      {/* Center nav — only when logged in */}
      {email && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <span style={{ fontSize: '14px', color: '#B3B3B3', cursor: 'pointer' }}>Home</span>
          <span style={{ fontSize: '14px', color: '#B3B3B3', cursor: 'pointer' }}>TV Shows</span>
          <span style={{ fontSize: '14px', color: '#B3B3B3', cursor: 'pointer' }}>Movies</span>
        </div>
      )}

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {email ? (
          <>
            {verified && (
              <div style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                background: 'rgba(70,211,105,0.15)',
                border: '1px solid rgba(70,211,105,0.4)',
                borderRadius: '999px', padding: '4px 12px',
                fontSize: '12px', color: '#46D369', fontWeight: '600',
              }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#46D369', display: 'inline-block' }}/>
                Face Verified
              </div>
            )}
            <button
              onClick={handleSignOut}
              style={{
                background: 'rgba(109,109,110,0.7)',
                color: '#fff', border: 'none',
                padding: '6px 16px', borderRadius: '4px',
                fontSize: '14px', fontWeight: '600', cursor: 'pointer',
              }}
            >
              Sign Out
            </button>
          </>
        ) : (
          <Link href="/login">
            <button style={{
              background: '#E50914', color: '#fff', border: 'none',
              padding: '8px 20px', borderRadius: '4px',
              fontSize: '14px', fontWeight: '600', cursor: 'pointer',
            }}>
              Sign In
            </button>
          </Link>
        )}
      </div>
    </nav>
  )
}