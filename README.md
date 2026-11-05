# Olli — fresh start

Original taOS-inspired UI/UX throughout a personal-assistant workspace. taOS is a design reference, not an installed OS or runtime. No old Git history is imported.

## Run

Requires Node.js 22+. No package dependencies.

```sh
npm test
npm run build
npm run dev
```

Open http://127.0.0.1:3018. `dist/` is the static frontend output.

## What works now

Application navigation, responsive desktop-style shell, accessible feature surfaces, and a browser-local list with add/check/remove and reload persistence. List data stays in this browser; it is not account-isolated, encrypted or backed up. Do not store sensitive information here.

## What does not work yet

A disabled-by-default server-side chat API is available for local development (see [backend setup](docs/chat-backend.md)); it is not wired to the UI or activated with a live model. User authentication, cloud storage, execution, external connections, document/image generation, reminder scheduling and outbound delivery are not implemented. Their screens deliberately show unavailable status. A feature appearing in navigation is NOT a working integration.

No credentials are collected and no commands execute. No paid fallback or hosting is configured. Free provider/account eligibility remains a blocker for real sandbox execution. A sleeping executor requires an independent scheduler to wake for reminders.

See docs/product-decisions.md. This is a first foundation PR, not a completed assistant or production release.
