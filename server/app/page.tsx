'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const terminalLines = [
  { text: '$ facegate verify --user om@netflix.com', color: '#6B7280', delay: 0 },
  { text: '✓ Face enrolled: detected', color: '#4ADE80', delay: 600 },
  { text: '✓ Selfie Check: PASSED', color: '#4ADE80', delay: 1200 },
  { text: '✓ Access: GRANTED', color: '#4ADE80', delay: 1800 },
  { text: '', color: '', delay: 2400 },
  { text: '$ facegate verify --user stranger@gmail.com', color: '#6B7280', delay: 2600 },
  { text: '✗ Face not recognized', color: '#F87171', delay: 3200 },
  { text: '✗ Access: BLOCKED', color: '#F87171', delay: 3800 },
]

function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      {/* Shield mark */}
      <div style={{
        width: '32px',
        height: '32px',
        background: 'var(--accent)',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}>
        <svg width="16" height="18" viewBox="0 0 16 18" fill="none">
          <path d="M8 0L0 3V9C0 13.4 3.4 17.5 8 18C12.6 17.5 16 13.4 16 9V3L8 0Z" fill="white" fillOpacity="0.9"/>
          <circle cx="8" cy="9" r="3" fill="var(--accent)" />
        </svg>
      </div>
      <span style={{ fontWeight: 700, fontSize: '18px', letterSpacing: '-0.03em', color: 'var(--accent)' }}>
        FaceGate
      </span>
    </div>
  )
}

