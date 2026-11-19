# Select

A custom listbox with a springing panel, keyboard navigation, selected-state marks, and the original VFX impact vocabulary.

Part of **VFX UI Anime**, an expressive collection of native Web Components. This component uses the shared VFX motion and effects runtime embedded in its own JavaScript file. It has no external runtime dependency and can be used on a plain HTML page.

## Run the demo

From the repository root, start a local static server:

```sh
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/components/select/demo.html
```

## Install manually

Copy `index.js` into your project and load it with a regular script tag. Do not load it as an ES module.

```html
<script defer src="/components/select/index.js"></script>
<vfx-select label="Choose a plan" name="plan"><option value="starter">Starter</option><option value="creator">Creator</option></vfx-select>>
```

## API

| Attribute | Purpose | Default |\n|---|---|---|\n| `label` | Accessible name for the trigger | `Choose an option` |\n| `placeholder` | Text before a choice is made | `Select an option` |\n| `value` | Initial selected value | First selected option |\n| `options` | Pipe-separated options when no child `<option>` elements are supplied | none |\n| `disabled` | Prevents opening and selection | off |\n| `name` | Form field name | none |

## Events

- `input`: emitted when a different option is selected, with `{ value }` in `detail`.\n- `change`: emitted on committed selection, with `{ value, label }` in `detail`.\n\nThe component exposes a `value` property. Child `<option>` elements support `value`, `selected`, and `disabled`.

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
