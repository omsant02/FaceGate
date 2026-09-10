'use client'

import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import DashboardSidebar from './components/DashboardSidebar'
import DashboardTopbar from './components/DashboardTopbar'
import OverviewTab from './components/OverviewTab'
import ApiKeyTab from './components/ApiKeyTab'
import IntegrationTab from './components/IntegrationTab'
import DocsTab from './components/DocsTab'

export default function Dashboard() {
  const { ready, authenticated, user, login, logout, getAccessToken } = usePrivy()
  const [apiKey, setApiKey] = useState<string | null>(null)
  const [appName, setAppName] = useState('')
  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    if (authenticated) fetchApiKey()
  }, [authenticated])

  const fetchApiKey = async () => {
    try {
      const token = await getAccessToken()
      if (!token) return
      const res = await fetch('/api/keys', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.apiKey) setApiKey(data.apiKey)
    } catch (e) {}
  }

  const generateKey = async () => {
    if (!appName.trim()) return
    setLoading(true)
    try {
      const token = await getAccessToken()
      const res = await fetch('/api/keys', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName }),
      })
      const data = await res.json()
      if (data.apiKey) setApiKey(data.apiKey)
    } catch (e) {}
    setLoading(false)
  }

  const copyKey = () => {
    if (!apiKey) return
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const rotateKey = async () => {
    if (!confirm('Are you sure? Your old API key will stop working immediately.')) return
    setLoading(true)
    try {
      const token = await getAccessToken()
      const res = await fetch('/api/keys', {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ appName: 'default' }),
      })
      const data = await res.json()
      if (data.apiKey) setApiKey(data.apiKey)
    } catch (e) {}
    setLoading(false)
  }

  const userEmail = user?.email?.address || user?.google?.email || 'Developer'

  if (!ready) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8F8F7' }}>
      <div style={{ fontSize: '14px', color: '#A1A1AA' }}>Loading...</div>
    </div>
  )

  if (!authenticated) return (
    <div style={{ minHeight: '100vh', background: '#F8F8F7', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        padding: '0 32px', height: '56px',
        display: 'flex', alignItems: 'center',
        borderBottom: '1px solid #E8E7E4', background: '#FFFFFF',
      }}>
        <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', background: '#3B82F6', borderRadius: '7px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="14" height="16" viewBox="0 0 16 18" fill="none">
              <path d="M8 0L0 3V9C0 13.4 3.4 17.5 8 18C12.6 17.5 16 13.4 16 9V3L8 0Z" fill="white" fillOpacity="0.9"/>
              <circle cx="8" cy="9" r="3" fill="#3B82F6"/>
            </svg>
          </div>
          <span style={{ fontWeight: 700, fontSize: '16px', letterSpacing: '-0.03em', color: '#1B1F3B' }}>FaceGate</span>
        </Link>
      </nav>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          background: '#FFFFFF', border: '1px solid #E8E7E4',
          borderRadius: '14px', padding: '48px',
          width: '100%', maxWidth: '400px', textAlign: 'center',
        }}>
          <div style={{
            width: '48px', height: '48px', background: '#3B82F6',
            borderRadius: '12px', display: 'flex', alignItems: 'center',
            justifyContent: 'center', margin: '0 auto 24px',
          }}>
            <svg width="22" height="24" viewBox="0 0 16 18" fill="none">
              <path d="M8 0L0 3V9C0 13.4 3.4 17.5 8 18C12.6 17.5 16 13.4 16 9V3L8 0Z" fill="white"/>
              <circle cx="8" cy="9" r="3" fill="#3B82F6"/>
            </svg>
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: '700', letterSpacing: '-0.03em', marginBottom: '8px', color: '#18181B' }}>
            Welcome to FaceGate
          </h2>
          <p style={{ fontSize: '14px', color: '#71717A', marginBottom: '32px', lineHeight: '1.6' }}>
            Sign in to get your API key and start protecting your subscription from credential sharing.
          </p>
          <button
            onClick={login}
            style={{
              width: '100%', background: '#3B82F6', color: '#fff',
              border: 'none', padding: '12px', borderRadius: '8px',
              fontSize: '15px', fontWeight: '600', cursor: 'pointer',
            }}
          >
            Sign in with Google
          </button>
          <p style={{ fontSize: '12px', color: '#A1A1AA', marginTop: '16px' }}>
            Free during ETHOnline 2026
          </p>
        </div>
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: '#F8F8F7' }}>
      <DashboardSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        userEmail={userEmail}
        onLogout={logout}
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <DashboardTopbar activeTab={activeTab} />

        <div style={{ padding: '32px', flex: 1 }}>
          {activeTab === 'overview' && (
            <OverviewTab apiKey={apiKey} setActiveTab={setActiveTab} getAccessToken={getAccessToken} />
          )}
          {activeTab === 'apikey' && (
            <ApiKeyTab
              apiKey={apiKey}
              appName={appName}
              setAppName={setAppName}
              loading={loading}
              copied={copied}
              onGenerate={generateKey}
              onCopy={copyKey}
              onRotate={rotateKey}
            />
          )}
          {activeTab === 'integrate' && (
            <IntegrationTab apiKey={apiKey} />
          )}
          {activeTab === 'docs' && (
            <DocsTab />
          )}
        </div>
      </div>
    </div>
  )
}