export default function Home() {
  const [visibleLines, setVisibleLines] = useState(0)

  useEffect(() => {
    terminalLines.forEach((line, i) => {
      setTimeout(() => setVisibleLines(i + 1), line.delay)
    })
  }, [])

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Nav */}
      <nav style={{
        padding: '0 32px',
        height: '56px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        background: 'var(--surface)',
        position: 'sticky',
        top: 0,
        zIndex: 10,
      }}>
        <Logo />
        <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
          <a href="https://github.com/omsant02/FaceGate" target="_blank"
            style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            GitHub
          </a>
          <a href="https://npmjs.com/package/@facegate/sdk" target="_blank"
            style={{ fontSize: '14px', color: 'var(--text-secondary)', fontWeight: 500 }}>
            npm
          </a>
          <Link href="/dashboard">
            <button style={{
              background: 'var(--accent)',
              color: '#fff',
              border: 'none',
              padding: '7px 18px',
              borderRadius: 'var(--radius-sm)',
              fontSize: '14px',
              fontWeight: '600',
              letterSpacing: '-0.01em',
            }}>
              Get API Key
            </button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main style={{
        flex: 1,
        maxWidth: '960px',
        margin: '0 auto',
        padding: '48px 32px 40px',
        width: '100%',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '48px',
        alignItems: 'start',
      }}>

        {/* Left */}
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            background: 'var(--success-light)',
            color: 'var(--success)',
            padding: '3px 10px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: '600',
            marginBottom: '20px',
            letterSpacing: '0.01em',
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--success)', display: 'inline-block' }} />
            ETHOnline 2026 · World Selfie Check
          </div>

          <h1 style={{
            fontSize: '44px',
            fontWeight: '700',
            letterSpacing: '-0.04em',
            lineHeight: '1.05',
            color: 'var(--text-primary)',
            marginBottom: '16px',
          }}>
            One account.<br />One face.<br />No sharing.
          </h1>

          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            lineHeight: '1.65',
            marginBottom: '24px',
            maxWidth: '380px',
          }}>
            Stop credential sharing with privacy-preserving face verification. 
            Zero biometric data stored. One API key to protect any subscription.
          </p>

          {/* Code snippet */}
          <div style={{
            background: 'var(--code-bg)',
            borderRadius: 'var(--radius-md)',
            padding: '16px 20px',
            marginBottom: '24px',
            fontFamily: 'var(--font-mono)',
            fontSize: '13px',
            lineHeight: '1.9',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{ color: '#4B5563', marginBottom: '2px', fontSize: '12px' }}>// protect your subscription in 3 lines</div>
            <div>
              <span style={{ color: '#93C5FD' }}>const</span>
              <span style={{ color: '#E5E7EB' }}> gate = </span>
              <span style={{ color: '#4ADE80' }}>new </span>
              <span style={{ color: '#FCD34D' }}>FaceGate</span>
              <span style={{ color: '#E5E7EB' }}>{'({'} </span>
              <span style={{ color: '#93C5FD' }}>apiKey</span>
              <span style={{ color: '#E5E7EB' }}>: </span>
              <span style={{ color: '#F87171' }}>'fg_live_xxx'</span>
              <span style={{ color: '#E5E7EB' }}>{' })'}  </span>
            </div>
            <div>
              <span style={{ color: '#FCD34D' }}>await</span>
              <span style={{ color: '#E5E7EB' }}> gate.</span>
              <span style={{ color: '#4ADE80' }}>enroll</span>
              <span style={{ color: '#E5E7EB' }}>(userId)   </span>
              <span style={{ color: '#4B5563' }}>// first time</span>
            </div>
            <div>
              <span style={{ color: '#FCD34D' }}>await</span>
              <span style={{ color: '#E5E7EB' }}> gate.</span>
              <span style={{ color: '#4ADE80' }}>verify</span>
              <span style={{ color: '#E5E7EB' }}>(userId)   </span>
              <span style={{ color: '#4B5563' }}>// every login</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <Link href="/dashboard">
              <button style={{
                background: 'var(--accent)',
                color: '#fff',
                border: 'none',
                padding: '10px 24px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: '600',
                letterSpacing: '-0.01em',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}>
                Get API Key →
              </button>
            </Link>
            <a href="https://github.com/omsant02/FaceGate" target="_blank">
              <button style={{
                background: 'transparent',
                color: 'var(--text-primary)',
                border: '1px solid var(--border-strong)',
                padding: '10px 24px',
                borderRadius: 'var(--radius-sm)',
                fontSize: '14px',
                fontWeight: '500',
              }}>
                View Docs
              </button>
            </a>
          </div>

          {/* Trust signals */}
          <div style={{
            marginTop: '28px',
            display: 'flex',
            gap: '20px',
            flexWrap: 'wrap',
          }}>
            {[
              '🔒 Zero biometric storage',
              '⚡ World ID Selfie Check',
              '🛡️ Nullifier-based identity',
            ].map(item => (
              <span key={item} style={{ fontSize: '13px', color: 'var(--text-muted)', fontWeight: 500 }}>
                {item}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Terminal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{
            background: 'var(--code-bg)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 1px 3px rgba(0,0,0,0.08)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            {/* Terminal titlebar */}
            <div style={{
              padding: '10px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.06)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255,255,255,0.03)',
            }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28C840' }} />
              <span style={{
                marginLeft: '10px',
                fontSize: '12px',
                color: 'rgba(255,255,255,0.25)',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.02em',
              }}>
                facegate — live verification
              </span>
            </div>

            {/* Terminal body */}
            <div style={{
              padding: '20px',
              fontFamily: 'var(--font-mono)',
              fontSize: '13px',
              lineHeight: '1.9',
              minHeight: '240px',
            }}>
              {terminalLines.slice(0, visibleLines).map((line, i) => (
                <div key={i} style={{ color: line.color || '#E5E7EB' }}>
                  {line.text}
                  {i === visibleLines - 1 && (
                    <span style={{
                      display: 'inline-block',
                      width: '2px',
                      height: '14px',
                      background: '#fff',
                      marginLeft: '1px',
                      verticalAlign: 'middle',
                      animation: 'blink 1s infinite',
                    }} />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* How it works — mini cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {[
              { icon: '👤', title: 'Enroll', desc: 'User scans face via World App' },
              { icon: '✓', title: 'Verify', desc: 'Same face returns every login' },
              { icon: '✗', title: 'Block', desc: 'Different face gets rejected' },
              { icon: '🔒', title: 'Privacy', desc: 'Zero biometrics stored ever' },
            ].map(card => (
              <div key={card.title} style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)',
                padding: '12px 14px',
              }}>
                <div style={{ fontSize: '16px', marginBottom: '4px' }}>{card.icon}</div>
                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '2px' }}>{card.title}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{card.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Stats bar */}
      <div style={{
        borderTop: '1px solid var(--border)',
        background: 'var(--surface)',
        padding: '20px 32px',
      }}>
        <div style={{
          maxWidth: '960px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
        }}>
          {[
            { number: '$9.1B', label: 'Lost annually to credential sharing' },
            { number: '3 lines', label: 'To integrate FaceGate in any app' },
            { number: '0 bytes', label: 'Of biometric data stored anywhere' },
          ].map((stat) => (
            <div key={stat.label} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{
                fontSize: '26px',
                fontWeight: '700',
                letterSpacing: '-0.03em',
                color: 'var(--accent)',
                flexShrink: 0,
              }}>
                {stat.number}
              </div>
              <div style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  )
}