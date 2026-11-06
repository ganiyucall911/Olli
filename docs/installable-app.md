# Installable on-device Olli

First implementation: a PWA, not a native app-store binary. Serve npm run build output dist over HTTPS, open in a supported browser and use its Install/Add to Home Screen action when available. Manifest uses original Olli artwork at 192/512 px. No visual styling changes.

Model files are NOT inside the initial app bundle. Explicit Download & load AI action downloads WebLLM's actual model/runtime files; successful downloads may be cached by WebLLM. Device storage, memory, WebGPU support, internet data and download-host availability are required. Current model remains the small SmolLM2 135M trial, NOT newly trained Olli weights or a capable autonomous tool agent. No universal mobile support promised.

Offline app shell uses one explicit bounded same-origin asset list (app JS/CSS, manifest, logo/icons). It excludes chat/API responses, credentials and external models; old Olli shell-cache versions are deleted on activation. The app must have completed an online visit/install before its shell can work offline. Browser model cache is separate, can be evicted, and successful offline inference is NOT verified. The service worker does not automatically download model weights.

Local mobile Chromium verified service-worker control and offline reload of app shell/chat entry after initial online visit. Real model generation remains blocked in this test environment by missing default GPU adapter and model-download DNS failure (see browser-ai.md). Native iOS/Android installation and real device inference remain unverified. Olli account authentication/cross-device sync are not implemented by local packaging.
