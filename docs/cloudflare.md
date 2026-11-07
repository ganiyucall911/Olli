# Cloudflare Workers + Workers AI target

This adds a Worker deployment target serving dist assets and a guarded POST /api/chat endpoint through env.AI. No separate model-provider API key is embedded. Cloudflare account authorization is still required to deploy/use the binding. No deployment or real inference was performed by this change.

## Account activation (owner performs)

1. Create/sign into your Cloudflare account. Keep Workers/Workers AI on Free for this project; do not upgrade or enable paid billing to increase quotas. Check current model eligibility and limits in the dashboard. No assertion here guarantees permanent free availability.
2. Run npm ci and npm run build. Wrangler deploy --dry-run validates the local bundle without deploying.
3. On a computer you control, run npx wrangler login. Complete Cloudflare's own consent. Never send the login token or account secrets in chat.
4. Configure a Cloudflare Access self-hosted application/policy for the actual deployed hostname, and verify it gates intended users. Set ACCESS_TEAM_DOMAIN (https://your-team.cloudflareaccess.com) and ACCESS_AUD (that application's audience tag) in the Worker configuration/dashboard. These are identifiers, not model API keys. Do not use example values as real account details.
5. Deploy initially with OLLI_AI_ENABLED=0 (the committed default): npx wrangler deploy. Test Access sign-in and that direct unauthorized API calls return 401 after configuration (503 while disabled). Use actual deployed hostname for Access, not a guessed domain.
6. Only after policy review and confirming Free model eligibility, set OLLI_AI_ENABLED=1 in Worker configuration. A signed, issuer/audience/expiry-validated Access request can then call /api/chat. Verify one real generated reply and check Workers AI usage. Do not represent a mocked binding test as that verification.

Cloudflare Access is a temporary deployment access gate, NOT a completed Olli-account/signup implementation. Browser chat still uses the existing WebLLM trial: this commit deliberately does not silently switch the UI runtime or remove the download flow. Completing hosted browser chat requires authorized deployment, real Access/session behavior testing and the specific user-approved interaction adjustment. No redesign is included.

## Model and limits

Model: @cf/meta/llama-3.1-8b-instruct (documented Workers AI binding example). Model eligibility, policy and output quality still need real account validation. Model errors/quota failures stop with 503; no retry, model rotation, paid fallback or provider key. The Worker invokes at most 256 output tokens per request. No tools or external actions enabled.

Free Workers AI currently advertises 10,000 Neurons/day; some models require paid access. Sources:
- https://developers.cloudflare.com/workers-ai/configuration/bindings/
- https://developers.cloudflare.com/workers-ai/platform/pricing/
- https://developers.cloudflare.com/cloudflare-one/access-controls/applications/http-apps/authorization-cookie/validating-json/

## Safety boundary and incomplete work

The Worker denies unconfigured/unauthorized requests before reading bodies or invoking AI. Manual Access JWT verification pins issuer and audience; header presence alone is not authorization. Body cap 32 KiB; at most 12 user/assistant messages, 4,000 characters each; client system-role messages denied. Cross-origin requests denied, no CORS grants. API responses no-store; raw provider errors are not exposed. Unknown /api paths never serve assets.

No durable chat storage, Olli multi-user sessions, per-user quotas/concurrency controls, tools, account connections or cancellation/streaming implemented. Add those before any public launch. Access-controlled preview/testing only. Cloudflare is not connected to this assistant's tools, so owner-side deployment/consent is required; do not claim a hosted connection from this local bundle. Existing browser styling and local model implementation remain unchanged.
