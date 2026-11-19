# 🎉 Confetti Button

A native button wrapped in the VFX celebration effect layer. It emits a celebration event on activation and suppresses visual bursts when the user requests reduced motion.

## Quick start

~~~html
<script src="./components/confetti-button/index.js"></script>
<vfx-confetti-button label="Celebrate release"></vfx-confetti-button>
~~~

The component registers as `<vfx-confetti-button>`.

## Attributes and properties

| Attribute | Property | Default | Behavior |
|---|---|---|---|
| `label` | `label` | `Celebrate!` | Visible button text. Updates are inserted as text, never parsed as HTML. |
| `disabled` | `disabled` | `false` | Disables native activation and programmatic celebrations. |

## Methods

| Method | Result | Description |
|---|---|---|
| `celebrate()` | `boolean` | Triggers the VFX burst/shard effects and emits the celebration event. Returns false when disabled. |

## Events

The bubbling, composed `celebrate` event contains:

~~~js
{ label: 'Celebrate release', reducedMotion: false }
~~~

The event fires when the action is activated even under reduced motion. In that case `reducedMotion` is true and decorative burst/shard rendering is skipped.

## Accessibility and motion

- Uses a native button with explicit Enter/Space activation. Default key activation is prevented before the action runs, avoiding duplicate celebrations.
- Label text is safely assigned with `textContent`.
- Native disabled state is reflected on the internal button.
- Visible focus styling is provided.
- `prefers-reduced-motion: reduce` suppresses the animation while preserving the action and event.

## Known limits

- The component provides one fixed celebration style and does not expose burst shape, particle count, or color configuration.
- Effects are visual feedback only. Applications should use the `celebrate` event for any meaningful success or completion state.
- The component does not provide sound effects.
