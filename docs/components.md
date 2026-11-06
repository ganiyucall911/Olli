# Approved Olli component system

The supplied graphite references guide original UI components, not copied screenshots or fake product metrics. Implementation: src/components/ui.js.

- panel: shared raised graphite surface, optional real local SVG badge, safe heading/description text.
- action: explicit button/submit type, accessible label, disabled state and graphite styling.
- field: reusable text/textarea input with label, length bound and disabled state.
- status: consistent live status text.
- icon: existing licensed local SVGs; names validated before asset path construction.
- appButton: one shared implementation used for both dock and launchpad.

Chat uses panels, download/send actions, bounded composer and status. Lists use the same actions/fields. Every disconnected feature uses the same panel, icon and status pattern. Logo, graphite palette, traffic-light controls and centered chat are retained. External feature panels remain honest disconnected states; component reuse does not create working integrations.

Local browser evidence: existing navigation/list/window/launcher and hover/focus/reduced-motion regressions passed; direct component checks verified safe text, no script/HTML injection, invalid icon-name rejection, explicit button type, disabled action and field limits. Shared panels rendered at 1280×800 and 390×844 with no page errors or horizontal page overflow. Real model generation is not covered or claimed by these design checks. Hosted preview remains unverified.
