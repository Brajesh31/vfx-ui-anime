# ✍️ VFX Signature Pad

A pointer-driven signature canvas with undo, clear, and PNG export.

```html
<script src="/components/signature-pad/index.js"></script>
<vfx-signature-pad></vfx-signature-pad>
```

## API
- `hasSignature`: whether any strokes are present.
- `undo()`: remove the last stroke.
- `clear()`: clear all strokes.
- `exportPNG()`: asynchronously return a PNG Blob.

## Events
- `change`: completed stroke count.
- `undo`, `clear`, and `export`: action details and, for export, the PNG Blob and canvas dimensions.

## Accessibility and limits
The drawing canvas supports mouse, pen, and touch pointer input. Undo, Clear, and Export are regular keyboard-operable buttons. This is a browser-side drawing pad, not a cryptographic or legally verified electronic signature service.
