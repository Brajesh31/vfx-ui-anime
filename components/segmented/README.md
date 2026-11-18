# Segmented component

A single-choice segmented control with arrow navigation.

## Live demo
Open [demo.html](demo.html) to test the component in the library's design system.

## Installation
```html
<link rel="stylesheet" href="/styles.css">
<script defer src="/core.js"></script>
<script defer src="/components/segmented/index.js"></script>
<vfx-segmented label="Time range" value="Week"><option value="Day">Day</option><option value="Week">Week</option><option value="Month">Month</option></vfx-segmented>
```

## Component details
- **Element:** `<vfx-segmented>`
- **Category:** Forms
- **Runtime dependencies:** None

## Accessibility
Keep labels descriptive, preserve keyboard access, and test focus, form behavior, and screen-reader output in the browsers you support. The shared motion engine respects `prefers-reduced-motion`.

See the [component API overview](../../docs/COMPONENTS.md) for the public inventory and links to detailed guidance.
