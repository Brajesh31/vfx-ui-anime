# 📰 Marquee

A looping content strip with pause-on-hover, pause-on-focus, configurable duration, inert duplicate content, and reduced-motion support.

## Quick start

~~~html
<script src="./components/marquee/index.js"></script>
<vfx-marquee duration="22" label="Featured topics">
  <span>BUILD ✦ CREATE ✦ SHIP ✦</span>
</vfx-marquee>
~~~

The component registers as `<vfx-marquee>`. Its source embeds the shared VFX runtime and supports plain script loading.

## Attributes and properties

| Attribute | Property | Default | Behavior |
|---|---|---|---|
| `duration` | `duration` | `22` seconds | CSS loop duration, clamped to 4–120 seconds. |
| `paused` | `paused` | `false` | Pauses the animation while present. |
| `label` | `label` | `Scrolling content` | Accessible name for the scrolling viewport. |

The component duplicates assigned slot content to create the visual loop. Duplicate content is marked `aria-hidden` and `inert`; cloned IDs are removed, and cloned focusable descendants receive `tabindex="-1"` and `aria-hidden="true"`. The original slotted content remains the accessible and interactive copy.

Slot changes rebuild the duplicate track. The listener is removed while disconnected and restored on reconnect.

## Motion behavior

- Hovering the marquee pauses the loop.
- Keyboard focus anywhere inside the original slotted content pauses the loop.
- The `paused` attribute provides an application-controlled pause.
- `prefers-reduced-motion: reduce` removes the looping animation.
- The animation runs with CSS rather than a JavaScript timer.

## Events

The marquee does not emit interaction events. It is a presentation component.

## Known limits

- The duplicated content is a visual loop, not a second interactive content area. Interact only with original slotted content.
- The component does not provide built-in navigation buttons or an announcement queue.
- Very wide or complex slotted content can increase layout and clone costs.
- The CSS mask fade is visual decoration; browser support for mask images can vary.
