# ✍️ VFX Signature Pad

A browser-side signature canvas with pointer and keyboard drawing, undo, clear, and PNG export.

```html
<script src="/components/signature-pad/index.js"></script>
<vfx-signature-pad></vfx-signature-pad>
```

## API
- `hasSignature`: whether any strokes are present.
- `undo()`: remove the last stroke and return whether one was removed.
- `clear()`: clear all strokes and return whether any content was removed.
- `exportPNG()`: asynchronously return a PNG Blob, or `null` when empty.

## Keyboard drawing
Focus the drawing surface. Press Space to lower or lift the pen, use arrow keys to move and draw, hold Shift with an arrow for a larger move, hold Alt for a smaller move, and press Escape to lift the pen. The regular Undo, Clear, and Export buttons remain keyboard-operable.

## Events
- `change`: completed stroke count.
- `undo`, `clear`, and `export`: action details and, for export, the PNG Blob and canvas dimensions.

## Accessibility and limits
The drawing surface has an accessible name and explicit keyboard instructions. This is a browser-side drawing pad, not a cryptographic or legally verified electronic signature service.
