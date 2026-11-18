# Component API reference

All components use the `vfx-` custom-element prefix. Their APIs differ, so use the local README as the source of truth for complete details and limitations.

## Eleven standalone animated controls

These scripts contain the motion engine and artwork they need. Load each directly, without `core.js`.

| Element | Attributes and properties | Events and methods |
|---|---|---|
| `vfx-button` | `variant`, `type`, `disabled`, default slot | Native `click`; `.done(hold)`, `.impact()` |
| `vfx-toggle` | `label`, `checked`, `name`, `value`, `disabled` | `change`; `.flip()`; `.checked` |
| `vfx-slider` | `value`, `min`, `max`, `step`, `label`, `unit`, `name`, `disabled` | `input`, `change`; `.value`, `.valueAsNumber` |
| `vfx-checkbox` | `checked`, `name`, `value`, `disabled`, default slot | `change`; `.checked` |
| `vfx-radio` | Child `option` elements, `label`, `value`, `name`, `disabled` | `change`; `.value` |
| `vfx-input` | `label`, `placeholder`, `value`, `type`, `autocomplete`, `name`, `disabled` | `input`, `change`; `.value` |
| `vfx-tabs` | Child `option` elements, `label`, `selected` | `change` with `detail: { index, value, label }`; `.selected`, `.value` |
| `vfx-progress` | `label`, `value`, `done-label`, `demo` | `vfx:done`; `.set(value, immediate)`, `.reset()`, `.value`, `.done` |
| `vfx-rating` | `label`, `value`, `name`, `disabled` | `change`; `.value` |
| `vfx-toast` | `duration`, `message` | `.show(message)`, `.hide()`, `.open` |
| `vfx-tooltip` | `text`, `label`, default slot | `.show()`, `.hide()`, `.open` |

### Form behaviour

Toggle, Slider, Checkbox, Radio, Input, and Rating support form usage through their native or form-associated controls. Read each local README for the exact value format and browser behaviour. Tabs only renders a tab list, it does not create or manage the associated content panels. Progress emits `vfx:done` when its animated bar reaches the completed state.

### Motion details

The eleven controls use embedded source-backed spring, canvas, path, and frame animation code. The Toggle carries 43 painted frames in its own JavaScript file. Their original visual timing, effects, sound-effect lettering, and limits are described in their individual READMEs.

## Four additional VFX UI Anime controls

These four scripts use `core.js`, which exposes `window.VFXAnime`.

| Element | Attributes and properties | Events |
|---|---|---|
| `vfx-like` | `pressed`, `label`, `liked-label`, `disabled` | `change`, `detail.pressed` |
| `vfx-accordion` | `open`, `label`, `disabled`, default slot | `change`, `detail.open` |
| `vfx-segmented` | `value`, `label`, `disabled`, `options`, child options | `change`, `detail.value` |
| `vfx-notification` | `count`, `label`, `disabled` | `change`, `detail.count` |

## Integration notes

- For the first eleven controls, load only the desired component script.
- For Like, Accordion, Segmented, or Notification, load `core.js` first.
- Preserve keyboard behaviour, accessible names, and form semantics.
- The embedded animation engine respects `prefers-reduced-motion`; review component-specific motion in your target browser.
- Do not assume a feature or attribute exists unless it is listed in the component's README.
