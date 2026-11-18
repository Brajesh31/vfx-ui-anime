# Button component

A tactile action button with animated press feedback.

## Live demo
Open [demo.html](demo.html) to test the component in the library's design system.

## Installation
Copy `index.js` and load the shared engine first:

```html
<link rel="stylesheet" href="/styles.css">
<script defer src="/core.js"></script>
<script defer src="/components/button/index.js"></script>
<vfx-button>Launch</vfx-button> <vfx-button variant="secondary">Secondary</vfx-button>
```

## Component details
- **Element:** `<vfx-button>`
- **Category:** Actions
- **Runtime dependencies:** None

## Accessibility
Keep labels descriptive, preserve keyboard access, and test focus, form behavior, and screen-reader output in the browsers you support. The shared motion engine respects `prefers-reduced-motion`.

See the [component API overview](../../docs/COMPONENTS.md) for the public inventory and links to detailed guidance.
