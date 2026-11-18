# 🧩 Component API

All components are registered as native custom elements. Load `core.js` before component scripts. Unless noted, events are bubbling and composed so they can be observed outside Shadow DOM.

## `<vfx-button>`
- Content: default slot.
- Attribute: `variant="secondary"` for the alternate appearance.
- Event: `vfx-activate` after activation.
- Keyboard: native button behavior.

## `<vfx-toggle>`
- Attributes: `checked`, `label`, `name`, `value`.
- Property: `checked` boolean.
- Form: uses ElementInternals when supported, including disabled-state and reset callbacks. Validate in target browsers before relying on form submission.
- Keyboard: native button switch interaction; exposes `role="switch"` and `aria-checked`.

## `<vfx-slider>`
- Attributes: `min`, `max`, `step`, `value`, `disabled`.
- Property: `value` number.
- Event: `input` with `event.detail.value`; visual spark effect on change.
- Uses native range input semantics.

## `<vfx-checkbox>`
- Attributes: `checked`, `name`, `value`.
- Property: `checked` boolean.
- Event: native-like bubbling `change`.
- Uses a native checkbox internally and supports form reset/disabled callbacks when ElementInternals is available.

## `<vfx-radio>`
- Attributes: `options` comma-separated, `value`, `name`.
- Property: `value` string.
- Event: `change`.
- Current limitation: options are rebuilt when observed attributes change. Commas are not supported inside option labels.

## `<vfx-input>`
- Attributes: `type`, `placeholder`, `value`, `required`, `disabled`, `autocomplete`.
- Attributes: `label` for an explicit accessible name.
- Property: `value` string.
- Events: `input`, `change`.
- Supports form reset and disabled callbacks where ElementInternals is available. It does not yet proxy the full native constraint-validation API.

## `<vfx-tabs>`
- Attributes: `items` comma-separated and `value`.
- Property: `value` string.
- Event: `change` with `event.detail.value`.
- Current limitation: it renders the tab selector only. Your application must connect selection to the relevant panel and manage panel ARIA relationships.

## `<vfx-progress>`
- Attributes: `value` from 0 to 100, `label`.
- Property: `value` number.
- Exposes `role="progressbar"`, `aria-valuemin`, `aria-valuemax` and `aria-valuenow`.

## `<vfx-rating>`
- Attribute/property: `value` integer from 0 to 5.
- Event: `change` with `event.detail.value`.
- Keyboard: native buttons, each with an accessible label.
- Current limitation: whole-star values only.

## `<vfx-toast>`
- Attribute: `message`.
- Method: `show(message?)`.
- Event: `vfx-toast`.
- Uses a live status region. Current implementation shows one toast per element and does not provide a global queue.

## `<vfx-tooltip>`
- Attribute: `text`.
- Content: default slot is the focusable trigger.
- Uses hover and focus-within visibility.
- Current limitation: placement is fixed above the trigger and does not yet perform viewport collision detection.

## Shared engine
`window.VFXAnime` exposes:
- `emit(type, x, y, options?)` to create canvas particles.
- `impact(element, type?, power?)` to emit at an element's center.
- `spring(from, to, elapsedSeconds)` for a simple easing helper.
- `reducedMotion` read-only state.
- `version` engine version string.
