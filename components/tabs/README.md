# Tabs component

Keyboard-friendly tabs with linked content panels.

## Live demo
Open [demo.html](demo.html) to test the component in the library's design system.

## Installation
```html
<link rel="stylesheet" href="/styles.css">
<script defer src="/core.js"></script>
<script defer src="/components/tabs/index.js"></script>
<vfx-tabs label="Sections" items="Overview,Features,Details"><p slot="Overview">Overview.</p><p slot="Features">Features.</p><p slot="Details">Details.</p></vfx-tabs>
```

## Component details
- **Element:** `<vfx-tabs>`
- **Category:** Navigation
- **Runtime dependencies:** None

## Accessibility
Keep labels descriptive, preserve keyboard access, and test focus, form behavior, and screen-reader output in the browsers you support. The shared motion engine respects `prefers-reduced-motion`.

See the [component API overview](../../docs/COMPONENTS.md) for the public inventory and links to detailed guidance.
