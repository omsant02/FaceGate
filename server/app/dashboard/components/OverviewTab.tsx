interface OverviewTabProps {
  apiKey: string | null
  setActiveTab: (tab: string) => void
}

export default function OverviewTab({ apiKey, setActiveTab }: OverviewTabProps) {
  const stats = [
    { label: 'API Status', value: apiKey ? 'Active' : 'No key yet', color: apiKey ? '#16A34A' : '#A1A1AA' },
    { label: 'Enrollments', value: '—', color: '#18181B' },
    { label: 'Blocked attempts', value: '—', color: '#18181B' },
  ]

  return (
    <div>
      <p style={{ fontSize: '14px', color: '#71717A', marginBottom: '28px' }}>
        Welcome back. Here's your FaceGate status.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
        {stats.map(stat => (
          <div key={stat.label} style={{
            background: '#FFFFFF',
            border: '1px solid #E8E7E4',
            borderRadius: '10px',
            padding: '20px',
          }}>
            <div style={{ fontSize: '13px', color: '#A1A1AA', marginBottom: '8px' }}>{stat.label}</div>
            <div style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.02em', color: stat.color }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {!apiKey && (
        <div style={{
          background: '#EFF6FF',
          border: '1px solid #BFDBFE',
          borderRadius: '10px',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: '#3B82F6', marginBottom: '4px' }}>
              Get your API key
            </div>
            <div style={{ fontSize: '13px', color: '#71717A' }}>
              Generate your key to start protecting subscriptions
            </div>
          </div>
          <button
            onClick={() => setActiveTab('apikey')}
            style={{
              background: '#3B82F6', color: '#fff',
              border: 'none', padding: '8px 20px',
              borderRadius: '6px', fontSize: '14px',
              fontWeight: '600', cursor: 'pointer',
            }}
          >
            Generate →
          </button>
        </div>
      )}
    </div>
  )
}