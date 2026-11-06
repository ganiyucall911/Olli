# Olli: settled product decisions

## Design: taOS-inspired everywhere

The entire application uses a taOS-inspired design language: desktop-like shell, dock/launcher navigation, window/panel surfaces, consistent icons, typography, spacing and interaction states. This applies to setup, authentication, chat and every retained feature screen, not one optional desktop view. taOS is a visual/interaction reference only, NOT an operating system to install, an execution framework or a host. Use original components and licensed icon assets, not copied taOS source/assets without license review.

## Retained features

- Shopping comparisons and price tracking.
- Travel, events, maps, places and transportation lookups.
- Hosted payment links and receipt tracking; no raw-card handling, arbitrary autonomous purchasing or claims that processing fees are free.
- Personal email and agent inbox, calendar/ICS, Notion and named lists.
- Stickers and personal-profile memory.
- Documents, spreadsheets, design/images and creations (including generated apps).
- Personal reminders and non-Slack messaging adapters.
- GitHub tools.
- Foundations: basic chat, authentication, storage, configured model connectivity, essential search/research helpers, shell/file/code tools required to perform retained tasks.

Retained code does not mean an external service is connected. Expose configuration, quota and unavailable states honestly. The new public platform must not execute tools against the shared Python owner runtime.

## Retired feature scope

Remove Tesla, general desktop/browser control, model catalogue/download/evaluation product features, agent teams/handoffs/opinion panels, recorded-workflow replay and temporary GitHub runner orchestration. Do not keep an inbound Slack worker solely because development discussion happens in Slack. Preserve non-Slack adapters and all helpers required by retained features. Generic unrelated coding-product features and goals are outside the whitelist, but essential execution for creations and GitHub remains.

Retire entrypoints as well as source. Existing owner-installed skill copies must not silently re-enable retired bundled tools; do not erase owner data to achieve this. Remove Docker-computer deployment only after a tested replacement execution boundary exists.

## Execution, independent of design

Olli's model plans and invokes tools. A separate on-demand Linux sandbox executes commands and code, then saves results and stops. No full graphical desktop is required. taOS is not installed in the sandbox.

No card, paid plan, paid upgrade or paid fallback is allowed. Candidate providers must pass eligibility checks for recurring free allowances, sleep/resume, persistence, runtime limits and API access. A declaration in application configuration cannot guarantee the provider's bill. Current Pro resources must not be treated as free Hobby resources.

No eligible provider/account has yet been verified. Until that is resolved, hosted execution must report unavailable; do not fall back to the web server's shell. Sleeping execution cannot wake itself for reminders: scheduling requires a separately verified trigger and durable state.

## Delivery

Start from the new initial main commit. Do not import old Git history. Publish a reviewable first PR; no production cutover, credentials, billing changes or cloud provisioning.

## Real asset requirement

Use real, properly licensed SVG icons and genuine assets throughout Olli. No emoji/Unicode stand-ins, placeholder artwork or fake content presented as real. Vendor assets with provenance/license; do not copy taOS assets without permission.

## Accepted design freeze

The user has accepted the current design for now. No visual or interaction design changes are permitted without their explicit request or approval of the specific change. Preserve the current graphite palette/materials, O/LL identity, real SVG assets, macOS-style traffic-light controls, dock/launcher, centered chat column, typography, spacing and motion/responsive treatment.

If a change is necessary (including for accessibility, functional implementation, security or dependencies), explain the reason and proposed design impact before editing, and wait for approval. A general instruction to continue implementation is not approval to alter design. Functional work should use the existing design system without modifying it.

## Approved on-device direction

Users approved model weights downloaded with app setup and inference on their own devices. First delivery is an installable web app (PWA), NOT a native Android/iOS binary. Preserve accepted visual styling. App-shell caching is a bounded explicit offline asset list, separate from WebLLM's potentially large model cache. No chat/API/credential response caching. WebGPU and successful model downloads remain device requirements; no universal phone compatibility or verified offline model response is claimed.
