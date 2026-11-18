# 🗺️ VFX Guided Tour

A page-level onboarding overlay with selector-based targets, spotlight framing, next/back, skip, and keyboard navigation.

```html
<script src="/components/guided-tour/index.js"></script>
<vfx-guided-tour steps="#nav::Navigation::Open the main sections.|#hero::Welcome::This is the starting point."></vfx-guided-tour>
<script>document.querySelector('vfx-guided-tour').start();</script>
```

## API
- `start()`, `next()`, `previous()`, and `finish(reason)`.
- Read `active` and `currentIndex`.
- `steps` entries are `selector::title::description`, separated by `|`.

## Events and keys
- `start` and `finish` report the tour lifecycle.
- Escape finishes; Left/Right Arrow navigate.

Ensure selectors exist and provide meaningful labels for assistive technologies. The overlay is not a security boundary.
