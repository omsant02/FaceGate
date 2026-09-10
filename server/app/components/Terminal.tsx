'use client'

import { useEffect, useState, useRef } from 'react'

const lines = [
  { text: '$ facegate verify --user om@netflix.com', color: '#6B7280' },
  { text: '✓ Face enrolled: detected', color: '#16A34A' },
  { text: '✓ Selfie Check: PASSED', color: '#16A34A' },
  { text: '✓ Access: GRANTED', color: '#16A34A' },
  { text: '', color: '' },
  { text: '$ facegate verify --user stranger@gmail.com', color: '#6B7280' },
  { text: '✗ Face not recognized', color: '#DC2626' },
  { text: '✗ Access: BLOCKED', color: '#DC2626' },
]

const delays = [0, 700, 1400, 2100, 2800, 3000, 3700, 4400]

export default function Terminal() {
  const [visibleLines, setVisibleLines] = useState(0)
  const bodyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const run = () => {
      setVisibleLines(0)
      lines.forEach((_, i) => {
        setTimeout(() => setVisibleLines(i + 1), delays[i])
      })
    }
    run()
    const interval = setInterval(run, 6000)
    return () => clearInterval(interval)
  }, [])

  // Auto scroll to bottom when new line appears
  useEffect(() => {
    if (bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight
    }
  }, [visibleLines])

  return (
    <div style={{
      width: '100%',
      background: '#18181B',
      border: '1px solid #27272A',
      borderRadius: '10px',
      overflow: 'hidden',
    }}>
      <div style={{
        padding: '9px 14px',
        borderBottom: '1px solid #27272A',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FF5F57' }}/>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#FFBD2E' }}/>
        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#28C840' }}/>
        <span style={{ marginLeft: '8px', fontSize: '11px', color: '#52525B', fontFamily: 'monospace' }}>
          facegate — live verification
        </span>
      </div>

      <div
        ref={bodyRef}
        style={{
          padding: '14px 16px',
          fontFamily: '"JetBrains Mono", "Fira Code", monospace',
          fontSize: '12px',
          lineHeight: '1.9',
          height: '172px',
          overflowY: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        {lines.slice(0, visibleLines).map((line, i) => (
          <div key={i} style={{ color: line.color || '#E4E4E7' }}>
            {line.text}
            {i === visibleLines - 1 && (
              <span style={{
                display: 'inline-block',
                width: '2px',
                height: '13px',
                background: '#E4E4E7',
                marginLeft: '1px',
                verticalAlign: 'middle',
                animation: 'blink 1s infinite',
              }}/>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @keyframes blink{0%,100%{opacity:1}50%{opacity:0}}
        div::-webkit-scrollbar{display:none}
      `}</style>
    </div>
  )
}