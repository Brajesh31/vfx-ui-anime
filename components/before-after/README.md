# 🌓 VFX Before and After

An image comparison slider with pointer and keyboard input, customizable labels, and optional image sources.

```html
<script src="/components/before-after/index.js"></script>
<vfx-before-after before-src="/before.jpg" after-src="/after.jpg" before-label="Original" after-label="Enhanced"></vfx-before-after>
```

## API
- `before-src` and `after-src`: optional image URLs. Without them, the component displays stylized placeholders.
- `before-label` and `after-label`: comparison labels.
- `value`: split position from 0 to 100.

## Events
- `input`: live split position.
- `change`: committed split position.

## Accessibility and limits
A native range input spans the comparison canvas, preserving keyboard and screen-reader operation. Use images you are authorized to display. This control compares two visual states, it does not edit either source image.
