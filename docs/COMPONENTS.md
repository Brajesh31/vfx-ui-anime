# 🧩 Component API overview

VFX UI Anime exposes eleven native custom elements. Load `core.js` before the component scripts when you want the shared canvas effects. Each component file registers its own tag.

For the complete, source-checked list of attributes, properties, methods, emitted event payloads, form behavior, accessibility semantics and current limitations, see the **[Detailed Component API Reference](COMPONENT_API_REFERENCE.md)**.

## Component inventory

| Component | Custom element | Primary inputs | Host events |
|---|---|---|---|
| Button | `<vfx-button>` | `variant`, default slot | `vfx-activate` |
| Toggle | `<vfx-toggle>` | `checked`, `label`, `name`, `value`, `disabled` | `change` |
| Slider | `<vfx-slider>` | `min`, `max`, `step`, `value`, `disabled` | `input` with `detail.value` |
| Checkbox | `<vfx-checkbox>` | `checked`, `disabled`, `value`, default slot | `change` |
| Radio | `<vfx-radio>` | `options`, `value`, `name`, `disabled`, `required`, `label` | `change` |
| Input | `<vfx-input>` | `type`, `value`, `placeholder`, `required`, `disabled`, `autocomplete`, `label` | `input`, `change` |
| Tabs | `<vfx-tabs>` | `items`, `value`, `orientation`, `label` | `change` with `detail.value` |
| Progress | `<vfx-progress>` | `value`, `label` | None |
| Rating | `<vfx-rating>` | `value` | `change` with `detail.value` |
| Toast | `<vfx-toast>` | `message` | `vfx-toast` with `detail.message` |
| Tooltip | `<vfx-tooltip>` | `text`, default slot | None |

All custom-element events shown above bubble and cross the Shadow DOM boundary. Events without a listed detail payload do not provide a documented custom payload.

## Shared engine

`core.js` creates `window.VFXAnime` with:
- `emit(type, x, y, options?)`: emit particles at viewport coordinates.
- `impact(element, type?, power?)`: emit at the center of an element.
- `spring(from, to, elapsedSeconds)`: return a scalar easing value.
- `reducedMotion`: read-only state from `prefers-reduced-motion`.
- `version`: engine version string.

## Important implementation notes

- `<vfx-slider>` copies its initial range attributes when it connects. Use its `value` property for later programmatic value changes.
- `<vfx-tabs>` supports one tab stop, arrow-key selection, and Home/End navigation. It supports horizontal and vertical orientation, but the consuming application must still create and manage tab panels and their accessibility relationships.
- `<vfx-radio>` accepts comma-separated options, applies the configured `name`, and uses native radio inputs for browser keyboard behavior. It supports `label`, `required` and `disabled`. A required group starts unselected unless a valid `value` is supplied; form-associated behavior remains browser-dependent and should be tested.
- `<vfx-input>` does not proxy the complete native constraint-validation API.
- Toggle, checkbox, radio and input declare form association and use `ElementInternals` where available, but production form behavior still needs browser-specific testing.
- Reduced motion suppresses canvas particles. It does not automatically remove every CSS transition from the components.

## Example

```html
<link rel="stylesheet" href="/styles.css">
<script defer src="/core.js"></script>
<script defer src="/components/button.js"></script>

<vfx-button id="continue">Continue</vfx-button>
<script>
  document.querySelector("#continue").addEventListener("vfx-activate", () => {
    console.log("Continue activated");
  });
</script>
```

## Further guidance

- [Detailed Component API Reference](COMPONENT_API_REFERENCE.md)
- [Installation](INSTALLATION.md)
- [Architecture](ARCHITECTURE.md)
- [Accessibility and compatibility](ACCESSIBILITY.md)
- [Testing strategy](TESTING.md)
- [Framework integrations](INTEGRATIONS.md)
- [Visual design system](DESIGN_SYSTEM.md)

This overview describes the current source implementation. It does not imply complete native form parity, full screen-reader support, or verified cross-browser behavior.
