'use client'

import Link from 'next/link'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  userEmail: string
  onLogout: () => void
}

const navItems = [
  { id: 'overview', label: 'Overview', icon: '▦' },
  { id: 'apikey', label: 'API Key', icon: '⚿' },
  { id: 'integrate', label: 'Integration', icon: '⌥' },
  { id: 'docs', label: 'Docs', icon: '⊞' },
]

export { navItems }

export default function DashboardSidebar({ activeTab, setActiveTab, userEmail, onLogout }: SidebarProps) {
  return (
    <div style={{
      width: '220px',
      flexShrink: 0,
      background: '#FFFFFF',
      borderRight: '1px solid #E8E7E4',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Logo */}
      <div style={{ padding: '18px 20px', borderBottom: '1px solid #E8E7E4' }}>
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '28px', height: '28px',
              background: '#3B82F6',
              borderRadius: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <svg width="14" height="16" viewBox="0 0 16 18" fill="none">
                <path d="M8 0L0 3V9C0 13.4 3.4 17.5 8 18C12.6 17.5 16 13.4 16 9V3L8 0Z" fill="white" fillOpacity="0.9"/>
                <circle cx="8" cy="9" r="3" fill="#3B82F6"/>
              </svg>
            </div>
            <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.03em', color: '#1B1F3B' }}>
              FaceGate
            </span>
          </div>
        </Link>
      </div>

      {/* Nav items */}
      <nav style={{ padding: '12px 10px', flex: 1 }}>
        {navItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '6px',
              border: 'none',
              background: activeTab === item.id ? '#EFF6FF' : 'transparent',
              color: activeTab === item.id ? '#3B82F6' : '#71717A',
              fontSize: '14px',
              fontWeight: activeTab === item.id ? '600' : '400',
              cursor: 'pointer',
              textAlign: 'left',
              marginBottom: '2px',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ fontSize: '15px', opacity: 0.8 }}>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      {/* User footer */}
      <div style={{ padding: '16px', borderTop: '1px solid #E8E7E4' }}>
        <div style={{
          fontSize: '12px',
          color: '#71717A',
          marginBottom: '8px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {userEmail}
        </div>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            background: 'transparent',
            border: '1px solid #E8E7E4',
            color: '#71717A',
            padding: '6px 12px',
            borderRadius: '6px',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          Sign out
        </button>
      </div>
    </div>
  )
}