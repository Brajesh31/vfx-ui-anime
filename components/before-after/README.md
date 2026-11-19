# 🌓 VFX Before and After

An image-comparison slider with pointer and keyboard input, live source/label updates, and stylized placeholders when no image is supplied.

```html
<script src="/components/before-after/index.js"></script>
<vfx-before-after before-src="/before.jpg" after-src="/after.jpg" before-label="Original" after-label="Enhanced"></vfx-before-after>
```

## API
- `before-src` and `after-src`: optional image URLs. Updating either attribute replaces that side's image. Failed or removed images return to the placeholder.
- `before-label` and `after-label`: comparison labels, updated while mounted.
- `value`: split position from 0 to 100, readable and writable. Invalid values reset to 50.

## Events
- `input`: live split position.
- `change`: committed split position.
- `image-load`: loaded side and source.
- `image-error`: side and source when decoding fails.

## Accessibility and limits
A native range input spans the comparison stage, preserving keyboard and screen-reader operation. Use images you are authorized to display. This control compares two visual states, it does not edit either source image.
