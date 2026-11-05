# Browser-local AI trial

User approved adding opt-in model-download/progress and chat interactions while preserving the accepted styling. Existing CSS, logo, colors and layout are unchanged.

Chat offers Download & load AI. It loads the actual WebLLM SmolLM2-135M-Instruct-q0f32-MLC model after explicit action. No provider signup, API key, hosted inference charge or paid fallback. Model/runtime downloads contact the package's configured Hugging Face/MLC hosts; data transfer, device storage/memory/power and hardware requirements still apply. Model download is hundreds of MB; cached files may be evicted. A tiny 135M model is a trial, not a frontier model or tool-capable agent. Outputs can be poor or incorrect. No accounts, code execution or external tools are connected.

Generation uses local WebGPU, six recent messages, max 128 output tokens; conversation is in-memory only. Text is inserted safely, not rendered as HTML. No raw error body or simulated reply is shown. Failure restores the draft. No provider fallback occurs.

Run npm install, npm run build, then npm run dev. The local server serves the bundled frontend from dist; rebuild after source changes. Static dist can serve the trial independently of the optional server APIs. WebGPU requires a supported browser/device and secure context (HTTPS or localhost).

Tests distinguish unloaded/no-GPU failure checks from actual inference. The local Chromium attempt found navigator.gpu but no compatible adapter, so model startup failed honestly and no real model answer was generated. Live inference is NOT verified from that attempt. A supported device and accessible model/runtime downloads are required to complete verification.

A second real attempt enabled software WebGPU: an adapter became available, but fetching the actual model configuration failed with net::ERR_NAME_NOT_RESOLVED for huggingface.co in this sandbox. No model answer was generated. This is a test-environment network blocker, not proof that the model works on a user's device. Do not claim live AI is connected until model load AND a real generated turn succeed there.
