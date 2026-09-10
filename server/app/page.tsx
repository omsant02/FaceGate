'use client'

import Link from 'next/link'
import Nav from './components/Nav'
import FaceScanAnimation from './components/FaceScanAnimation'
import CodeBlock from './components/CodeBlock'
import StatsBar from './components/StatsBar'
import Terminal from './components/Terminal'

export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F8F8F7',
      color: '#18181B',
      fontFamily: 'Inter, system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <Nav />

      <main style={{
        flex: 1,
        maxWidth: '1200px',
        width: '100%',
        margin: '0 auto',
        padding: '56px 48px 40px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '64px',
        alignItems: 'center',
      }}>
        {/* Left */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '7px',
            background: '#DCFCE7',
            color: '#16A34A',
            padding: '4px 12px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '24px',
          }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#16A34A', display: 'inline-block' }}/>
            ETHOnline 2026 · World Selfie Check
          </div>

          <h1 style={{
            fontSize: '50px',
            fontWeight: '700',
            letterSpacing: '-0.04em',
            lineHeight: '1.04',
            color: '#18181B',
            marginBottom: '18px',
          }}>
            One account.<br />One face.<br />No sharing.
          </h1>

          <p style={{
            fontSize: '16px',
            color: '#71717A',
            lineHeight: '1.65',
            marginBottom: '28px',
            maxWidth: '400px',
          }}>
            Stop credential sharing with privacy-preserving face verification. Zero biometric data stored. Drop into any subscription service in minutes.
          </p>

          <div style={{ marginBottom: '28px' }}>
            <CodeBlock />
          </div>

          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
            <Link href="/dashboard">
              <button style={{
                background: '#3B82F6',
                color: '#fff',
                border: 'none',
                padding: '11px 26px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}>
                Get API Key →
              </button>
            </Link>
            <a href="https://github.com/omsant02/FaceGate" target="_blank">
              <button style={{
                background: 'transparent',
                color: '#18181B',
                border: '1px solid #D4D3CF',
                padding: '11px 26px',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
              }}>
                View GitHub
              </button>
            </a>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {['🔒 Zero biometrics stored', '⚡ World ID Selfie Check', '🛡️ Nullifier-based'].map(t => (
              <span key={t} style={{ fontSize: '12px', color: '#A1A1AA', fontWeight: '500' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Right — animation top, terminal grows down */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
        }}>
          <FaceScanAnimation />
          <div style={{ width: '340px' }}>
            <Terminal />
          </div>
        </div>
      </main>

      <StatsBar />
    </div>
  )
}