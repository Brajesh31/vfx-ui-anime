# 🔢 Animated Counter

A numeric counter with interpolated updates, locale-aware formatting, configurable decimals, completion events, reduced-motion handling, and predictable disconnect behavior.

## Quick start

~~~html
<script src="./components/animated-counter/index.js"></script>
<vfx-animated-counter
  value="12500"
  label="Downloads"
  duration="900"
></vfx-animated-counter>
~~~

The component registers as `<vfx-animated-counter>`.

## Attributes and properties

| Attribute | Property | Default | Behavior |
|---|---|---|---|
| `value` | `value` | `0` | Finite numeric target. Changes animate when connected unless motion is reduced. |
| `label` | `label` | `Total` | Supporting text below the number. |
| `duration` | `duration` | `900` ms | Animation duration, clamped to 0–10,000 ms. |
| `locale` | `locale` | Browser default | Optional locale passed to `Intl.NumberFormat`. Invalid locales fall back to the browser default. |
| `decimals` | `decimals` | `0` | Fixed minimum and maximum displayed fraction digits, clamped to 0–6. |

The `value` getter returns the current target, not the intermediate displayed number. Setting the `value` property to the same value attribute still refreshes the display and animation if the component is mid-transition.

## Methods

| Method | Result | Description |
|---|---|---|
| `setValue(value, animate = true, announce = true)` | `boolean` | Updates the numeric target. Returns false for non-finite values. |
| `value` | `number` | Read or update the target through the property. |

Calling `setValue(value, false)` updates immediately. Passing a non-finite value is rejected without changing the current target.

## Events

The bubbling, composed `complete` event is emitted after an animated or immediate update settles:

~~~js
{ value: 12500 }
~~~

Initial setup does not emit a completion event. If an active animation is interrupted by disconnection, the display is finalized to the latest target without emitting a completion event. A transition interrupted by switching to reduced motion is finalized and announced.

## Accessibility and motion

- The changing numeric span uses `aria-live="off"` to avoid announcing every animation frame.
- A polite status message is updated when the counter completes.
- `prefers-reduced-motion: reduce` makes updates immediate.
- Disconnecting cancels the pending animation frame and leaves a stable final value.

## Known limits

- The counter formats a single numeric value. It does not provide currency/unit-specific compact notation or a custom formatter callback.
- Very large magnitudes are subject to JavaScript Number precision.
- The component does not persist values or synchronize with a data source.
