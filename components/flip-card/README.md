# 🃏 3D Flip Card

A reversible two-sided card with a native button control, reflected state, dynamic front/back content, and reduced-motion support.

## Quick start

~~~html
<script src="./components/flip-card/index.js"></script>

<vfx-flip-card
  front="Question"
  back="Answer"
></vfx-flip-card>
~~~

The component registers as `<vfx-flip-card>`. Its source embeds the shared VFX runtime and can be loaded on its own.

## Attributes and properties

| Attribute | Property | Default |
|---|---|---|
| `front` | `front` | Front side |
| `back` | `back` | Back side |
| `flipped` | `flipped` | `false` |

Front and back text updates immediately when attributes or properties change. Text is inserted through text nodes, not HTML parsing. The `flipped` property reflects the host attribute, so applications can read or set the state directly.

## Methods

| Method | Result | Description |
|---|---|---|
| `toggle()` | `boolean` | Reverses the current state and returns the new state. |
| `toggle(value)` | `boolean` | Sets the state to the supplied boolean and returns it. If the requested state is already active, no duplicate change event is emitted. |

## Events

The bubbling, composed `change` event has this detail:

~~~js
{ flipped: true, front: 'Question', back: 'Answer' }
~~~

The event is emitted only when the state actually changes.

## Keyboard and accessibility

- The flip surface is a native button and supports Enter and Space.
- `aria-pressed` mirrors the flipped state.
- The button's accessible name describes the action and the next face.
- The inactive face is marked `aria-hidden`, avoiding duplicate front/back text in the accessibility tree.
- A visible focus indicator remains on the button.
- The CSS transition is removed when `prefers-reduced-motion: reduce` is active.

## Known limits

- Each face is a text label rather than a slot for arbitrary rich content.
- The component does not manage card decks, persistence, shuffle, or scoring behavior.
- Three-dimensional rendering quality depends on the browser and display compositing support.
