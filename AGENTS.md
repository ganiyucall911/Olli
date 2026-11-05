# Olli requirements

Read docs/product-decisions.md. taOS is the UI/UX reference THROUGHOUT Olli, never a runtime dependency. Preserve the retained personal-assistant scope plus GitHub tools. Never present disconnected features as working. No paid resources, card entry, paid fallback or execution on the web host. Do not commit secrets. Keep working browser-local features free of dependencies and test behavior with node --test; verify rendered changes in a browser.
