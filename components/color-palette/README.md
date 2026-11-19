# 🎨 Color Palette

An accessible, dependency-free palette of selectable CSS color swatches with a copy action and clipboard fallback.

## Quick start

~~~html
<script src="./components/color-palette/index.js"></script>
<vfx-color-palette
  title="Brand palette"
  colors="#6558d9, #ff6fae, rgb(107, 205, 177), hsl(34 100% 72%)"
  value="#ff6fae"
></vfx-color-palette>
~~~

The component registers as **vfx-color-palette**. Its source file embeds the shared VFX runtime and works as a standalone script.

## Attributes and properties

| Attribute | Property | Default | Behavior |
|---|---|---|---|
| title | reflected through the attribute | Color palette | Visible heading and accessible group name. |
| colors | colors | Built-in ten-color set | Comma-separated CSS color values. The property also accepts an array. |
| value | value | First valid palette color | Currently selected palette member. |
| disabled | disabled | false | Disables all swatches and the copy action. |

The colors getter returns a copy of the normalized color array. Its setter accepts either an array of CSS colors or a comma-separated string. Separators inside color functions are preserved, so values such as rgb(107, 205, 177) remain one swatch.

Colors are checked with the browser's CSS.supports('color', value) implementation, with hexadecimal color forms handled directly. Invalid entries are ignored. Duplicate values are removed case-insensitively. When no valid entries remain, the first built-in color is used.

The value setter accepts only a color that exists in the current palette. Use select(value) when the application should also receive selection events.

## Methods and properties

| API | Description |
|---|---|
| colors | Get or replace the palette. The getter returns a new array. |
| value | Get or set the selected palette member. Invalid or non-member values are ignored by the property setter. |
| selectedIndex | Zero-based index of the current selected color. |
| select(value) | Selects a matching swatch. Returns false if disabled or if the color is not in the palette. |
| copy() | Copies the selected CSS value. Returns a promise that resolves to true or false. |

## Events

Events bubble and cross the component's shadow boundary.

| Event | Detail |
|---|---|
| select | { value, index }, emitted for a selection action. |
| change | { value, index }, emitted with the same selected value. |
| copy | { value }, emitted after the clipboard write succeeds. |
| copy-error | { value, reason }, emitted if both clipboard paths fail. |

## Keyboard and accessibility

- Swatches are native buttons with an accessible name and aria-pressed state.
- Only the selected swatch is in the normal Tab sequence.
- Arrow keys move focus through the palette. Home and End move focus to the first and last swatches.
- Enter and Space activate the focused native button.
- The palette uses a labelled group, visible focus styling, and native disabled states.

## Clipboard behavior

The component prefers navigator.clipboard.writeText(). If that API is absent or rejects the request, it tries a temporary, off-screen textarea with document.execCommand('copy'). The temporary element is removed whether the fallback succeeds or fails. Clipboard access remains subject to browser permissions and secure-context rules.

## Known limits

- Color parsing follows the CSS color support of the user's browser.
- The colors string form uses top-level commas as separators. Commas inside parentheses are supported.
- The component does not generate color harmonies, calculate contrast ratios, or provide color-format conversion tools.
- A copy operation may fail in browser contexts that deny clipboard access and block the legacy fallback.
