'use client'

import { useEffect, useRef, useState } from 'react'

export default function FaceScanAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phase, setPhase] = useState<'scanning' | 'verified'>('scanning')
  const animRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 340
    const H = 400
    canvas.width = W
    canvas.height = H

    // Boundary of the scan area (inside the corner brackets)
    const BOUND = { x: 30, y: 30, w: W - 60, h: H - 60 }
    const cX = W / 2
    const cY = H / 2

    // Face landmark dots — positioned relative to center
    // Forms a realistic face silhouette
    const facePoints: {
      x: number; y: number; ox: number; oy: number
      phase: number; size: number; region: string
    }[] = []

    const addRegion = (
      cx: number, cy: number,
      rx: number, ry: number,
      count: number, region: string
    ) => {
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2
        const r = Math.sqrt(Math.random())
        const x = cx + Math.cos(angle) * rx * r
        const y = cy + Math.sin(angle) * ry * r
        facePoints.push({
          x, y, ox: x, oy: y,
          phase: Math.random() * Math.PI * 2,
          size: Math.random() * 2 + 0.5,
          region,
        })
      }
    }

    // Face outline — oval
    for (let a = 0; a < Math.PI * 2; a += 0.08) {
      const rx = 90, ry = 115
      const x = cX + Math.cos(a) * rx
      const y = cY + 10 + Math.sin(a) * ry
      facePoints.push({ x, y, ox: x, oy: y, phase: Math.random() * Math.PI * 2, size: 1.2, region: 'outline' })
    }

    // Fill face with dots
    addRegion(cX, cY + 10, 85, 110, 300, 'face')

    // Eyes
    addRegion(cX - 30, cY - 30, 18, 10, 40, 'eye')
    addRegion(cX + 30, cY - 30, 18, 10, 40, 'eye')

    // Eyebrows
    for (let i = -20; i <= 20; i += 4) {
      facePoints.push({ x: cX - 30 + i, y: cY - 52, ox: cX - 30 + i, oy: cY - 52, phase: Math.random() * Math.PI * 2, size: 1.5, region: 'brow' })
      facePoints.push({ x: cX + 30 + i, y: cY - 52, ox: cX + 30 + i, oy: cY - 52, phase: Math.random() * Math.PI * 2, size: 1.5, region: 'brow' })
    }

    // Nose
    addRegion(cX, cY + 10, 10, 20, 25, 'nose')

    // Mouth
    for (let i = -28; i <= 28; i += 4) {
      const curve = Math.sin((i / 28) * Math.PI) * 8
      facePoints.push({ x: cX + i, y: cY + 55 - curve, ox: cX + i, oy: cY + 55 - curve, phase: Math.random() * Math.PI * 2, size: 1.5, region: 'mouth' })
    }

    let frame = 0
    let scanY = BOUND.y
    let verified = false
    let verifiedAlpha = 0

    const draw = () => {
      ctx.clearRect(0, 0, W, H)

      // White background
      ctx.fillStyle = '#F8F8F7'
      ctx.fillRect(0, 0, W, H)

      // Subtle grid background
      ctx.strokeStyle = 'rgba(59,130,246,0.04)'
      ctx.lineWidth = 1
      for (let x = 0; x < W; x += 20) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let y = 0; y < H; y += 20) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Draw face dots
      facePoints.forEach(dot => {
        const dx = Math.sin(frame * 0.01 + dot.phase) * 1.2
        const dy = Math.cos(frame * 0.008 + dot.phase * 1.2) * 1.0
        dot.x = dot.ox + dx
        dot.y = dot.oy + dy

        let baseAlpha = 0.3
        let r = 99, g = 155, b = 255

        if (verified) {
          r = 34; g = 197; b = 94
          baseAlpha = Math.min(0.9, verifiedAlpha / 80) * 0.8
        } else if (dot.y <= scanY) {
          // Already scanned — bright
          r = 59; g = 130; b = 246
          baseAlpha = 0.85
          if (dot.region === 'outline') baseAlpha = 1
          if (dot.region === 'eye' || dot.region === 'brow') { r = 147; g = 197; b = 253 }
        } else {
          // Not yet scanned — dim
          baseAlpha = 0.15
        }

        const pulse = Math.sin(frame * 0.03 + dot.phase) * 0.15 + 0.85
        ctx.beginPath()
        ctx.arc(dot.x, dot.y, dot.size * pulse, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${baseAlpha})`
        ctx.fill()
      })

      // Scan line — CLIPPED to boundary
      if (!verified) {
        ctx.save()
        ctx.beginPath()
        ctx.rect(BOUND.x, BOUND.y, BOUND.w, BOUND.h)
        ctx.clip()

        const scanGrad = ctx.createLinearGradient(0, scanY - 24, 0, scanY + 24)
        scanGrad.addColorStop(0, 'rgba(59,130,246,0)')
        scanGrad.addColorStop(0.4, 'rgba(59,130,246,0.15)')
        scanGrad.addColorStop(0.5, 'rgba(147,197,253,0.9)')
        scanGrad.addColorStop(0.6, 'rgba(59,130,246,0.15)')
        scanGrad.addColorStop(1, 'rgba(59,130,246,0)')
        ctx.fillStyle = scanGrad
        ctx.fillRect(BOUND.x, scanY - 24, BOUND.w, 48)

        // Glow dots on scan line
        for (let x = BOUND.x + 4; x < BOUND.x + BOUND.w; x += 6) {
          ctx.beginPath()
          ctx.arc(x, scanY, 1, 0, Math.PI * 2)
          ctx.fillStyle = 'rgba(147,197,253,0.95)'
          ctx.fill()
        }
        ctx.restore()

        scanY += 1.5
        if (scanY > BOUND.y + BOUND.h) scanY = BOUND.y
      }

      // Verified checkmark
      if (verified && verifiedAlpha > 30) {
        const alpha = Math.min(1, (verifiedAlpha - 30) / 50)
        const pulse = Math.sin(frame * 0.06) * 0.08 + 0.92
        ctx.save()
        ctx.globalAlpha = alpha
        ctx.strokeStyle = '#16A34A'
        ctx.lineWidth = 5
        ctx.lineCap = 'round'
        ctx.lineJoin = 'round'
        ctx.translate(cX, cY + 10)
        ctx.scale(pulse * 3, pulse * 3)
        ctx.beginPath()
        ctx.moveTo(-10, 0)
        ctx.lineTo(-3, 8)
        ctx.lineTo(12, -8)
        ctx.stroke()
        ctx.restore()
      }

      // Corner brackets — rounded, with glow
      const bS = 28
      const bO = 8
      const bR = 10
      const bColor = verified ? '#16A34A' : '#3B82F6'
      const bAlpha = verified ? 1 : (Math.sin(frame * 0.04) * 0.2 + 0.8)

      // Glow under brackets
      ctx.shadowColor = bColor
      ctx.shadowBlur = 8
      ctx.strokeStyle = bColor
      ctx.globalAlpha = bAlpha
      ctx.lineWidth = 2.5
      ctx.lineCap = 'round'

      // Top-left
      ctx.beginPath()
      ctx.moveTo(bO, bO + bS)
      ctx.lineTo(bO, bO + bR)
      ctx.quadraticCurveTo(bO, bO, bO + bR, bO)
      ctx.lineTo(bO + bS, bO)
      ctx.stroke()

      // Top-right
      ctx.beginPath()
      ctx.moveTo(W - bO - bS, bO)
      ctx.lineTo(W - bO - bR, bO)
      ctx.quadraticCurveTo(W - bO, bO, W - bO, bO + bR)
      ctx.lineTo(W - bO, bO + bS)
      ctx.stroke()

      // Bottom-left
      ctx.beginPath()
      ctx.moveTo(bO, H - bO - bS)
      ctx.lineTo(bO, H - bO - bR)
      ctx.quadraticCurveTo(bO, H - bO, bO + bR, H - bO)
      ctx.lineTo(bO + bS, H - bO)
      ctx.stroke()

      // Bottom-right
      ctx.beginPath()
      ctx.moveTo(W - bO - bS, H - bO)
      ctx.lineTo(W - bO - bR, H - bO)
      ctx.quadraticCurveTo(W - bO, H - bO, W - bO, H - bO - bR)
      ctx.lineTo(W - bO, H - bO - bS)
      ctx.stroke()

      ctx.globalAlpha = 1
      ctx.shadowBlur = 0

      frame++
      if (verified) verifiedAlpha++

      if (!verified && frame > 300) {
        verified = true
        verifiedAlpha = 0
        setPhase('verified')
        setTimeout(() => {
          verified = false
          verifiedAlpha = 0
          frame = 0
          scanY = BOUND.y
          setPhase('scanning')
        }, 2500)
      }

      animRef.current = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(animRef.current)
  }, [])

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <canvas
        ref={canvasRef}
        style={{ display: 'block', borderRadius: '16px' }}
      />
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: phase === 'verified'
          ? 'rgba(220,252,231,0.96)'
          : 'rgba(239,246,255,0.96)',
        border: `1px solid ${phase === 'verified' ? '#86EFAC' : '#BFDBFE'}`,
        borderRadius: '999px',
        padding: '6px 18px',
        fontSize: '11px',
        fontWeight: '700',
        color: phase === 'verified' ? '#16A34A' : '#3B82F6',
        whiteSpace: 'nowrap',
        letterSpacing: '0.06em',
        backdropFilter: 'blur(8px)',
        transition: 'all 0.4s',
        boxShadow: phase === 'verified'
          ? '0 0 16px rgba(34,197,94,0.25)'
          : '0 0 16px rgba(59,130,246,0.2)',
      }}>
        {phase === 'verified' ? '✓ IDENTITY VERIFIED' : '⬤ SCANNING...'}
      </div>
    </div>
  )
}