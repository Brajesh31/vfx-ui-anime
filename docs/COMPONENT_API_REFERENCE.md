# Component API reference

All components are native custom elements using the `vfx-` prefix. Load `core.js` before their scripts.

| Element | Key attributes and properties | Events |
|---|---|---|
| `vfx-button` | `variant`, default slot | `vfx-activate` |
| `vfx-toggle` | `checked`, `label`, `name`, `value`, `disabled` | `change` |
| `vfx-slider` | `min`, `max`, `step`, `value`, `disabled` | `input` |
| `vfx-checkbox` | `checked`, `disabled`, `value`, default slot | `change` |
| `vfx-radio` | `options`, `value`, `name`, `disabled`, `required`, `label` | `change` |
| `vfx-input` | `type`, `value`, `placeholder`, `required`, `disabled`, `autocomplete`, `label` | `input`, `change` |
| `vfx-tabs` | `items`, `value`, `orientation`, `label`, named panel slots | `change` |
| `vfx-progress` | `value`, `label` | None |
| `vfx-rating` | `value` | `change` |
| `vfx-toast` | `message` | `vfx-toast` |
| `vfx-tooltip` | `text`, `placement`, default slot | None |
| `vfx-like` | `pressed`, `label`, `liked-label`, `disabled` | `change`, `detail.pressed` |
| `vfx-accordion` | `open`, `label`, `disabled`, default slot | `change`, `detail.open` |
| `vfx-segmented` | `value`, `label`, `disabled`, `options`, child options | `change`, `detail.value` |
| `vfx-notification` | `count`, `label`, `disabled` | `change`, `detail.count` |

Each component folder contains a working demo and implementation notes. The shared engine exposes `window.VFXAnime.emit`, `impact`, `spring`, `reducedMotion`, and `version`.

## Integration notes

- Load `core.js` before the component script.
- Prefer visible labels and preserve keyboard navigation.
- Form-associated behavior depends on browser support for ElementInternals.
- Reduced motion suppresses canvas particles. Component-specific transitions should also be reviewed against the user's motion preference.
- Validate focus order, accessible names, and screen-reader output in target browsers.
