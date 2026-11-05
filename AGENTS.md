# Olli requirements

Read docs/product-decisions.md. taOS is the UI/UX reference THROUGHOUT Olli, never a runtime dependency. Preserve the retained personal-assistant scope plus GitHub tools. Never present disconnected features as working. No paid resources, card entry, paid fallback or execution on the web host. Do not commit secrets. Keep working browser-local features free of dependencies and test behavior with node --test; verify rendered changes in a browser.

## Real asset requirement

Use real, properly licensed SVG icons and genuine assets throughout Olli. No emoji/Unicode stand-ins, placeholder artwork or fake content presented as real. Vendor assets with provenance/license; do not copy taOS assets without permission.

## Design freeze — explicit approval required

The current design is accepted and frozen. Do not change visual or interaction design unless the user explicitly requests or approves the specific change. This includes layout/alignment, colors/materials, typography, logo/icons/assets, spacing, window controls, dock/launcher, hover/motion and responsive presentation.

If functional, accessibility, security or dependency work requires a design change, explain the need and proposed visible/interaction difference to the user FIRST and obtain approval before implementing it. General permission to build features, refactor, fix bugs or proceed does not lift this freeze. Preserve the accepted design during functional work. Do not silently redesign or auto-apply visual polish.
