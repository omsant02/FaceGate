interface ApiKeyTabProps {
  apiKey: string | null
  appName: string
  setAppName: (name: string) => void
  loading: boolean
  copied: boolean
  onGenerate: () => void
  onCopy: () => void
  onRotate: () => void
}

export default function ApiKeyTab({
  apiKey, appName, setAppName, loading, copied, onGenerate, onCopy, onRotate
}: ApiKeyTabProps) {
  return (
    <div style={{ maxWidth: '580px' }}>
      <p style={{ fontSize: '14px', color: '#71717A', marginBottom: '28px' }}>
        Your API key authenticates requests to FaceGate. Keep it secret.
      </p>

      {!apiKey ? (
        <div style={{
          background: '#FFFFFF', border: '1px solid #E8E7E4',
          borderRadius: '10px', padding: '28px',
        }}>
          <div style={{ fontSize: '15px', fontWeight: '600', marginBottom: '16px', color: '#18181B' }}>
            Generate API Key
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block', fontSize: '13px', fontWeight: '500',
              marginBottom: '6px', color: '#71717A',
            }}>
              App name
            </label>
            <input
              type="text"
              placeholder="e.g. StreamVault, MyApp"
              value={appName}
              onChange={e => setAppName(e.target.value)}
              style={{
                width: '100%', padding: '10px 14px',
                borderRadius: '6px', border: '1px solid #E8E7E4',
                fontSize: '14px', outline: 'none',
                background: '#F8F8F7', color: '#18181B',
                fontFamily: 'Inter, sans-serif',
                boxSizing: 'border-box' as const,
              }}
            />
          </div>
          <button
            onClick={onGenerate}
            disabled={loading || !appName.trim()}
            style={{
              background: appName.trim() ? '#3B82F6' : '#E8E7E4',
              color: appName.trim() ? '#fff' : '#A1A1AA',
              border: 'none', padding: '10px 24px',
              borderRadius: '6px', fontSize: '14px',
              fontWeight: '600', cursor: appName.trim() ? 'pointer' : 'not-allowed',
            }}
          >
            {loading ? 'Generating...' : 'Generate API Key'}
          </button>
        </div>
      ) : (
        <div>
          <div style={{
            background: '#FFFFFF', border: '1px solid #E8E7E4',
            borderRadius: '10px', padding: '24px', marginBottom: '16px',
          }}>
            <div style={{ fontSize: '13px', color: '#A1A1AA', marginBottom: '8px' }}>Your API Key</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <code style={{
                flex: 1, fontFamily: 'monospace', fontSize: '13px',
                background: '#F8F8F7', padding: '10px 14px',
                borderRadius: '6px', border: '1px solid #E8E7E4',
                color: '#18181B', overflow: 'hidden',
                textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              }}>
                {apiKey}
              </code>
              <button
                onClick={onCopy}
                style={{
                  background: copied ? '#16A34A' : '#3B82F6',
                  color: '#fff', border: 'none',
                  padding: '10px 16px', borderRadius: '6px',
                  fontSize: '13px', fontWeight: '600',
                  cursor: 'pointer', flexShrink: 0,
                  transition: 'background 0.2s',
                }}
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div style={{
            background: '#FEF2F2', border: '1px solid rgba(220,38,38,0.2)',
            borderRadius: '6px', padding: '12px 16px',
            fontSize: '13px', color: '#DC2626',
          }}>
            Keep this key secret. Never expose it in frontend code.
          </div>

          <button
            onClick={onRotate}
            style={{
              background: 'transparent', color: '#DC2626',
              border: '1px solid rgba(220,38,38,0.3)',
              padding: '8px 16px', borderRadius: '6px',
              fontSize: '13px', fontWeight: '500',
              cursor: 'pointer', marginTop: '12px', width: '100%',
            }}
          >
            ⚠ Rotate API Key
          </button>
        </div>
      )}
    </div>
  )
}