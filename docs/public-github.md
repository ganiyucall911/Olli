# Credential-free public GitHub connection

The local Node server now routes GET /api/github/repository?repo=owner/repository to GitHub's public REST API. It requires no model account, token or payment method. It reads public repository metadata only; it does not access private repositories, write issues/PRs or run code.

Fixed api.github.com destination, owner/name validation, redirect denial, eight-second timeout and 128 KiB response limit. No upstream raw errors or credentials are returned. Rate-limit errors stop without fallback. GitHub's shared unauthenticated allowance can be exhausted; no unlimited availability is promised. Before public deployment, add abuse/rate protection and review hosting/runtime configuration. Static dist output does not run this backend.

Tests use actual local HTTP with mocked GitHub responses. Live requests from this adapter have NOT been verified because ordinary sandbox egress does not support arbitrary GitHub API access. Do not describe a passing mock as a live integration test.

The approved frontend is unchanged; browser navigation still reports disconnected. Wiring user-facing inputs/results changes the frozen interaction design and needs a specific approved proposal first. This is a real server-side adapter, not a completed user-facing connection.
