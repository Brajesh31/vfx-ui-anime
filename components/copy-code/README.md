# 📋 VFX UI Anime Copy Code Block

A safe, standalone code display with line numbers, live source updates, optional wrapping, clipboard copying, and accessible feedback.

## Quick start

```html
<script src="/components/copy-code/index.js"></script>

<vfx-copy-code language="js">
const greeting = "Hello, world!";
console.log(greeting);
</vfx-copy-code>
```

You can also supply source through the `code` attribute:

```html
<vfx-copy-code language="html" code="<h1>Hello</h1>"></vfx-copy-code>
```

## API

| Member | Type | Description |
|---|---|---|
| `value` | string | Read or replace the source text. Leading/trailing whitespace and newlines are preserved. |
| `language` | string | Read or set the language label. |
| `lineCount` | number | Number of source lines. Empty source has zero lines. |
| `disabled` | boolean | Whether copying is disabled. |
| `copy()` | Promise<boolean> | Attempts the Clipboard API, then a document copy fallback. Resolves true only when copying succeeds. |

### Attributes

- `code`: source text. When present, it takes precedence over light-DOM text.
- `language`: language label shown in the header.
- `label`: accessible label for the source area.
- `disabled`: disables the copy action.
- `wrap`: wraps long code lines instead of requiring horizontal scrolling.

Changes to the `code` attribute and light-DOM text content are reflected in the display. Assigning the `value` property replaces the displayed source directly. Code is rendered as text and is never evaluated or syntax-executed.

### Events

- `copy`: copying succeeded. Detail includes source `value`, `language`, and the copy `method`.
- `copy-error`: neither clipboard path succeeded. Detail includes source `value` and `language`.

Events bubble and cross the shadow boundary.

## Security and limits

Source is inserted with `textContent`, so markup-like code is displayed literally. The component does not execute code and does not provide syntax highlighting or language parsing. Clipboard access is subject to browser permissions and secure-context requirements. When copy is unavailable, users can select the displayed code manually.
