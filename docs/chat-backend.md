# Server-side chat foundation

Status: implemented for local API testing, NOT activated or connected to the frozen chat UI. The static `dist/` output does not contain/run this API. Hosting the server requires a separately reviewed Node deployment; no hosting configuration is changed here.

`npm run dev` starts the existing loopback-only local server. `POST /api/chat` accepts `{ "messages": [{ "role": "user", "content": "Hello" }] }`. This is an owner/API development boundary, not user/session authentication or a multi-tenant service. Browser-origin requests are denied and no CORS headers are provided. Do not distribute the bearer token to browser code or make this server public as a production service.

## Configuration (owner enters directly in host secret settings)

- OLLI_CHAT_ENDPOINT: complete HTTPS OpenAI-compatible chat-completions URL; no query, fragment or URL credentials. Operator-owned configuration only, never a browser input.
- OLLI_CHAT_MODEL: actual model identifier.
- OLLI_CHAT_API_KEY: provider credential, server-only.
- OLLI_CHAT_TOKEN: separate random owner API token, at least 32 characters.
- OLLI_CHAT_FREE_CONFIRMED=1: acknowledgement that the operator has independently verified a free model/account with no paid fallback or auto-upgrade. This does NOT verify provider billing or guarantee zero cost. Leave unset until verified.

Missing configuration returns 503 before any provider request. No default endpoint/model, provider retry, paid fallback, tools or shell execution exists. No credentials have been entered and no live model request has been tested. Do not send secret values in chat or commit environment files.

## Bounds and evidence

API requires bearer auth before buffering, rejects browser Origin and non-JSON, caps bodies at 32 KiB, permits only user/assistant messages (1–20, each up to 8,000 characters, last user), and supplies its own system instruction. Provider requests do not follow redirects, have a 15-second transport/body timeout, cap received body at 128 KiB and returned text at 16,000 characters, and request at most 1,024 output tokens. Provider raw error bodies/credentials are never returned. This is not a general prompt-secret redaction system.

Node tests exercise actual loopback HTTP plus a mocked provider transport. They cover disabled configuration, unauthorized requests, browser-origin rejection, malformed/oversized/role-invalid bodies, accepted response, server source not being served, one-attempt errors, response bounds and timeout. This does not prove a real provider's pricing, credential validity or runtime behavior on a deployed host.

## Required before browser activation

1. Real session authentication and owner-scoped durable conversations.
2. Per-user quotas/concurrency/rate limiting and abuse protection before public exposure.
3. Verified no-card/free hosting and model account, with separate storage/scheduler decisions.
4. Live deployment tests; do not treat the static frontend as an API host.
5. Obtain approval first for any required visible/interaction change under the design freeze. This change leaves every frontend design file unchanged.
