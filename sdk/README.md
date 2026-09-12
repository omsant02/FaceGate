# @facegate/sdk

Stop credential sharing with privacy-preserving face authentication.

Zero biometric data stored. One API key. Four functions.

## Install

```bash
npm install @facegate/sdk @worldcoin/idkit
```

> `@worldcoin/idkit` must be installed directly in your app alongside this SDK. Due to a WebAssembly bundler constraint, the IDKit QR widget cannot be resolved from a nested dependency — it must be a direct dependency of your app.

## Quick Start

Get your API key at [face-gate-ecru.vercel.app](https://face-gate-ecru.vercel.app)

```typescript
import { FaceGate } from '@facegate/sdk'

const gate = new FaceGate({ apiKey: 'fg_live_xxx' })

// Check if user is enrolled
const { enrolled } = await gate.check(userId)

// New user — get enrollment data for IDKit widget
const enrollData = await gate.enroll(userId)

// After user completes Selfie Check — confirm enrollment
await gate.confirm(userId, idkitProof)

// Returning user — verify same face
const { authorized } = await gate.verify(userId, idkitProof)
```

## How it works

1. User visits your app → call `check()` → not enrolled
2. Call `enroll()` → get QR data → show IDKit widget
3. User scans with World App → Selfie Check runs
4. Call `confirm()` → face enrolled, nullifier stored
5. User returns → call `verify()` → same face → authorized
6. Different face → different nullifier → blocked

## Privacy

- Zero biometric data stored anywhere
- Only cryptographic nullifiers stored
- Built on World ID Selfie Check

## Links

- [Dashboard](https://face-gate-ecru.vercel.app)
- [Demo](https://demo-netflix-green.vercel.app)
- [GitHub](https://github.com/omsant02/FaceGate)
- [npm](https://npmjs.com/package/@facegate/sdk)
- [World ID Selfie Check](https://docs.world.org/world-id/credentials/11)