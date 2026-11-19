# ✍️ VFX Rich Text Editor

A lightweight contenteditable editor with inline formatting, lists, undo/redo, word count, keyboard shortcuts, form association and a narrow HTML allowlist sanitizer.

## Quick start

```html
<script src="/components/rich-text-editor/index.js"></script>
<form>
  <vfx-rich-text-editor
    name="description"
    label="Project description"
    placeholder="Write something useful…"
    required
  ></vfx-rich-text-editor>
  <button type="submit">Save</button>
</form>
```

## Public API

| API | Description |
|---|---|
| `value` | Read or set sanitized HTML |
| `text` | Plain text content |
| `focus()` | Focus the editable surface |
| `clear()` | Clear content and emit an input event |
| `required` | Requires non-empty text |
| `readonly` | Prevents editing and disables formatting controls |
| `disabled` | Disables editing and excludes the value from form submission |
| `label`, `placeholder` | Accessible name and empty-state hint |

Bold, italic, underline, bulleted/numbered lists, undo, redo and clear formatting are available. Ctrl/Cmd+B, Ctrl/Cmd+I and Ctrl/Cmd+U are supported. Pasted and dropped content is inserted as plain text to avoid importing arbitrary markup. The browser's native editing commands may vary slightly by browser.

## Events and form behavior

- `input`: detail includes sanitized `value`, plain `text` and `words`.
- `change`: emitted when editing is committed on blur.
- A form-associated editor submits sanitized HTML under its `name`.
- With `required`, empty text is invalid. Form reset restores the `value` attribute.

## Sanitization

Only paragraphs, line breaks, basic emphasis, lists, blockquotes, headings, code and safe links are retained. Unsupported formatting is unwrapped or removed. Link targets are kept only for HTTP(S) and mailto schemes, with `rel="noopener noreferrer"`. Paste/drop is plain text.

Treat the resulting HTML as untrusted input. Validate and sanitize again on the server before storage or rendering in other contexts. This component is not a complete document editor and does not provide collaborative editing, uploads, tables or a plugin ecosystem.
