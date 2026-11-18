# 🎞️ VFX Carousel

A manually controlled, touch-swipe carousel with dots, arrow controls, live position feedback, and keyboard navigation.

```html
<script src="/components/carousel/index.js"></script>
<vfx-carousel slides="Impact|Momentum|Afterglow"></vfx-carousel>
```

## API
- `slides`: pipe-separated slide labels.
- `activeIndex`: zero-based current slide, readable and writable.
- `goTo(index)`, `next()`, and `previous()`: navigation methods.

## Events
- `change`: `detail.index`, `detail.total`, and `detail.slide`.

## Accessibility
The viewport is keyboard-focusable and responds to Left and Right Arrow. Previous/Next buttons and each dot have accessible labels. The active slide is exposed through `aria-hidden`.

## Limits
The component intentionally does not auto-advance. Supply concise labels in the `slides` attribute; compose richer slide content in your own application when needed.
