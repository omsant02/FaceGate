interface IntegrationTabProps {
  apiKey: string | null
}

export default function IntegrationTab({ apiKey }: IntegrationTabProps) {
  const steps = [
    {
      step: '1',
      title: 'Install the SDK',
      code: 'npm install @facegate/sdk @worldcoin/idkit',
    },
    {
      step: '2',
      title: 'Initialize FaceGate',
      code: `import { FaceGate } from '@facegate/sdk'\n\nconst gate = new FaceGate({\n  apiKey: '${apiKey || 'fg_live_xxx'}'\n})`,
    },
    {
      step: '3',
      title: 'Enroll on signup',
      code: `// After user creates account\nconst enrollData = await gate.enroll(userId)\n// Show IDKit widget with enrollData\nawait gate.confirm(userId, proof)`,
    },
    {
      step: '4',
      title: 'Verify on every login',
      code: `// After password check\nconst enrollData = await gate.enroll(userId)\n// Show IDKit widget with enrollData\nconst result = await gate.verify(userId, proof)\nif (!result.authorized) throw new Error('Blocked')`,
    },
  ]

  return (
    <div style={{ maxWidth: '640px' }}>
      <p style={{ fontSize: '14px', color: '#71717A', marginBottom: '28px' }}>
        Add FaceGate to your app in minutes.
      </p>

      {steps.map(item => (
        <div key={item.step} style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            width: '28px', height: '28px',
            background: '#3B82F6', borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: '13px', fontWeight: '700',
            color: '#fff', marginTop: '2px',
          }}>
            {item.step}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: '#18181B' }}>
              {item.title}
            </div>
            <div style={{
              background: '#18181B', borderRadius: '8px',
              padding: '14px 16px', fontFamily: 'monospace',
              fontSize: '13px', color: '#E4E4E7',
              lineHeight: '1.8', whiteSpace: 'pre',
              overflowX: 'auto',
            }}>
              {item.code}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}