export default function CodeBlock() {
  return (
    <div style={{
      background: '#18181B',
      border: '1px solid #27272A',
      borderRadius: '10px',
      padding: '18px 22px',
      fontFamily: '"JetBrains Mono", "Fira Code", monospace',
      fontSize: '13px',
      lineHeight: '1.9',
    }}>
      <div style={{ color: '#52525B', marginBottom: '2px', fontSize: '12px' }}>
        // protect your subscription in 3 lines
      </div>
      <div>
        <span style={{ color: '#93C5FD' }}>const</span>
        <span style={{ color: '#E4E4E7' }}> gate = </span>
        <span style={{ color: '#86EFAC' }}>new </span>
        <span style={{ color: '#FDE68A' }}>FaceGate</span>
        <span style={{ color: '#E4E4E7' }}>{'({'} </span>
        <span style={{ color: '#93C5FD' }}>apiKey</span>
        <span style={{ color: '#E4E4E7' }}>: </span>
        <span style={{ color: '#FCA5A5' }}>'fg_live_xxx'</span>
        <span style={{ color: '#E4E4E7' }}>{' })'}  </span>
      </div>
      <div>
        <span style={{ color: '#FDE68A' }}>await</span>
        <span style={{ color: '#E4E4E7' }}> gate.</span>
        <span style={{ color: '#86EFAC' }}>enroll</span>
        <span style={{ color: '#E4E4E7' }}>(userId)   </span>
        <span style={{ color: '#52525B' }}>// signup</span>
      </div>
      <div>
        <span style={{ color: '#FDE68A' }}>await</span>
        <span style={{ color: '#E4E4E7' }}> gate.</span>
        <span style={{ color: '#86EFAC' }}>verify</span>
        <span style={{ color: '#E4E4E7' }}>(userId)   </span>
        <span style={{ color: '#52525B' }}>// every login</span>
      </div>
    </div>
  )
}