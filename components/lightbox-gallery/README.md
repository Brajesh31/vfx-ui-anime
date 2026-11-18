# 🖼️ VFX Lightbox Gallery

A thumbnail gallery with an animated native-dialog viewer, previous/next navigation, captions, and keyboard controls.

```html
<script src="/components/lightbox-gallery/index.js"></script>
<vfx-lightbox-gallery items="City::/images/city.jpg|Forest::/images/forest.jpg"></vfx-lightbox-gallery>
```

## API
- `items`: pipe-separated `label::imageURL` entries. A missing URL displays a stylized placeholder.
- `activeIndex`: current image index.
- `open(index)`, `close()`, `next()`, and `previous()`.

## Events
- `open`: selected index and item.
- `change`: new index and item.
- `close`: final index.

## Accessibility and limits
The viewer uses a native modal dialog, labelled thumbnails, and Left/Right Arrow navigation. Supply image URLs that your application is authorized to display. The component does not upload, transform, or persist images.
