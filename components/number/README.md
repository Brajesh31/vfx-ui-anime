# Number Stepper

A bounded numeric value with tactile increment and decrement controls, keyboard support, and native form semantics.

Part of **VFX UI Anime**, an expressive collection of native Web Components. This component uses the shared VFX motion and effects runtime embedded in its own JavaScript file. It has no external runtime dependency and can be used on a plain HTML page.

## Run the demo

From the repository root, start a local static server:

```sh
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/components/number/demo.html
```

## Install manually

Copy `index.js` into your project and load it with a regular script tag. Do not load it as an ES module.

```html
<script defer src="/components/number/index.js"></script>
<vfx-number label="Quantity" value="3" min="1" max="12" step="1" name="quantity"></vfx-number>>
```

## API

| Attribute | Purpose | Default |\n|---|---|---|\n| `label` | Use an enclosing label in the page for context | none |\n| `value` | Initial numeric value | 1 |\n| `min`, `max` | Lower and upper bounds | 0 and 100 |\n| `step` | Increment/decrement amount | 1 |\n| `hint` | Help text below the control | built-in hint |\n| `required`, `disabled`, `name` | Native form behavior | off / off / none |

## Events

- `input`: emitted when the value changes, with `{ value }` in `detail`.\n- `change`: emitted after a step-button or committed input change, with `{ value }` in `detail`.\n\nThe component exposes a read/write numeric `value` property. The internal number input supports keyboard arrow-key stepping and native number editing.

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
