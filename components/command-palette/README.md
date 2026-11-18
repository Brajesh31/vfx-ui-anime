# Command Palette

A keyboard-first command launcher with global Ctrl/⌘+K shortcut, filtering, roving selection, overlay focus, and impact entrance effects.

## Usage

```html
<script src="./index.js"></script>
<vfx-command-palette commands="New file|Open project|Search"></vfx-command-palette>
<button onclick="document.querySelector('vfx-command-palette').show()">Commands</button>
```

## API

- Element: `<vfx-command-palette>`
- `commands`: pipe-separated command labels.
- `placeholder`: search placeholder.
- Methods: `show()` and `hide()`; read-only `opened` property.
- Events: `open`, `close`, and `select`; select detail is `{ index, label }`.
- Global shortcut: Ctrl+K or ⌘+K; Escape closes.

## Accessibility

Uses a labelled modal dialog, labelled search field, listbox/options, selected-option state, and keyboard navigation. Focus returns to the previous element after close.

## Demo

Open `demo.html` through a local HTTP server.
