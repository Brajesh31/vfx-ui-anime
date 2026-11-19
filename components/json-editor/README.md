# 🧩 JSON Editor

A dependency-free two-pane JSON editor with live parsing, formatted preview, indentation formatting, minification, and visible validation feedback.

## Quick start

~~~html
<script src="./components/json-editor/index.js"></script>

<vfx-json-editor
  required
  value='{"name":"VFX UI","active":true}'
></vfx-json-editor>
~~~

The component registers as `<vfx-json-editor>`. It embeds the shared VFX runtime and works as a standalone script.

## Attributes and properties

| Attribute | Property | Default | Behavior |
|---|---|---|---|
| `value` | `value` | Built-in JSON example | Raw JSON source text. |
| `disabled` | `disabled` | `false` | Disables editing and transformation buttons. |
| `readonly` | `readOnly` | `false` | Prevents editing and formatting/minifying while keeping the preview available. |
| `required` | `required` | `false` | Treats blank or whitespace-only source as invalid. |

Read-only state properties are `valid` and `error`. `valid` is true only when the current source parses and satisfies the required rule. `error` returns the current parser/required error message, or an empty string when valid.

Assigning the `value` property with the same string as the existing value attribute still restores edited text in the textarea and refreshes validation.

## Methods

| Method | Result | Description |
|---|---|---|
| `parse()` | `boolean` | Validates the current source and updates the preview/status. |
| `format()` | `boolean` | Pretty-prints valid JSON with two-space indentation. |
| `minify()` | `boolean` | Serializes valid JSON without extra whitespace. |
| `focus()` | `void` | Moves focus to the source textarea. |

Format and minify return false for invalid input or when the editor is disabled/read-only. Failed transformations preserve the entered source.

## Events

Events bubble and cross the shadow boundary.

| Event | Detail | When |
|---|---|---|
| `input` | `{ value, valid }` | Source text changes from user input. |
| `change` | `{ value, valid, error }` | Validation is refreshed, including user input, property updates, and explicit parse/format operations. |
| `format` | `{ value }` | Pretty-printing succeeds. |
| `minify` | `{ value }` | Minification succeeds. |
| `format-error` | `{ reason }` | A formatting or minification action cannot transform invalid input. |

## Accessibility and security

- The source textarea has an accessible name and points to the polite status region with `aria-describedby`.
- Invalid JSON is exposed using `aria-invalid`.
- The preview is a labelled, keyboard-focusable region.
- Format and Minify are native buttons with accessible names and disabled states.
- Parsed JSON is serialized into `textContent`. It is never interpreted as HTML or executable markup.
- The component uses the browser's native JSON parser. It does not evaluate JSON as JavaScript.

## Known limits

- This custom element is not form-associated. The `required` attribute validates its internal editor state but does not add it as a successful field in a surrounding HTML form.
- JSON syntax validation does not validate an application schema, data types beyond JSON, or business rules.
- The preview displays formatted JSON text. It is not an interactive object inspector.
- Very large JSON documents are parsed and formatted synchronously, so large inputs can block the main thread.
