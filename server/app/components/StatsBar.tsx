export default function StatsBar() {
  const stats = [
    { num: '$9.1B', label: 'Lost annually to credential sharing' },
    { num: '3 lines', label: 'To integrate FaceGate in any app' },
    { num: '0 bytes', label: 'Of biometric data stored anywhere' },
  ]

  return (
    <div style={{
      borderTop: '1px solid #E8E7E4',
      background: '#FFFFFF',
      padding: '24px 48px',
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '32px',
      }}>
        {stats.map(s => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              fontSize: '26px',
              fontWeight: '700',
              letterSpacing: '-0.03em',
              color: '#1B1F3B',
              flexShrink: 0,
            }}>
              {s.num}
            </div>
            <div style={{ fontSize: '13px', color: '#71717A', lineHeight: '1.4' }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}