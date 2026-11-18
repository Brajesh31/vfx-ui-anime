# 🧩 Component library

VFX UI Anime contains 15 native custom elements. Every component lives in its own dedicated folder with an implementation, standalone demo, and usage guide.

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

## Shared motion engine

Load `core.js` before component scripts. It exposes `window.VFXAnime` with:
- `emit(type, x, y, options)`: emit particles at viewport coordinates.
- `impact(element, type, power)`: emit an effect near an element.
- `spring(from, to, elapsedSeconds)`: scalar spring-like easing.
- `reducedMotion`: current `prefers-reduced-motion` state.
- `version`: engine version.

## Per-component structure

Every component directory contains:
- `index.js`: custom element implementation.
- `demo.html`: working standalone preview.
- `README.md`: component-specific use and installation notes.

## Example

```html
<link rel="stylesheet" href="/styles.css">
<script defer src="/core.js"></script>
<script defer src="/components/button/index.js"></script>
<vfx-button>Continue</vfx-button>
```

See the [detailed API reference](COMPONENT_API_REFERENCE.md), [installation guide](INSTALLATION.md), and each component's README for current details.
