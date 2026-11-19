# 🖼️ VFX Image Cropper

A browser-local image cropper with zoom, quarter-turn rotation, a movable and resizable square selection, keyboard adjustment, and PNG export.

## 🚀 Quick start
\`\`\`html
<script src="/components/image-cropper/index.js"></script>
<vfx-image-cropper></vfx-image-cropper>
\`\`\`

## 🧭 Workflow
1. Choose an image or drop it onto the preview.
2. Drag the selection to move it, or drag its corner handle to resize.
3. Focus the selection and use the arrow keys to move it. Hold **Shift** with an arrow key to resize, or **Alt** with an arrow key for a larger movement step.
4. Adjust zoom or rotate the image in 90-degree increments.
5. Export PNG. The component downloads the image and emits a \`crop\` event.

## ⚙️ API

| API | Description |
|---|---|
| \`load(file)\` | Start loading a browser \`File\`. Returns \`false\` for an unsupported type, otherwise \`true\` when loading starts. Decoding is asynchronous. |
| \`reset()\` | Reset zoom, rotation, and crop-frame geometry. |
| \`exportCrop()\` | Async method resolving to a PNG \`Blob\`, or \`null\` when no image/stage is available or export fails. |

## 📣 Events
- \`image-load\`: detail includes \`name\`, \`width\`, and \`height\`.
- \`crop-change\`: normalized \`left\`, \`top\`, and \`size\` after keyboard movement or resize.
- \`crop\`: detail includes \`blob\`, \`url\`, \`width\`, and \`height\`. Revoke the emitted object URL when finished using it.
- \`error\`: detail includes a \`message\` for unsupported type, image decode, or PNG export failures.

## ♿ Accessibility and lifecycle
- The crop selection has an accessible name and can receive keyboard focus.
- Arrow keys move the crop area; Shift+Arrow resizes it; Alt increases movement increments.
- The resize handle is a labeled button. Zoom is a labeled range input.
- Toolbar actions remain disabled until a valid image loads.
- Pending loads are invalidated when a newer image is selected or the element disconnects.
- Object URLs and the resize observer are cleaned up on disconnect. The observer is recreated on reconnect.
- Crops are exported from the decoded source image using the selected transform rather than exporting the low-resolution preview canvas.

## 🔒 Privacy and limits
Images are decoded locally using browser object URLs. No network upload is performed. Output is a square PNG. Browser image decoding and canvas memory/dimension limits still apply. The file input accepts \`image/*\`, including SVG in browsers that treat it as an image; validate SVG separately when your application has stricter file rules.

## 🧩 Example
\`\`\`js
const cropper = document.querySelector('vfx-image-cropper');
cropper.addEventListener('crop', ({ detail }) => {
  const { blob, url, width, height } = detail;
  processImage(blob, width, height);
  // Revoke url after the host no longer needs it.
});
\`\`\`
