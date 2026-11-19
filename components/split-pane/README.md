# 🪟 VFX Split Pane

A resizable two-panel layout with pointer dragging, keyboard resizing, live orientation changes, and accessible separator semantics.

~~~html
<script src="/components/split-pane/index.js"></script>
<vfx-split-pane value="42" min="20" orientation="vertical" label="Resize editor and preview">
  <section slot="primary">Editor</section>
  <aside slot="secondary">Preview</aside>
</vfx-split-pane>
~~~

## Attributes and API

| Member | Contract |
|---|---|
| `orientation` | `vertical` for side-by-side panes, `horizontal` for stacked panes. |
| `value` | Read/write primary pane percentage, clamped to the allowed interval. |
| `min` | Minimum percentage reserved for each pane. Defaults to 20 and is clamped to the supported 10–49 range. |
| `label` | Accessible name for the separator. |
| `disabled` | Removes the separator from keyboard focus and blocks pointer/keyboard resizing. |

The primary and secondary content are supplied through the `primary` and `secondary` slots. Without slotted content, the component renders its built-in panel examples.

## Events

- `input`: emitted during pointer movement and keyboard adjustment.
- `change`: emitted when the user commits a pointer or keyboard resize. Detail contains the new percentage and orientation.

## Accessibility and interaction

The divider uses the separator role and exposes its orientation, current value, minimum, maximum, and value text. Arrow keys adjust by 2 percentage points in the active orientation. Shift+Arrow adjusts by 10 points. Home and End move to the minimum and maximum allowed positions. Pointer dragging supports mouse, pen, and touch through pointer events.

## Limits

The percentage is split symmetrically around the configured minimum, so both panels retain at least that share. This component is a layout primitive, not a persistence layer; save the `value` in your application when a user's chosen layout must survive reloads.
