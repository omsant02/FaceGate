# FaceGate

> One account. One face. No sharing.

Netflix loses **$9.1 billion** annually to credential sharing. The password is correct — but the person isn't. FaceGate fixes this.

FaceGate is a developer SDK that adds face continuity verification to any subscription platform. Using World ID Selfie Check, it treats biometric identity as a **continuity and abuse-prevention signal** — confirming the same person returns on every login, not just the same password. This creates meaningful friction: even coordinated sharing requires the original account owner to be actively available for every single login, making casual credential sharing impractical. Zero biometric data stored.

---

## The Problem

One Netflix account. Five households using it. The platform loses revenue on every shared account. Password-based auth has no way to enforce "one person per account."

Current solutions — household IP detection, device limits — are easily bypassed with a VPN or device switch. They detect location, not identity.

FaceGate detects identity.

---

## How It Works

Just Plug it into your existing authentication flow — after signup and after login. That's it.

1. **Signup** — user enrolls their face via World ID Selfie Check
2. **Every login** — user verifies same face → same cryptographic nullifier → access granted
3. **Different face** — different nullifier → no match → blocked

 See [`demo-netflix/lib/facegate.ts`](./demo-netflix/lib/facegate.ts) for a complete integration in one file, and [`demo-netflix/`](./demo-netflix/) for a full working example.

FaceGate is a **provider model** — one World ID account powers all downstream platforms. Each developer gets an API key and a unique action string, ensuring nullifier isolation across platforms. The same person on Netflix and Spotify produces different nullifiers — unlinkable across apps.

---

## Quick Start

### 1. Get your API key

Visit [face-gate-ecru.vercel.app](https://face-gate-ecru.vercel.app) → sign in with Google → generate your API key.

### 2. Install

```bash
npm install @facegate/sdk @worldcoin/idkit
```

### 3. Add to your auth flow

**On signup — enroll face:**
```typescript
import { FaceGate } from '@facegate/sdk'

const gate = new FaceGate({ apiKey: 'fg_live_xxx' })

// After your existing signup
const enrollData = await gate.enroll(userId)

// Show IDKit widget with enrollData → user scans QR → Selfie Check runs
await gate.confirm(userId, idkitProof)
```

**On every login — verify face:**
```typescript
// After password check passes
const enrollData = await gate.enroll(userId)

// Show IDKit widget → same face = granted, different face = blocked
const result = await gate.verify(userId, idkitProof)

if (!result.authorized) {
  throw new Error('Access blocked — face not recognized')
}
```

---

## SDK Reference

| Method | When to call | What it does |
|--------|-------------|--------------|
| `gate.enroll(userId)` | Signup + every login | Returns `rpContext`, `appId`, `action` for the IDKit widget |
| `gate.confirm(userId, proof)` | After first face scan | Stores the nullifier — completes enrollment |
| `gate.verify(userId, proof)` | After returning face scan | Checks nullifier matches → returns `{ authorized: boolean }` |
| `gate.check(userId)` | Optional | Returns `{ enrolled: boolean }` to decide which flow to show |

---

## Why Selfie Check

Selfie Check is a medium-assurance biometric credential — liveness detection without requiring Orb verification. It is the right tool for subscription abuse prevention because it works as a:

- **Continuity signal** — same person returning, not just same password
- **Abuse-prevention signal** — eliminates passive credential sharing entirely
- **Fairness signal** — ensures each paying account is used by its rightful owner
- **Friction by design** — coordinated sharing requires real-time effort on every login, making it impractical at scale
- **Liveness detection** — prevents photo and video spoofing
- **Zero biometric storage** — only cryptographic nullifiers stored

---

## Privacy

FaceGate stores nothing about the user's face. The Selfie Check runs on the user's device. What gets stored:

- A nullifier — a cryptographic hash derived from the user's World ID, the app, and the action. It proves continuity without revealing identity.
- Nothing else. No images, no biometric data, no personal information.
- Different apps produce different nullifiers — unlinkable across platforms.

---

## Demo

See [`demo-netflix/`](./demo-netflix/) — a Netflix-style streaming app showing FaceGate integration end to end. Sign up, enroll your face, content unlocks. Sign in from a different face — get blocked.

**Live demo:** [demo-netflix-green.vercel.app](https://demo-netflix-green.vercel.app)

---

## Repo Structure

facegate/
├── server/ — Next.js backend + developer dashboard
├── sdk/ — @facegate/sdk npm package
├── demo-netflix/ — Netflix-style demo app
└── FEEDBACK.md — World ID Selfie Check developer feedback

---

## Links

- **Dashboard:** [face-gate-ecru.vercel.app](https://face-gate-ecru.vercel.app)
- **Demo:** [demo-netflix-green.vercel.app](https://demo-netflix-green.vercel.app)
- **npm:** [@facegate/sdk](https://npmjs.com/package/@facegate/sdk)
- **Built at:** ETHGlobal Online 2026 — World ID Selfie Check prize track