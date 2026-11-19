# ✨ Particle Field

A responsive canvas particle background with configurable count, drift speed, color, and pause state. The animation is decorative and automatically becomes static when the user requests reduced motion.

## Quick start

~~~html
<script src="./components/particle-field/index.js"></script>
<vfx-particle-field count="48" speed="1" color="#e0d7ff"></vfx-particle-field>
~~~

The component registers as `<vfx-particle-field>`. Its single source file includes the shared VFX runtime.

## Attributes and properties

| Attribute | Property | Default | Behavior |
|---|---|---|---|
| `count` | `count` | `48` | Number of particles, clamped to 8–160. |
| `speed` | `speed` | `1` | Drift multiplier, clamped to 0–3. A value of 0 freezes particle positions. |
| `color` | `color` | `rgba(224,215,255,.7)` | Any color supported by the browser's CSS color parser. Invalid values use the default. |
| `paused` | `paused` | `false` | Freezes the animation at its current particle positions. |

Attribute and property updates are applied live. Invalid non-finite numeric property values are ignored. Numeric values are clamped to their documented ranges.

## Responsive and motion behavior

- The canvas uses device-pixel scaling capped at 3× to avoid excessive backing-store allocation.
- A `ResizeObserver` tracks host size. Browsers without it use a window resize listener.
- Resize observers and fallback listeners are removed on disconnect and restored on reconnect.
- `prefers-reduced-motion: reduce` freezes particle movement while retaining a static canvas.
- The `paused` attribute and a speed of 0 also stop particle movement.

## Events

The particle field does not emit interaction events. It is a decorative visual layer, not a control.

## Known limits

- The particle field is canvas-rendered and does not provide individually addressable particle nodes.
- Particle positions are randomized when new particles are added after a count increase.
- Color validation depends on the browser's CSS color support.
- The component is not an information visualization. Do not use it to encode data that users need to interpret.
