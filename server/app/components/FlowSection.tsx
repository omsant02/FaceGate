'use client'

import { useEffect, useRef } from 'react'

export default function FlowSection() {
  const stageRef = useRef<HTMLDivElement>(null)
  const svgRef   = useRef<SVGSVGElement>(null)
  const rafRef   = useRef<number>(0)
  const ran      = useRef(false)

  useEffect(() => {
    if (ran.current) return
    ran.current = true

    const stage = stageRef.current!
    const svg   = svgRef.current!

    function sleep(ms: number) { return new Promise<void>(r => setTimeout(r, ms)) }

    function box(el: HTMLElement) {
      const sr = stage.getBoundingClientRect()
      const r  = el.getBoundingClientRect()
      return {
        x: r.left - sr.left, y: r.top - sr.top,
        w: r.width, h: r.height,
        cx: r.left - sr.left + r.width / 2,
        cy: r.top  - sr.top  + r.height / 2,
        rx: r.right - sr.left,
        lx: r.left  - sr.left,
      }
    }

    function svgEl<K extends keyof SVGElementTagNameMap>(
      tag: K, attrs: Record<string, string|number>
    ): SVGElementTagNameMap[K] {
      const e = document.createElementNS('http://www.w3.org/2000/svg', tag)
      Object.entries(attrs).forEach(([k,v]) => e.setAttribute(k, String(v)))
      svg.appendChild(e); return e
    }

    function bezD(x1:number,y1:number,x2:number,y2:number) {
      const cx = (x1+x2)/2
      return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`
    }

    interface Wire { d:string; track:SVGPathElement; glow:SVGCircleElement; dot:SVGCircleElement; len:number; t:number; speed:number; active:boolean }
    let wires: Wire[] = []
    const tmp = document.createElementNS('http://www.w3.org/2000/svg','path')

    function addWire(x1:number,y1:number,x2:number,y2:number,
      {speed=0.0013,t0=0,dotColor='#3B82F6'}={}):Wire {
      const d=bezD(x1,y1,x2,y2)
      const track=svgEl('path',{d,stroke:'#D4D3CF','stroke-width':1.5,fill:'none'})
      const glow =svgEl('circle',{r:6,fill:'rgba(59,130,246,0.18)'})
      const dot  =svgEl('circle',{r:3,fill:dotColor})
      tmp.setAttribute('d',d); const len=tmp.getTotalLength()
      const w:Wire={d,track,glow,dot,len,t:t0,speed,active:true}
      wires.push(w); return w
    }

    function removeWire(w:Wire|null){
      if(!w)return
      ;[w.track,w.glow,w.dot].forEach(e=>{try{svg.removeChild(e)}catch{}})
      wires=wires.filter(x=>x!==w)
    }

    function animLoop(){
      wires.forEach(w=>{
        if(!w.active){w.dot.setAttribute('r','0');w.glow.setAttribute('r','0');return}
        w.t+=w.speed; if(w.t>1)w.t-=1
        tmp.setAttribute('d',w.d)
        const pt=tmp.getPointAtLength(w.t*w.len)
        w.dot.setAttribute('cx',String(pt.x));w.dot.setAttribute('cy',String(pt.y))
        w.glow.setAttribute('cx',String(pt.x));w.glow.setAttribute('cy',String(pt.y))
        w.dot.setAttribute('r','3');w.glow.setAttribute('r','6')
      })
      rafRef.current=requestAnimationFrame(animLoop)
    }

    async function drawWire(x1:number,y1:number,x2:number,y2:number,dur=700,
      opts:{speed?:number;t0?:number;dotColor?:string;strokeColor?:string}={}):Promise<Wire>{
      const d=bezD(x1,y1,x2,y2); tmp.setAttribute('d',d)
      const len=tmp.getTotalLength()
      const path=svgEl('path',{d,stroke:opts.strokeColor||'#3B82F6','stroke-width':2,fill:'none',
        'stroke-dasharray':len,'stroke-dashoffset':len,'stroke-linecap':'round'})
      const start=performance.now()
      await new Promise<void>(res=>{
        function step(now:number){
          const p=Math.min((now-start)/dur,1), ease=1-Math.pow(1-p,3)
          path.setAttribute('stroke-dashoffset',String(len*(1-ease)))
          if(p<1)requestAnimationFrame(step);else res()
        }
        requestAnimationFrame(step)
      })
      svg.removeChild(path)
      return addWire(x1,y1,x2,y2,opts)
    }

    async function travelAlong(el:HTMLElement,x1:number,y1:number,x2:number,y2:number,dur=1000){
      const d=bezD(x1,y1,x2,y2); tmp.setAttribute('d',d)
      const len=tmp.getTotalLength(), start=performance.now()
      el.style.opacity='1'
      await new Promise<void>(res=>{
        function step(now:number){
          const p=Math.min((now-start)/dur,1), ease=1-Math.pow(1-p,4)
          const pt=tmp.getPointAtLength(ease*len)
          const er=el.getBoundingClientRect()
          el.style.left=(pt.x-er.width/2)+'px'
          el.style.top=(pt.y-er.height/2)+'px'
          if(p<1)requestAnimationFrame(step);else res()
        }
        requestAnimationFrame(step)
      })
    }

    const G=(id:string)=>stage.querySelector('#fg-'+id) as HTMLElement
    function caption(txt:string){const c=G('caption');if(c)c.textContent=txt}
    function s(id:string,styles:Partial<CSSStyleDeclaration>){const e=G(id);if(e)Object.assign(e.style,styles)}

    async function story(){
      await sleep(500)

      // Scene 1 — World + FaceGate
      caption('World ID verifies real humans — zero biometric data stored')
      s('world',{opacity:'1',borderColor:'#3B82F6',boxShadow:'0 4px 20px rgba(59,130,246,0.2)'})
      await sleep(500)
      s('fg',{opacity:'1',borderColor:'#3B82F6',boxShadow:'0 4px 20px rgba(59,130,246,0.2)'})
      await sleep(700)
      const wb=box(G('world')),fgb=box(G('fg'))
      const wfWire=await drawWire(wb.rx,wb.cy,fgb.lx,fgb.cy,600,{speed:0.0016})
      await sleep(700)

      // Scene 2 — Platforms appear
      caption('Streaming platforms — no credential-sharing protection yet')
      for(const id of['pf-netflix','pf-prime','pf-disney','pf-demo']){
        s(id,{opacity:'1'}); await sleep(180)
      }
      await sleep(1100)

      // Scene 3 — Expand Netflix
      caption('Inside Netflix — authentication is the weak link')
      const nxPill=G('pf-netflix'), nb=box(nxPill), nxBox=G('nx-box')
      Object.assign(nxBox.style,{left:nb.x+'px',top:nb.y+'px',width:nb.w+'px',height:nb.h+'px',opacity:'1'})
      nxPill.style.opacity='0'
      ;['pf-prime','pf-disney','pf-demo'].forEach(id=>s(id,{opacity:'0.15'}))
      s('world',{opacity:'0.2'}); s('fg',{opacity:'0.2'}); wfWire.active=false
      await sleep(150)

      // Expand Netflix box rightward and downward — keep right edge fixed
      const stageW=stage.offsetWidth
      const nxW=224, nxH=190
      const nxLeft=stageW-nxW-24
      Object.assign(nxBox.style,{width:nxW+'px',height:nxH+'px',left:nxLeft+'px',top:(nb.y-28)+'px'})
      await sleep(750)
      const svcWrap=G('nx-services'); if(svcWrap)svcWrap.style.opacity='1'
      await sleep(600)
      const svcAuth=G('svc-auth')
      if(svcAuth)Object.assign(svcAuth.style,{background:'#EFF6FF',color:'#3B82F6',borderColor:'#BFDBFE'})
      await sleep(700)

      // Scene 4 — Auth box inside Netflix + User node
      caption('Email & password login — credentials anyone can share')
      const nxb=box(nxBox)
      const u1=G('u1')
      Object.assign(u1.style,{left:(nxb.rx+20)+'px',top:(nxb.cy-36)+'px',opacity:'1'})
      await sleep(400)

      // Auth box starts at bottom of nx-box services area, then expands
      const authBox=G('auth-box')
      const authLeft=nxb.x+8, authTop=nxb.y+nxH-4
      Object.assign(authBox.style,{left:authLeft+'px',top:authTop+'px',width:(nxW-16)+'px',height:'44px',opacity:'1'})
      // Expand nx-box to make room
      await sleep(100)
      const totalH=nxH+128
      nxBox.style.height=totalH+'px'
      authBox.style.height='120px'
      await sleep(700)

      const arEmail=G('ar-email'); if(arEmail)Object.assign(arEmail.style,{opacity:'1',transform:'none'})
      await sleep(400)
      const arPass=G('ar-pass'); if(arPass)Object.assign(arPass.style,{opacity:'1',transform:'none'})
      await sleep(600)

      const ab=box(authBox), u1b=box(u1)
      const u1Wire=await drawWire(u1b.lx,u1b.cy,ab.rx,ab.cy,500,{strokeColor:'#16A34A',dotColor:'#16A34A',speed:0.002})
      await sleep(900)

      // Scene 5 — Credential sharing
      caption('⚠️ A second user logs in with the same password — gets access')
      const u2=G('u2')
      Object.assign(u2.style,{left:(nxb.rx+20)+'px',top:(nxb.cy+32)+'px',opacity:'1'})
      await sleep(500)
      const u2b=box(u2), ab2=box(authBox)
      const u2Wire=await drawWire(u2b.lx,u2b.cy,ab2.rx+3,ab2.cy+10,500,{strokeColor:'#DC2626',dotColor:'#DC2626',speed:0.002})
      await sleep(600)
      const afPass=G('af-pass')
      if(afPass)Object.assign(afPass.style,{borderColor:'#FECACA',background:'#FEF2F2',color:'#DC2626',textDecoration:'line-through'})
      authBox.style.borderColor='#DC2626'
      authBox.style.boxShadow='0 2px 12px rgba(220,38,38,0.2)'
      await sleep(1000)

      // Scene 6 — npm + SDK travels
      caption('@facegate/sdk — pulled from npm, dropped into auth')
      removeWire(u2Wire); u2.style.opacity='0'
      await sleep(300)

      const npmNode=G('npm-node')
      const nxb2=box(nxBox)
      // Position npm node above and left of the Netflix box
      Object.assign(npmNode.style,{left:(nxb2.cx-60)+'px',top:(nxb2.y-100)+'px',opacity:'1'})
      await sleep(700)

      const nn=box(npmNode), ab3=box(authBox)
      const pkg=G('pkg-travel')
      Object.assign(pkg.style,{left:(nn.cx-60)+'px',top:(nn.cy-12)+'px',opacity:'1'})
      await sleep(300)

      await travelAlong(pkg,nn.cx,nn.cy,ab3.cx,ab3.cy,1000)
      pkg.style.opacity='0'

      const sdkPlug=G('sdk-plug')
      if(sdkPlug)Object.assign(sdkPlug.style,{opacity:'1',transform:'translateY(0)'})
      if(afPass){
        Object.assign(afPass.style,{textDecoration:'none',borderColor:'#BFDBFE',background:'#EFF6FF',color:'#3B82F6'})
        afPass.textContent='@facegate/sdk'
      }
      await sleep(400)
      authBox.style.borderColor='#3B82F6'
      authBox.style.boxShadow='0 2px 16px rgba(59,130,246,0.22)'
      // Expand auth box + nx-box for verify rows
      authBox.style.height='215px'
      nxBox.style.height=(totalH+95)+'px'
      await sleep(700)

      // Scene 7 — FaceGate wire
      caption('FaceGate server connects — World ID chain is live')
      s('world',{opacity:'1'}); s('fg',{opacity:'1'}); wfWire.active=true
      await sleep(500)
      const fgb2=box(G('fg')), ab4=box(authBox)
      const fgNxWire=await drawWire(fgb2.rx,fgb2.cy,ab4.lx,ab4.cy,900,{speed:0.0014})
      await sleep(700)

      // Scene 8 — Verification
      caption('Only the enrolled face gets in — strangers are blocked')
      const vr1=G('vr1'); if(vr1)vr1.style.opacity='1'; await sleep(450)
      const vr2=G('vr2'); if(vr2)vr2.style.opacity='1'; await sleep(450)
      const rpOk=G('rp-ok'); if(rpOk)rpOk.style.opacity='1'; await sleep(1100)
      if(rpOk)rpOk.style.opacity='0'; await sleep(300)
      if(rpOk)rpOk.style.display='none'
      const rpFail=G('rp-fail')
      if(rpFail){rpFail.style.display='block';await sleep(30);rpFail.style.opacity='1'}
      const vr3=G('vr3'); if(vr3)vr3.style.opacity='1'
      u2.style.opacity='1'
      Object.assign(u2.style,{borderColor:'#DC2626',boxShadow:'0 2px 12px rgba(220,38,38,0.2)'})
      await sleep(1600)

      // Scene 9 — Collapse + full architecture
      caption('Every platform — protected. Zero biometrics stored.')
      removeWire(fgNxWire); removeWire(u1Wire)
      u1.style.opacity='0'; u2.style.opacity='0'; npmNode.style.opacity='0'
      await sleep(400)
      authBox.style.opacity='0'; await sleep(300)
      Object.assign(nxBox.style,{left:nb.x+'px',top:nb.y+'px',width:nb.w+'px',height:nb.h+'px'})
      await sleep(750)
      nxBox.style.opacity='0'; nxPill.style.opacity='1'
      Object.assign(nxPill.style,{borderColor:'#3B82F6',boxShadow:'0 4px 16px rgba(59,130,246,0.18)'})
      ;['pf-prime','pf-disney','pf-demo'].forEach(id=>{
        const e=G(id); if(e)Object.assign(e.style,{opacity:'1',borderColor:'#3B82F6',boxShadow:'0 4px 16px rgba(59,130,246,0.15)'})
      })
      s('world',{opacity:'1',borderColor:'#3B82F6'}); s('fg',{opacity:'1',borderColor:'#3B82F6'})
      wfWire.active=true; await sleep(500)

      const fgb3=box(G('fg'))
      for(const id of['pf-netflix','pf-prime','pf-disney','pf-demo']){
        const e=G(id); if(!e)continue
        const pb=box(e)
        await drawWire(fgb3.rx,fgb3.cy,pb.lx,pb.cy,420,{speed:0.0012+Math.random()*0.001,t0:Math.random()*0.3})
        await sleep(160)
      }
      await sleep(2000)
      caption('🔒 One account. One face. No sharing.')
    }

    rafRef.current=requestAnimationFrame(animLoop)
    story()
    return ()=>{cancelAnimationFrame(rafRef.current)}
  },[])

  const A:React.CSSProperties={position:'absolute',transition:'opacity .5s,border-color .4s,box-shadow .4s'}
  const PLAT_RIGHT=24

  return (
    <section style={{background:'#FFFFFF',paddingTop:88,paddingBottom:72}}>

      {/* ── Heading — number leads, no eyebrow ── */}
      <div style={{maxWidth:960,margin:'0 auto',padding:'0 24px',marginBottom:52}}>
        <h2 style={{
          fontSize:36,fontWeight:700,letterSpacing:'-0.04em',
          color:'#18181B',lineHeight:1.15,marginBottom:10,
        }}>
          $9.1 billion lost to credential sharing every year.
        </h2>
        <p style={{fontSize:16,color:'#71717A',fontWeight:400,letterSpacing:'-0.01em'}}>
          Here&apos;s what that looks like inside Netflix — and how three lines of code fix it.
        </p>
      </div>

      {/* ── Stage ── */}
      <div style={{maxWidth:960,margin:'0 auto',padding:'0 24px'}}>
        <div ref={stageRef} style={{position:'relative',width:'100%',height:500,overflow:'visible'}}>
          <svg ref={svgRef} style={{position:'absolute',inset:0,width:'100%',height:'100%',overflow:'visible',pointerEvents:'none',zIndex:1}}/>

          {/* World ID */}
          <div id="fg-world" style={{...A,left:16,top:'50%',transform:'translateY(-50%)',
            width:118,background:'#fff',border:'1.5px solid #E8E7E4',borderRadius:14,
            padding:'16px 12px 13px',display:'flex',flexDirection:'column',alignItems:'center',gap:7,
            boxShadow:'0 1px 3px rgba(0,0,0,.04),0 4px 14px rgba(0,0,0,.06)',opacity:0,zIndex:4}}>
            <div style={{width:44,height:44,borderRadius:10,background:'#000',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden'}}>
              {/* Official World ID product icon */}
              <img
                src="https://world-cdn.worldcoin.org/worldcoin-company-website/ad4cqJ1ZCF7ETK81_box06-internallink.svg"
                width={44} height={44}
                alt="World ID"
                style={{display:'block'}}
              />
            </div>
            <div style={{fontSize:11,fontWeight:700,color:'#18181B',textAlign:'center',letterSpacing:'-0.02em'}}>World ID</div>
            <div style={{fontSize:9,color:'#A1A1AA',textAlign:'center',fontWeight:500}}>Selfie Check · ZK</div>
          </div>

          {/* FaceGate Server */}
          <div id="fg-fg" style={{...A,left:196,top:'50%',transform:'translateY(-50%)',
            width:124,background:'#fff',border:'1.5px solid #E8E7E4',borderRadius:14,
            padding:'16px 12px 13px',display:'flex',flexDirection:'column',alignItems:'center',gap:7,
            boxShadow:'0 1px 3px rgba(0,0,0,.04),0 4px 14px rgba(0,0,0,.06)',opacity:0,zIndex:4}}>
            <div style={{width:44,height:44,borderRadius:10,background:'#3B82F6',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L4 5.5V11C4 15.4 7.4 19.5 12 20C16.6 19.5 20 15.4 20 11V5.5L12 2Z" fill="white" fillOpacity=".92"/>
                <circle cx="12" cy="11" r="3.2" fill="#3B82F6"/>
              </svg>
            </div>
            <div style={{fontSize:11,fontWeight:700,color:'#18181B',textAlign:'center',letterSpacing:'-0.02em'}}>FaceGate</div>
            <div style={{fontSize:9,color:'#A1A1AA',textAlign:'center',fontWeight:500}}>Server · Vercel</div>
          </div>

          {/* Platform pills */}
          {([
            {id:'pf-netflix',name:'Netflix',     sub:'Streaming',top:128,bg:'#E50914',ltr:'N'},
            {id:'pf-prime',  name:'Prime Video', sub:'Streaming',top:184,bg:'#00A8E0',ltr:'P'},
            {id:'pf-disney', name:'Disney+',      sub:'Streaming',top:240,bg:'#113CCF',ltr:'D+'},
            {id:'pf-demo',   name:'Demo Netflix',sub:'Live demo', top:296,bg:'#3B82F6',ltr:'▶'},
          ] as const).map(p=>(
            <div key={p.id} id={`fg-${p.id}`} style={{...A,
              right:PLAT_RIGHT,top:p.top,width:138,background:'#fff',
              border:'1.5px solid #E8E7E4',borderRadius:11,
              padding:'8px 12px',display:'flex',alignItems:'center',gap:8,
              boxShadow:'0 1px 3px rgba(0,0,0,.04),0 2px 8px rgba(0,0,0,.04)',
              opacity:0,zIndex:4}}>
              <div style={{width:26,height:26,borderRadius:6,background:p.bg,display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:10,fontWeight:900,color:'#fff',fontFamily:'Arial Black,sans-serif'}}>{p.ltr}</div>
              <div>
                <div style={{fontSize:10,fontWeight:700,color:'#18181B',letterSpacing:'-0.02em'}}>{p.name}</div>
                <div style={{fontSize:9,color:'#A1A1AA',marginTop:1,fontWeight:500}}>{p.sub}</div>
              </div>
            </div>
          ))}

          {/* Netflix expanded box */}
          <div id="fg-nx-box" style={{...A,
            right:PLAT_RIGHT,background:'#fff',border:'1.5px solid #E8E7E4',
            borderRadius:14,overflow:'visible',
            boxShadow:'0 2px 24px rgba(0,0,0,.08)',
            opacity:0,zIndex:10,
            transition:'width .65s cubic-bezier(.4,0,.2,1),height .65s cubic-bezier(.4,0,.2,1),left .65s cubic-bezier(.4,0,.2,1),top .65s cubic-bezier(.4,0,.2,1),opacity .4s,border-color .5s',
            width:138,height:46}}>
            <div style={{display:'flex',alignItems:'center',gap:8,padding:'10px 13px 8px',borderBottom:'1px solid #E8E7E4',borderRadius:'13px 13px 0 0',background:'#fff'}}>
              <div style={{width:20,height:20,borderRadius:4,background:'#E50914',display:'flex',alignItems:'center',justifyContent:'center',fontSize:10,fontWeight:900,color:'#fff',fontFamily:'Arial Black,sans-serif',flexShrink:0}}>N</div>
              <div style={{fontSize:11,fontWeight:700,color:'#18181B',letterSpacing:'-0.02em'}}>Netflix</div>
            </div>
            <div id="fg-nx-services" style={{padding:'10px 13px',display:'flex',flexDirection:'column',gap:6,opacity:0,transition:'opacity .4s'}}>
              <div style={{background:'#F4F4F5',borderRadius:7,padding:'5px 9px',fontSize:10,fontWeight:600,color:'#71717A'}}>🎬 Streaming</div>
              <div id="fg-svc-auth" style={{background:'#F4F4F5',borderRadius:7,padding:'5px 9px',fontSize:10,fontWeight:600,color:'#71717A',border:'1px solid transparent',transition:'all .4s'}}>🔐 Auth</div>
              <div style={{background:'#F4F4F5',borderRadius:7,padding:'5px 9px',fontSize:10,fontWeight:600,color:'#71717A'}}>💳 Billing</div>
            </div>
          </div>

          {/* Auth inner box — positioned by JS */}
          <div id="fg-auth-box" style={{...A,
            background:'#fff',border:'1.5px solid #E8E7E4',borderRadius:12,overflow:'hidden',
            boxShadow:'0 2px 12px rgba(0,0,0,.08)',opacity:0,zIndex:12,
            transition:'width .6s cubic-bezier(.4,0,.2,1),height .6s cubic-bezier(.4,0,.2,1),top .6s cubic-bezier(.4,0,.2,1),left .6s,opacity .4s,border-color .5s,box-shadow .5s',
            width:120,height:44}}>
            <div style={{padding:'7px 10px',borderBottom:'1px solid #E8E7E4',fontSize:10,fontWeight:700,color:'#18181B',display:'flex',alignItems:'center',gap:5}}>
              <span>🔐</span><span>Authentication</span>
            </div>
            <div style={{padding:'8px 10px',display:'flex',flexDirection:'column',gap:5}}>
              <div id="fg-ar-email" style={{display:'flex',alignItems:'center',gap:5,opacity:0,transform:'translateY(4px)',transition:'opacity .35s,transform .35s'}}>
                <span style={{fontSize:10}}>📧</span>
                <div style={{flex:1,background:'#F4F4F5',border:'1px solid #E4E4E7',borderRadius:5,padding:'4px 7px',fontSize:9,color:'#71717A'}}>email@user.com</div>
              </div>
              <div id="fg-ar-pass" style={{display:'flex',alignItems:'center',gap:5,opacity:0,transform:'translateY(4px)',transition:'opacity .35s,transform .35s'}}>
                <span style={{fontSize:10}}>🔑</span>
                <div id="fg-af-pass" style={{flex:1,background:'#F4F4F5',border:'1px solid #E4E4E7',borderRadius:5,padding:'4px 7px',fontSize:9,color:'#71717A',transition:'all .4s'}}>••••••••••</div>
              </div>
              <div id="fg-sdk-plug" style={{display:'flex',alignItems:'center',gap:5,background:'#EFF6FF',border:'1.5px solid #BFDBFE',borderRadius:7,padding:'5px 8px',opacity:0,transform:'translateY(-8px)',transition:'opacity .5s,transform .5s cubic-bezier(.34,1.56,.64,1)'}}>
                <div style={{width:6,height:6,borderRadius:'50%',background:'#3B82F6',flexShrink:0}}/>
                <span style={{fontFamily:'JetBrains Mono,monospace',fontSize:9,color:'#3B82F6',fontWeight:600}}>@facegate/sdk</span>
              </div>
              <div id="fg-vr1" style={{display:'flex',alignItems:'center',gap:5,fontFamily:'JetBrains Mono,monospace',fontSize:9,opacity:0,transition:'opacity .3s'}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:'#16A34A',flexShrink:0}}/><span style={{color:'#16A34A'}}>Face enrolled ✓</span>
              </div>
              <div id="fg-vr2" style={{display:'flex',alignItems:'center',gap:5,fontFamily:'JetBrains Mono,monospace',fontSize:9,opacity:0,transition:'opacity .3s'}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:'#16A34A',flexShrink:0}}/><span style={{color:'#16A34A'}}>Selfie Check: PASS</span>
              </div>
              <div id="fg-vr3" style={{display:'flex',alignItems:'center',gap:5,fontFamily:'JetBrains Mono,monospace',fontSize:9,opacity:0,transition:'opacity .3s'}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:'#DC2626',flexShrink:0}}/><span style={{color:'#DC2626'}}>Stranger: BLOCKED</span>
              </div>
              <div id="fg-rp-ok" style={{borderRadius:5,padding:'4px 8px',background:'#DCFCE7',color:'#16A34A',fontSize:10,fontWeight:700,textAlign:'center',opacity:0,transition:'opacity .35s'}}>✓ Access Granted</div>
              <div id="fg-rp-fail" style={{borderRadius:5,padding:'4px 8px',background:'#FEE2E2',color:'#DC2626',fontSize:10,fontWeight:700,textAlign:'center',opacity:0,transition:'opacity .35s',display:'none'}}>✗ Access Blocked</div>
            </div>
          </div>

          {/* npm registry */}
          <div id="fg-npm-node" style={{...A,
            background:'#fff',border:'1.5px solid #E8E7E4',borderRadius:11,
            padding:'10px 14px',display:'flex',flexDirection:'column',alignItems:'center',gap:5,
            boxShadow:'0 1px 3px rgba(0,0,0,.04),0 4px 14px rgba(0,0,0,.06)',
            opacity:0,zIndex:14}}>
            <svg width="30" height="18" viewBox="0 0 32 20"><rect width="32" height="20" rx="2" fill="#CB3837"/><text x="3" y="15" fontFamily="Arial,sans-serif" fontWeight="900" fontSize="14" fill="white">npm</text></svg>
            <div style={{fontSize:10,fontWeight:700,color:'#18181B'}}>npm registry</div>
            <div style={{fontSize:9,color:'#A1A1AA'}}>@facegate/sdk</div>
          </div>

          {/* Travelling package */}
          <div id="fg-pkg-travel" style={{...A,
            background:'#FFF7ED',border:'1.5px solid #F97316',borderRadius:7,
            padding:'4px 9px',fontFamily:'JetBrains Mono,monospace',fontSize:9,fontWeight:600,
            color:'#F97316',whiteSpace:'nowrap',zIndex:30,opacity:0}}>
            📦 @facegate/sdk
          </div>

          {/* User 1 */}
          <div id="fg-u1" style={{...A,
            background:'#fff',border:'1.5px solid #E8E7E4',borderRadius:11,
            padding:'9px 11px',display:'flex',flexDirection:'column',alignItems:'center',gap:4,
            boxShadow:'0 1px 3px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.06)',
            opacity:0,zIndex:5}}>
            <div style={{fontSize:18}}>👤</div>
            <div style={{fontSize:10,fontWeight:700,color:'#18181B'}}>User</div>
            <div style={{fontSize:9,color:'#A1A1AA'}}>Subscriber</div>
          </div>

          {/* User 2 */}
          <div id="fg-u2" style={{...A,
            background:'#fff',border:'1.5px solid #E8E7E4',borderRadius:11,
            padding:'9px 11px',display:'flex',flexDirection:'column',alignItems:'center',gap:4,
            boxShadow:'0 1px 3px rgba(0,0,0,.04),0 4px 12px rgba(0,0,0,.06)',
            opacity:0,zIndex:5}}>
            <div style={{fontSize:18}}>👤</div>
            <div style={{fontSize:10,fontWeight:700,color:'#18181B'}}>User 2</div>
            <div style={{fontSize:9,color:'#A1A1AA'}}>Credential sharer</div>
          </div>

          {/* Caption */}
          <div id="fg-caption" style={{
            position:'absolute',bottom:12,left:'50%',transform:'translateX(-50%)',
            background:'rgba(24,24,27,0.86)',backdropFilter:'blur(10px)',
            color:'#fff',fontSize:12,fontWeight:500,
            padding:'7px 18px',borderRadius:999,
            whiteSpace:'nowrap',zIndex:50,pointerEvents:'none',letterSpacing:'0.01em',
          }}/>
        </div>
      </div>

      {/* ── Bottom stat strip — inline, minimal ── */}
      <div style={{
        maxWidth:960,margin:'48px auto 0',padding:'0 24px',
        display:'flex',alignItems:'center',gap:0,
        borderTop:'1px solid #E8E7E4',paddingTop:28,
      }}>
        {[
          {num:'$9.1B',  label:'lost to credential sharing annually'},
          {num:'3 lines',label:'to integrate FaceGate'},
          {num:'0 bytes',label:'of biometric data stored'},
        ].map((s,i)=>(
          <div key={s.num} style={{display:'flex',alignItems:'center',gap:0,flex:1}}>
            {i>0&&<div style={{width:1,height:28,background:'#E8E7E4',marginRight:32,flexShrink:0}}/>}
            <div style={{display:'flex',alignItems:'baseline',gap:10}}>
              <span style={{fontSize:22,fontWeight:700,letterSpacing:'-0.04em',color:'#18181B'}}>{s.num}</span>
              <span style={{fontSize:12,color:'#A1A1AA',fontWeight:500,letterSpacing:'-0.01em'}}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  )
}