# ✍️ VFX UI Anime Rich Text Editor

A lightweight rich-text field with inline formatting, lists, quotes, undo/redo, keyboard shortcuts, word count, sanitized HTML output, and form association.

## Quick start

```html
<script src="/components/rich-text-editor/index.js"></script>

<form>
  <vfx-rich-text-editor
    name="description"
    placeholder="Write a project description…"
    required
  ></vfx-rich-text-editor>
  <button type="submit">Save</button>
</form>
```

## API

| Member | Type | Description |
|---|---|---|
| `value` | string | Read or set sanitized HTML. |
| `text` | string | Read plain text from the editing surface. |
| `focus()` | method | Focuses the editable surface. |
| `VfxRichTextEditor.sanitize(html)` | static method | Returns content filtered through the editor's tag and link allowlist. |

### Attributes

| Attribute | Default | Description |
|---|---|---|
| `name` | empty | Form field name. |
| `value` | empty | Initial content and form-reset value. |
| `placeholder` | `Start writing…` | Empty-editor hint. |
| `required` | false | Requires non-whitespace text. |
| `disabled` | false | Disables editing and toolbar actions. |
| `readonly` | false | Prevents editing while preserving readable and focusable content. |

### Formatting

Bold, italic, underline, bulleted lists, numbered lists, block quotes, undo, redo, and clear formatting are available. Ctrl/Cmd+B, Ctrl/Cmd+I, Ctrl/Cmd+U, Ctrl/Cmd+Z, and Ctrl/Cmd+Shift+Z shortcuts are supported by the editing surface. Pasted rich content is sanitized before insertion; plain text paste is supported as a fallback. Drag-and-drop inserts plain text only, never dropped HTML or executable content.

### Events

- `input`: reports `value` (sanitized HTML), `text` (plain text), and `words`.
- `change`: emitted when the editing surface loses focus, with the same detail fields.

Events bubble and cross the shadow boundary.

## Sanitization and security

Only a narrow formatting allowlist is retained: paragraphs, line breaks, emphasis, lists, list items, block quotes, selected headings, code, and links. Unsupported tags and attributes are removed. Links are retained only when they resolve to HTTP, HTTPS, or mailto URLs. Pasted HTML is sanitized before it enters the editor.

This is a client-side safety layer, not a complete server-side trust boundary. Validate and sanitize again on the server before storing or rendering editor output in another context. Never execute editor content.

## Forms and accessibility

The editor participates in form submission and reports required-field validity. Its editing surface exposes textbox and multiline semantics, and every formatting action has an accessible name. Keyboard editing and toolbar buttons are supported. Disabled state is synchronized with disabled ancestor fieldsets.

## Limits

The editor is intentionally lightweight. It does not provide collaborative editing, document history persistence, tables, embedded images, arbitrary font styling, or a full document model. Browser editing behavior may differ slightly across engines.
