# File Upload

A keyboard-accessible dropzone with drag feedback, file validation, multiple-file support, size labels, removal, and form submission.

Part of **VFX UI Anime**, an expressive collection of native Web Components. This component uses the shared VFX motion and effects runtime embedded in its own JavaScript file. It has no external runtime dependency and can be used on a plain HTML page.

## Run the demo

From the repository root, start a local static server:

```sh
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/components/file-upload/demo.html
```

## Install manually

Copy `index.js` into your project and load it with a regular script tag. Do not load it as an ES module.

```html
<script defer src="/components/file-upload/index.js"></script>
<vfx-file-upload label="Drop files here" name="attachments" multiple accept=".png,.jpg,.pdf" max-size="10"></vfx-file-upload>>
```

## API

| Attribute | Purpose | Default |\n|---|---|---|\n| `label` | Dropzone label | `Drop files here or browse` |\n| `name` | Form field name | none |\n| `multiple` | Accepts more than one file | off |\n| `accept` | Native file type filter | all types |\n| `max-size` | Maximum size per file, in megabytes | unlimited |\n| `disabled` | Disables selection | off |

## Events

- `change`: emitted with `{ files }` in `detail` after selection, drop, or removal.\n\nThe component exposes a read-only `files` array. With `multiple` and a `name` attribute, selected files are added to form data under that field name.

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
