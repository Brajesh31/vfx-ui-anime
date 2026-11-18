# ✍️ VFX Rich Text Editor

A lightweight rich-text field with inline formatting, lists, undo/redo, word count, and sanitized HTML output.

```html
<script src="/components/rich-text-editor/index.js"></script>
<vfx-rich-text-editor name="description" placeholder="Write something…"></vfx-rich-text-editor>
```

## API
- `value`: sanitized HTML, readable and writable.
- `text`: plain text content.
- `focus()`: focus the editable surface.

## Events
- `input`: sanitized HTML, plain text, and word count.

## Formatting
Bold, italic, underline, bulleted/numbered lists, undo, redo, and clear formatting are included.

## Security
The value getter/setter strips unsupported tags and attributes. Links are retained only for HTTP(S) and mailto schemes. Treat editor output as untrusted input and validate it again on the server before storing or rendering in other contexts.
