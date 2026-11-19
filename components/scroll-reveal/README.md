# 👀 Scroll Reveal

An Intersection Observer-based wrapper that reveals slotted elements as they enter the viewport. It supports dynamic children, repeatable reveal/conceal events, configurable threshold and transition distance, and observer cleanup.

## Quick start

~~~html
<script src="./components/scroll-reveal/index.js"></script>
<vfx-scroll-reveal>
  <article>Content appears when it enters the viewport.</article>
</vfx-scroll-reveal>
~~~

The component registers as `<vfx-scroll-reveal>`.

## Attributes and properties

| Attribute | Property | Default | Behavior |
|---|---|---|---|
| `threshold` | `threshold` | `0.12` | Intersection ratio from 0.01 to 0.95. |
| `once` | `once` | `true` | Reveals an item once. Set the property to `false` or attribute to `once="false"` to reveal on entry and conceal on exit. |
| `disabled` | `disabled` | `false` | Makes assigned children visible without observing them. |
| `distance` | `distance` | `20` px | Initial vertical offset, clamped to 0–200 px. |
| `duration` | `duration` | `600` ms | Opacity/transform transition duration, clamped to 0–5000 ms. |

All configuration properties can be updated after connection. Assigned direct child elements are observed. A slot-change listener detects added and removed slotted elements.

## Events

Events bubble and cross the component's shadow boundary.

| Event | Detail | When |
|---|---|---|
| `reveal` | `{ target, index }` | A child becomes visible for the first time in the current reveal cycle. |
| `conceal` | `{ target, index }` | A previously revealed child leaves the viewport while `once` is false. |

The `target` field is the actual slotted element. `index` is its current index in the assigned element list.

## Lifecycle and accessibility

- Intersection Observer is used when available.
- When Intersection Observer is unavailable, assigned children are shown immediately rather than left invisible.
- Observers are disconnected on removal and recreated after reconnection.
- Dynamic slot changes unobserve removed children and observe newly assigned children.
- The `disabled` state reveals all children.
- `prefers-reduced-motion: reduce` makes content visible without transitions.
- Content remains in its original DOM position and reading order.

## Known limits

- The component observes direct assigned child elements, not every descendant.
- Reveal timing depends on viewport intersection and browser scheduling.
- CSS opacity is a presentation effect. The component does not remove hidden elements from layout.
- When `once` is true, revealed elements remain visible after leaving the viewport.
