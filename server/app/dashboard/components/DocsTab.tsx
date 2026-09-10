export default function DocsTab() {
  const docs = [
    {
      title: 'GitHub Repository',
      desc: 'Source code, issues, and contributions',
      href: 'https://github.com/omsant02/FaceGate',
    },
    {
      title: 'npm Package',
      desc: '@facegate/sdk — install and integrate',
      href: 'https://npmjs.com/package/@facegate/sdk',
    },
    {
      title: 'World ID Selfie Check',
      desc: 'How the underlying verification works',
      href: 'https://docs.world.org/world-id/credentials/11',
    },
  ]

  return (
    <div style={{ maxWidth: '580px' }}>
      <p style={{ fontSize: '14px', color: '#71717A', marginBottom: '28px' }}>
        Everything you need to integrate FaceGate.
      </p>
      {docs.map(doc => (
        <a key={doc.title} href={doc.href} target="_blank" style={{ textDecoration: 'none' }}>
          <div style={{
            background: '#FFFFFF', border: '1px solid #E8E7E4',
            borderRadius: '10px', padding: '18px 20px',
            marginBottom: '10px', display: 'flex',
            alignItems: 'center', justifyContent: 'space-between',
            cursor: 'pointer',
          }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: '600', color: '#18181B', marginBottom: '3px' }}>
                {doc.title}
              </div>
              <div style={{ fontSize: '13px', color: '#71717A' }}>
                {doc.desc}
              </div>
            </div>
            <span style={{ color: '#A1A1AA', fontSize: '18px' }}>→</span>
          </div>
        </a>
      ))}
    </div>
  )
}