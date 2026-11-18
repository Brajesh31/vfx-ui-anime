# Slider component

A numeric range control with a live value readout.

## Live demo
Open [demo.html](demo.html) to test the component in the library's design system.

## Installation
Copy `index.js` and load the shared engine first:

```html
<link rel="stylesheet" href="/styles.css">
<script defer src="/core.js"></script>
<script defer src="/components/slider/index.js"></script>
<vfx-slider min="0" max="100" value="42"></vfx-slider>
```

## Component details
- **Element:** `<vfx-slider>`
- **Category:** Forms
- **Runtime dependencies:** None

## Accessibility
Keep labels descriptive, preserve keyboard access, and test focus, form behavior, and screen-reader output in the browsers you support. The shared motion engine respects `prefers-reduced-motion`.

See the [component API overview](../../docs/COMPONENTS.md) for the public inventory and links to detailed guidance.
