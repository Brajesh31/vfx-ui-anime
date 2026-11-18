# 🪟 VFX Split Pane

A resizable two-panel layout with pointer dragging, keyboard resizing, and separator semantics.

```html
<script src="/components/split-pane/index.js"></script>
<vfx-split-pane value="42">
  <section slot="primary">Editor</section>
  <aside slot="secondary">Preview</aside>
</vfx-split-pane>
```

## API
- `orientation`: `vertical` for side-by-side panes, `horizontal` for stacked panes.
- `value`: primary pane percentage.
- `min`: minimum pane percentage, default 20.
- `value` is readable and writable.

## Events
- `input`: live pane percentage while dragging or keyboard resizing.
- `change`: committed pane percentage and orientation.

## Accessibility
The divider is a focusable separator with current/min/max values. Arrow keys adjust by 2%, Shift is not required, and Home/End go to the allowed bounds.
