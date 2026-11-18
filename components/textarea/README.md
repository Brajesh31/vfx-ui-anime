# Textarea

A multi-line message field with autosizing, live character count, caret dust, and form participation.

Part of **VFX UI Anime**, an expressive collection of native Web Components. This component uses the shared VFX motion and effects runtime embedded in its own JavaScript file. It has no external runtime dependency and can be used on a plain HTML page.

## Run the demo

From the repository root, start a local static server:

```sh
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/components/textarea/demo.html
```

## Install manually

Copy `index.js` into your project and load it with a regular script tag. Do not load it as an ES module.

```html
<script defer src="/components/textarea/index.js"></script>
<vfx-textarea label="Project notes" placeholder="Write a few lines…" name="notes" maxlength="180" auto-grow></vfx-textarea>>
```

## API

| Attribute | Purpose | Default |\n|---|---|---|\n| `label` | Accessible field label | `Message` |\n| `placeholder` | Empty-field guidance | `Write something…` |\n| `value` | Initial text | empty |\n| `rows` | Initial row count | 4 |\n| `maxlength` | Maximum character count | unlimited |\n| `auto-grow` | Grows with content up to 360 px | off |\n| `hint` | Helper text below the field | empty |\n| `required`, `disabled`, `name` | Native form behavior | off / off / none |

## Events

- `input`: emitted as the value changes, with `{ value }` in `detail`.\n- `change`: emitted when the native textarea commits a change.\n\nThe component exposes a read/write `value` property and participates in `FormData` when a `name` is supplied.

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
- This component is an original VFX UI Anime addition. The third-party notice in the repository applies to the eleven adapted original controls and their associated artwork, not this new implementation.
