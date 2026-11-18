# 🧩 Component library

VFX UI Anime contains 15 native custom elements. Eleven are standalone animated controls with embedded motion engines and artwork. Four additional controls use this repository's separate shared engine.

| Component | Element | Category | Folder |
|---|---|---|---|
| Button | `<vfx-button>` | Actions | [components/button/](../components/button/) |
| Toggle | `<vfx-toggle>` | Forms | [components/toggle/](../components/toggle/) |
| Slider | `<vfx-slider>` | Forms | [components/slider/](../components/slider/) |
| Checkbox | `<vfx-checkbox>` | Forms | [components/checkbox/](../components/checkbox/) |
| Radio | `<vfx-radio>` | Forms | [components/radio/](../components/radio/) |
| Input | `<vfx-input>` | Forms | [components/input/](../components/input/) |
| Tabs | `<vfx-tabs>` | Navigation | [components/tabs/](../components/tabs/) |
| Progress | `<vfx-progress>` | Feedback | [components/progress/](../components/progress/) |
| Rating | `<vfx-rating>` | Feedback | [components/rating/](../components/rating/) |
| Toast | `<vfx-toast>` | Feedback | [components/toast/](../components/toast/) |
| Tooltip | `<vfx-tooltip>` | Feedback | [components/tooltip/](../components/tooltip/) |
| Like | `<vfx-like>` | Actions | [components/like/](../components/like/) |
| Accordion | `<vfx-accordion>` | Navigation | [components/accordion/](../components/accordion/) |
| Segmented | `<vfx-segmented>` | Forms | [components/segmented/](../components/segmented/) |
| Notification | `<vfx-notification>` | Feedback | [components/notification/](../components/notification/) |

## Standalone animated controls

The Button, Toggle, Slider, Checkbox, Radio, Input, Tabs, Progress, Rating, Toast, and Tooltip scripts each contain their own copy of the animation engine, canvas effects, and the artwork they need. The first one loaded creates `window.VFXAnimeFX`; additional source-backed controls reuse that shared page instance. You do not need to load `core.js` to use them.

The engine provides spring motion, bursts, shards, puffs, splashes, slashes, speed lines, smoke rings, and traced manga sound-effect lettering. The Toggle includes its 43-frame painted animation inside its component file.

## Additional VFX UI Anime controls

Like, Accordion, Segmented, and Notification use the separate `core.js` engine. Load `core.js` before any of those four scripts. That engine exposes `window.VFXAnime` with:

- `emit(type, x, y, options)`: emit particles at viewport coordinates.
- `impact(element, type, power)`: emit an effect near an element.
- `spring(from, to, elapsedSeconds)`: scalar spring-like easing.
- `reducedMotion`: current `prefers-reduced-motion` state.
- `version`: engine version.

## Per-component structure

Every component directory contains:

- `index.js`: custom element implementation.
- `demo.html`: working standalone preview.
- `README.md`: component-specific attributes, properties, events, behaviour, and limits.

## Example: source-backed Button

```html
<script defer src="/components/button/index.js"></script>
<vfx-button>Confirm</vfx-button>
```

## Example: additional Like control

```html
<script defer src="/core.js"></script>
<script defer src="/components/like/index.js"></script>
<vfx-like label="Like" liked-label="Liked"></vfx-like>
```

See the [detailed API reference](COMPONENT_API_REFERENCE.md), [installation guide](INSTALLATION.md), and each component's README for exact APIs.
