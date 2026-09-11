# FaceGate

## What We Built

Netflix loses revenue every time one paid account is shared across five households. The password is correct — but the person isn't. FaceGate treats Selfie Check as a **continuity and abuse-prevention signal**: every login must prove not just knowledge of a password, but that the same face is returning.

FaceGate is a provider SDK — a thin abstraction layer so that subscription platforms (streaming, SaaS, gaming, education) can add World ID Selfie Check without touching World ID directly. The platform developer gets one API key from FaceGate. Our server holds the World ID credentials and handles all proof verification internally. Each developer gets a unique action string, ensuring nullifier isolation across platforms — the same person on Netflix and Spotify produces different nullifiers.

**The integration from a developer's perspective:**
- Signup → `gate.enroll(userId)` → show IDKit QR → user completes Selfie Check → face enrolled
- Every login → `gate.verify(userId, proof)` → same face → same nullifier → access granted; different face → blocked

**On friction vs bypass:** Selfie Check creates meaningful friction, not a perfect lock. A determined user could share a QR code screenshot with someone else — the same way someone could share an OTP. FaceGate treats this the same way Netflix treats household IP checks: a signal that raises the cost of abuse, not an absolute barrier. For stronger guarantees (single-person accounts, IP binding, device fingerprinting), the platform layer adds those controls. FaceGate handles the biometric continuity signal.

**Architecture:** Provider/wrapper model. One World ID app, many downstream platforms via unique per-developer action strings.

---

**One account. One face. No sharing.**

FaceGate stops credential sharing on subscription platforms using World ID Selfie Check. It adds continuity verification — confirming that the same person returns on every login, not just the same password — creating meaningful friction against account abuse without storing any biometric data.

Built for streaming services, SaaS platforms, gaming, education, and any subscription product where credential sharing costs revenue. Netflix, Spotify, Disney+, Adobe — the problem is the same: one paid account, shared by many.

---

## How it works

FaceGate sits between your authentication and your content:

1. **Signup** → user enrolls their face via World ID Selfie Check
2. **Every login** → user verifies same face → same nullifier → access granted
3. **Different face** → different nullifier → no match → blocked

Zero biometric data stored. Only a cryptographic nullifier — a per-app, per-person hash that proves continuity without revealing identity.

Developer's App → @facegate/sdk → FaceGate Server → World ID Selfie Check


FaceGate holds one World ID account. Developers get an API key. Our server handles all World ID communication internally — developers never touch World ID credentials directly.

---

## Quick Start

### 1. Get an API key

Visit [face-gate-ecru.vercel.app](https://face-gate-ecru.vercel.app) → sign in → generate your API key.

### 2. Install

```bash
npm install @facegate/sdk @worldcoin/idkit
```

### 3. Initialize

```typescript
import { FaceGate } from '@facegate/sdk'

const gate = new FaceGate({ apiKey: 'fg_live_xxx' })
```

### 4. Enroll on signup

```typescript
// After your existing signup flow
const enrollData = await gate.enroll(userId)

// Show IDKit widget with enrollData
// → user scans QR with World App → Selfie Check runs
await gate.confirm(userId, idkitProof)
```

### 5. Verify on every login

```typescript
// After password check passes
const enrollData = await gate.enroll(userId)

// Show IDKit widget with enrollData  
// → user scans QR → same face = authorized, different face = blocked
const result = await gate.verify(userId, idkitProof)

if (!result.authorized) {
  throw new Error('Face not recognized — access blocked')
}
```

---

## SDK Reference

### `gate.enroll(userId)`
Returns `rpContext`, `appId`, and `action` needed to show the IDKit widget. Safe to call on every visit — returns rpContext even if already enrolled.

### `gate.confirm(userId, proof)`
Stores the nullifier after first enrollment. Call this in IDKit's `handleVerify` callback on signup.

### `gate.verify(userId, proof)`
Checks if the returning face matches the enrolled nullifier. Call this in IDKit's `handleVerify` callback on login.

### `gate.check(userId)`
Returns `{ enrolled: boolean }`. Use this to decide whether to show the enroll or verify flow.

---

## Why Selfie Check

Selfie Check is a medium-assurance biometric credential — it confirms **liveness** and **continuity** without requiring Orb verification. This makes it ideal for subscription abuse prevention:

- No Orb required — any World ID user can complete it
- Liveness detection — prevents photo/video spoofing  
- Continuity — same person returning, not just same password
- 90-day validity window — periodic re-verification built in
- Zero biometric storage — only cryptographic nullifiers

---

## Privacy

- No face images stored anywhere
- No biometric data leaves the user's device
- Only nullifiers stored — cryptographic hashes that prove continuity without revealing identity
- Different apps produce different nullifiers — unlinkable across platforms

---

## Repo Structure

facegate/
├── server/ — Next.js backend + developer dashboard (deployed on Vercel)
├── sdk/ — @facegate/sdk npm package
├── demo/ — StreamVault demo app (coming)
└── FEEDBACK.md — World ID Selfie Check developer feedback


---

## Built at ETHOnline 2026

World ID Selfie Check prize track — abuse prevention via continuity verification.

**Live:** [face-gate-ecru.vercel.app](https://face-gate-ecru.vercel.app)  
**npm:** [@facegate/sdk](https://npmjs.com/package/@facegate/sdk)