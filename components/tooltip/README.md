# Tooltip component

A contextual hint with focus, Escape, and placement support.

## Live demo
Open [demo.html](demo.html) to test the component in the library's design system.

## Installation
```html
<link rel="stylesheet" href="/styles.css">
<script defer src="/core.js"></script>
<script defer src="/components/tooltip/index.js"></script>
<vfx-tooltip text="Helpful context for this action." placement="auto">Hover or focus me</vfx-tooltip>
```

## Component details
- **Element:** `<vfx-tooltip>`
- **Category:** Feedback
- **Runtime dependencies:** None

## Accessibility
Keep labels descriptive, preserve keyboard access, and test focus, form behavior, and screen-reader output in the browsers you support. The shared motion engine respects `prefers-reduced-motion`.

See the [component API overview](../../docs/COMPONENTS.md) for the public inventory and links to detailed guidance.
