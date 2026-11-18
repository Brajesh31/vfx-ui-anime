---
name: vfx-ui-anime
description: Design, extend and integrate the VFX UI Anime Web Components library.
---

# VFX UI Anime agent skill

## Goal
Help developers integrate or extend the project's native custom elements without introducing unnecessary dependencies or weakening browser semantics.

## Before editing
1. Read the root README and `docs/COMPONENTS.md`.
2. Inspect the target component's `index.js`, README, and demo. Determine whether it is one of the eleven standalone animated controls or one of the four controls backed by `core.js`.
3. Identify the host application's framework, browser targets and form requirements.
4. Preserve the no-dependency design unless the user explicitly requests otherwise.

## Integration workflow
1. For Button, Toggle, Slider, Checkbox, Radio, Input, Tabs, Progress, Rating, Toast, and Tooltip, load the selected component script directly. For Like, Accordion, Segmented, and Notification, load `core.js` first.
2. Load `styles.css` only if the host wants the demo theme. Components should not depend on gallery layout styles.
3. Add the custom element to the relevant page.
4. Use documented attributes, properties, methods and events.
5. Wire application state explicitly. Do not assume that every component automatically manages associated content or application state.
6. Test keyboard interaction, reduced motion, form submission where applicable, and narrow viewports.

## Extension rules
- Prefer native controls and native keyboard semantics.
- Keep custom element registration idempotent.
- Use Shadow DOM to isolate component styles.
- Dispatch bubbling, composed custom events for host integrations.
- Keep canvas effects decorative and hidden from assistive technology.
- Respect `prefers-reduced-motion`.
- Document every public API change.
- Do not invent APIs that are not implemented.
- Do not claim full accessibility or browser support without evidence.

## New component checklist
- [ ] Unique `vfx-*` custom element name.
- [ ] Native semantic control where practical.
- [ ] Keyboard and focus behavior.
- [ ] Accessible name and state.
- [ ] Reduced-motion behavior.
- [ ] Host-facing events documented.
- [ ] Gallery demo added.
- [ ] Static validation passes.
- [ ] Manual browser tests recorded.

## Known limitations
Read `docs/ACCESSIBILITY.md` before making claims about forms, tabs, radio navigation, screen readers or browser compatibility.
