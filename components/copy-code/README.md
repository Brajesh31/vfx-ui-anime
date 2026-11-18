# 📋 VFX Copy Code Block

A code presentation block with language label, line numbers, copy action, and copy status.

```html
<script src="/components/copy-code/index.js"></script>
<vfx-copy-code language="js">
const greeting = "Hello, world!";
console.log(greeting);
</vfx-copy-code>
```

## API
- `value`: read or set the displayed source.
- `lineCount`: number of source lines.
- `copy()`: use Clipboard API with a textarea fallback.

## Events
- `copy`: copy succeeded and includes source text.
- `copy-error`: browser denied both copy methods.

Code is rendered as text, not executed or syntax-highlighted.
