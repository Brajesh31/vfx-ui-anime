# 🖼️ VFX Image Cropper

A local image cropper with zoom, quarter-turn rotation, a movable/resizable square crop window, and PNG export. The image never leaves the browser.

```html
<script src="/components/image-cropper/index.js"></script>
<vfx-image-cropper></vfx-image-cropper>
```

## Workflow
1. Choose an image or drop one into the preview.
2. Drag the square crop frame to reposition it. Drag its pink corner handle to resize it.
3. Adjust zoom or rotate in quarter turns.
4. Export PNG. The control downloads the result and emits a `crop` event.

## API
- `load(file)`: load a browser `File` object.
- `reset()`: reset zoom, rotation, and crop-frame position.
- `exportCrop()`: asynchronously return a PNG `Blob`, or `null` when no image is loaded.

## Events
- `image-load`: source name and dimensions.
- `crop`: `detail.blob`, `detail.url`, `detail.width`, and `detail.height`. Revoke the emitted object URL when no longer needed.
- `error`: invalid file type, decode failure, or export failure.

## Privacy and limits
Files are decoded locally with an object URL and drawn to a canvas. No upload or network request is made. The crop is square and output is PNG. Browser image-decoding and canvas limits still apply. Avoid using this component with untrusted SVGs unless your application's file policy allows SVG images.
