# 🪄 3D Tilt Card

A decorative perspective card that reacts to mouse and pen position. Content can be updated after connection and custom content can be supplied through its default slot.

## Quick start

~~~html
<script src="./components/tilt-card/index.js"></script>

<vfx-tilt-card
  title="Launch ready"
  description="Move a mouse or pen across this card"
>
  <p>Custom slotted content</p>
</vfx-tilt-card>
~~~

The component registers as `<vfx-tilt-card>`. The source file includes the shared VFX runtime and works independently.

## Attributes and properties

| Attribute | Property | Default |
|---|---|---|
| `title` | `title` | 3D perspective |
| `description` | `description` | Move your pointer over this card |

Both attributes update the rendered text when changed after connection. Values are assigned using text nodes and are not parsed as HTML.

## Behavior

- Mouse and pen movement tilt the card relative to its bounding rectangle.
- The highlight follows the pointer within the card.
- Pointer coordinates are clamped to the card bounds.
- Leaving or cancelling a pointer interaction returns the card to its neutral transform.
- Touch pointer movement does not apply a tilt.
- Zero-size elements are ignored instead of producing invalid transforms.
- The component does not capture the pointer or prevent normal page gestures.

## Methods

| Method | Result | Description |
|---|---|---|
| `reset()` | `boolean` | Restores the neutral card angle and centered highlight. |

## Accessibility and motion

The card is informational, not an interactive control. Its text and slotted descendants remain in normal document reading order. The highlight is decorative and hidden from assistive technology. The `prefers-reduced-motion: reduce` media query removes the transform transition and suppresses pointer-driven tilt.

## Known limits

- Tilt is a visual enhancement and does not expose a numeric angle API or emit pointer telemetry events.
- The component does not provide an automatic keyboard tilt mode because it has no action or selection state.
- The component does not add image loading, drag behavior, or card navigation semantics.
