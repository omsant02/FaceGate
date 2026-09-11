# FaceGate — World ID Selfie Check Feedback

**Project:** FaceGate — Credential Sharing Prevention SDK  
**Built at:** ETHGlobal Online 2026  
**Team:** Om Santoshwar  

---

## Feedback

### 1. Selfie Check Docs, Integration Flow, and Sandbox App

**What worked well:**

The Selfie Check credential page is well-written. The positioning as a medium-assurance signal is clear and useful — liveness detection, abuse resistance, and continuity are the right frames for what it actually does. For our use case (preventing credential sharing on subscription platforms), the continuity signal is exactly what we needed: not "prove you're unique" but "prove you're the same person who signed up." The docs articulate this distinction well.

The RP signature flow is secure and well-designed. Once understood, `signRequest` from `@worldcoin/idkit-core/signing` worked exactly as described. The nullifier-per-app-per-action design is elegant for multi-tenant architectures.

**What was confusing:**

**1. The QR scanning flow is not documented.** When testing Selfie Check, the correct flow is to scan the IDKit-generated QR code using the device's native camera app, which then deep-links into the Sandbox app. This is not mentioned anywhere in the Selfie Check testing docs. As a developer, the natural assumption is that the Sandbox app itself has a QR scanner — it does not. Explicitly documenting this flow, and ideally adding a built-in QR scanner to the Sandbox app, would immediately unblock developers hitting this for the first time.

**2. The Sandbox app does not feel like a testing environment.** It looks and behaves identically to the production World app — same credential screens, same verification requirements. Even after receiving Selfie Check access approval, the credentials page shows "Face credential — Coming Soon." A developer who opens the Sandbox app without knowing about the QR scan flow will find nothing to indicate Selfie Check is available or how to trigger it. The credentials page also shows Orb verification as the primary flow, requiring a real Orb device — identical to production. The Sandbox app should be visually and functionally distinct from the production app so developers immediately understand they are in a testing environment.

The app also surfaces partner integrations — Tinder, Zoom, and others — as featured content, which reinforces the impression that this is a production app rather than a developer testing tool. A Sandbox app should prioritize testing utilities (like a QR scanner) over marketing content.

---

## 2. Developer Portal Navigation

**Production verification flow shown for all apps.** The Developer Portal shows a verification flow — basic information, availability, localized content review, and confirmation — that is intended for production app publishing. For a developer building a prototype, demo, or hackathon project, this flow appears mandatory and is confusing. It should be clearly labeled as optional and relevant only for production apps, so developers testing Selfie Check integration do not spend time on it unnecessarily.

---


### 3. Critical Technical Issue — WebAssembly Bundling

FaceGate is a provider SDK — subscription platforms like Netflix install our package (`@facegate/sdk`), and we handle all World ID communication internally. The developer never touches World ID directly.

Our goal was to also include the IDKit QR widget inside our SDK, so developers truly only need one package. This turned out to be impossible due to a WebAssembly bundling constraint.

`@worldcoin/idkit` loads a WebAssembly file at runtime for the QR widget. When it sits inside our SDK as a nested dependency, the developer's app cannot find that file — bundlers like webpack only resolve WebAssembly files from direct dependencies, not nested ones. This is a known webpack 5 limitation, not specific to World ID, but it is not mentioned anywhere in the IDKit documentation.

The result: any developer building a wrapper SDK on top of IDKit must always require their users to also install `@worldcoin/idkit` directly. This breaks the single-package experience that makes wrapper SDKs valuable.

The IDKit README does document pure JS subpath exports for server-side use (`/signing`, `/hashing`) with no wasm dependency — which is helpful. But the wasm constraint for the React widget is undocumented and only discoverable through trial and error.

**Suggestion:** Add a note to the IDKit README: "If you are building an SDK that wraps the IDKit widget, consumers must install `@worldcoin/idkit` as a direct dependency in their app due to WebAssembly bundler resolution constraints."

---

### What Worked Well

- **The Selfie Check flow itself is excellent.** Once past the setup confusion, the face scan experience is smooth, fast, and feels production-quality. Liveness detection worked reliably in our testing.
- **The proof verification API is straightforward.** Posting the IDKit response to `/api/v4/verify/{rp_id}` works exactly as documented with no field remapping needed.
- **Nullifier-based identity is the right primitive.** The same person always produces the same nullifier for a given app and action. This made our multi-tenant architecture work perfectly — one World ID app powering many downstream platforms, each with isolated nullifiers.
- **The World App UX is genuinely impressive.** The "Checking you're a real, live unique human" screen builds appropriate trust with end users.
- **Discord support was responsive.** The World team answered questions quickly and granted Sandbox access promptly.

---

## Summary

Selfie Check is a genuinely useful primitive for continuity and abuse prevention. The core technology works well. The main friction points are around the Sandbox testing experience (QR flow not documented, app feels like production), the Developer Portal verification flow appearing mandatory for all apps, and the WebAssembly bundling constraint that blocks SDK authors from shipping a clean one-package integration. Addressing these three points would significantly lower the barrier for developers building on Selfie Check.