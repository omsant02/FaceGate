interface TopbarProps {
  activeTab: string
}

const labels: Record<string, string> = {
  overview: 'Overview',
  apikey: 'API Key',
  integrate: 'Integration',
  docs: 'Docs',
}

export default function DashboardTopbar({ activeTab }: TopbarProps) {
  return (
    <div style={{
      padding: '0 32px',
      height: '56px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderBottom: '1px solid #E8E7E4',
      background: '#FFFFFF',
      flexShrink: 0,
    }}>
      <h1 style={{
        fontSize: '16px',
        fontWeight: '600',
        letterSpacing: '-0.02em',
        color: '#18181B',
      }}>
        {labels[activeTab]}
      </h1>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        fontSize: '13px',
        color: '#16A34A',
        fontWeight: '500',
      }}>
        <span style={{
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: '#16A34A',
          display: 'inline-block',
        }}/>
        Active
      </div>
    </div>
  )
}