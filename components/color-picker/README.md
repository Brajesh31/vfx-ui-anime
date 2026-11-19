# Color Picker

A native color input wrapped in the VFX UI palette with a tactile swatch, live hex value, and form participation.

Part of **VFX UI Anime**, an expressive collection of native Web Components. This component uses the shared VFX motion and effects runtime embedded in its own JavaScript file. It has no external runtime dependency and can be used on a plain HTML page.

## Run the demo

From the repository root, start a local static server:

```sh
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/components/color-picker/demo.html
```

## Install manually

Copy `index.js` into your project and load it with a regular script tag. Do not load it as an ES module.

```html
<script defer src="/components/color-picker/index.js"></script>
<vfx-color-picker label="Accent color" value="#ff5fa8" name="accent"></vfx-color-picker>>
```

## API

| Attribute | Purpose | Default |\n|---|---|---|\n| `label` | Accessible color input name | `Accent color` |\n| `value` | Initial six-digit hex value | `#ff5fa8` |\n| `name` | Form field name | none |\n| `disabled` | Disables the native color input | off |

## Events

- `input`: emitted as the selected color changes, with `{ value }` in `detail`.\n- `change`: emitted when the user commits a color, with `{ value }` in `detail`.\n\nThe component exposes a read/write hex `value` property and participates in forms when a `name` is provided.

## Motion and visual behavior

- The control is visually quiet at rest. Effects are created in response to real pointer, keyboard, input, selection, or drop actions.
- Presses and state changes use spring motion, impact marks, small smoke puffs, ticks, shards, or manga lettering from the VFX UI Anime runtime.
- State updates happen immediately. The animation never controls whether a value is accepted or a form can be submitted.
- The effect layer respects `prefers-reduced-motion`. The control remains operable and its value still changes when reduced motion is enabled.
- Colors inherit the project tokens such as `--vfx-ink`, `--vfx-pri`, `--vfx-acc`, `--vfx-soft`, and `--vfx-sh`.

## Accessibility and integration

Use a meaningful label. Keep the component in normal document flow and avoid clipping its effects with an ancestor that has `overflow: hidden`. Keyboard interaction is supported according to the control type. Value-bearing controls expose their value and participate in forms through form-associated custom element internals.

## Limits

- The component uses modern browser APIs. Test the exact browsers and assistive technologies used by your application.
- The standalone demo is the source of truth for its current visual preview and interaction wiring.
