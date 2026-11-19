# 📝 Markdown Editor

A compact, dependency-free Markdown writing surface with split, write-only, and preview-only modes. The preview is built with DOM nodes and text content rather than injecting authored Markdown as HTML.

## Quick start

~~~html
<script src="./components/markdown-editor/index.js"></script>

<vfx-markdown-editor
  placeholder="Write your notes..."
  value="# Release notes

- **Fast** updates
- Safe preview"
></vfx-markdown-editor>
~~~

The component registers as `<vfx-markdown-editor>`. Its single source file embeds the shared VFX runtime.

## Attributes and properties

| Attribute | Property | Default | Behavior |
|---|---|---|---|
| `value` | `value` | Built-in example Markdown | Source text. Setting the property or attribute replaces the editor content. |
| `placeholder` | `placeholder` | Empty | Placeholder text for the source textarea. |
| `disabled` | `disabled` | `false` | Disables source editing and view-mode tabs. |
| `readonly` | `readOnly` | `false` | Prevents source edits while keeping preview modes available. |

The `mode` property accepts `split`, `write`, or `preview`. It defaults to `split`. Assigning the same value attribute through the `value` property still restores the editor when its current text has since changed.

## Supported Markdown

This is a deliberately small renderer, not a full CommonMark implementation. It supports:

- Headings from level 1 through level 3.
- Paragraphs and line-wrap joining.
- Bold, italic and inline code.
- Fenced code blocks with an optional sanitized language label.
- Ordered and unordered lists.
- Blockquotes and horizontal rules.
- Inline links with HTTP, HTTPS, and mailto destinations.

Raw HTML is not interpreted. Tags and markup-like input remain text. Link destinations are parsed with the URL API. Unsupported protocols such as `javascript:` are not made clickable. External HTTP/HTTPS links open in a new tab with `noopener noreferrer`.

## Methods

| Method | Result | Description |
|---|---|---|
| `setMode(mode)` | `boolean` | Changes between split, write, and preview modes. Returns false for unsupported modes. |
| `focus()` | `void` | Moves focus to the source textarea. |

The `value`, `mode`, `disabled`, and `readOnly` properties are available on the custom element.

## Events

Events bubble and cross the shadow boundary.

| Event | Detail | When |
|---|---|---|
| `input` | `{ value }` | Source text changes from user input. |
| `change` | `{ value }` | Emitted with the updated source after user input. |

Programmatic property or attribute assignments update the editor and preview but do not synthesize user input events.

## Keyboard and accessibility

- View controls use a tablist with selected-state and panel relationships.
- Arrow Left/Right moves between tabs. Home and End select the first and last tab.
- The selected tab is the only view tab in the normal Tab sequence.
- The active panel is labelled by the selected tab.
- The source textarea has a persistent accessible name.
- The preview is a labelled region. The inactive preview is removed from the accessibility tree in Write mode.
- Disabled and read-only states are applied to the native textarea.

## Known limits

- This renderer intentionally omits tables, task lists, nested list parsing, raw HTML, images, and full Markdown specification edge cases.
- Preview refresh occurs as the source changes. Very large documents may require a more incremental renderer for optimal performance.
- The component is not a collaborative editor and does not persist content.
