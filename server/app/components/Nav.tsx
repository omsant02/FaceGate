'use client'

import Link from 'next/link'

export default function Nav() {
  return (
    <nav style={{
      padding: '0 48px',
      height: '58px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #E8E7E4',
      background: '#FFFFFF',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '30px', height: '30px',
          background: '#3B82F6',
          borderRadius: '7px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
            <path d="M8 0L0 3V9C0 13.4 3.4 17.5 8 18C12.6 17.5 16 13.4 16 9V3L8 0Z" fill="white" fillOpacity="0.9"/>
            <circle cx="8" cy="9" r="3" fill="#3B82F6"/>
          </svg>
        </div>
        <span style={{ fontWeight: '700', fontSize: '17px', letterSpacing: '-0.03em', color: '#1B1F3B' }}>
          FaceGate
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
        <a href="https://github.com/omsant02/FaceGate" target="_blank"
          style={{ fontSize: '14px', color: '#71717A', textDecoration: 'none', fontWeight: '500' }}>
          GitHub
        </a>
        <a href="https://npmjs.com/package/@facegate/sdk" target="_blank"
          style={{ fontSize: '14px', color: '#71717A', textDecoration: 'none', fontWeight: '500' }}>
          npm
        </a>
        <Link href="/dashboard">
          <button style={{
            background: '#3B82F6',
            color: '#fff',
            border: 'none',
            padding: '8px 20px',
            borderRadius: '7px',
            fontSize: '14px',
            fontWeight: '600',
            cursor: 'pointer',
          }}>
            Get API Key
          </button>
        </Link>
      </div>
    </nav>
  )
}