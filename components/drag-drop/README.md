# 🧲 VFX Drag and Drop

A reorderable list with native drag support, touch-friendly arrow controls, and keyboard movement.

```html
<script src="/components/drag-drop/index.js"></script>
<vfx-drag-drop items="Research|Prototype|Launch"></vfx-drag-drop>
```

## API
- `items`: pipe-separated labels.
- `items` property: read or replace the list with an array.
- `value`: returns a copy of the current ordered labels.
- `move(from, to)`: move by zero-based indexes; returns false for an invalid or no-op move.

## Events
- `change`: `detail.items`, `detail.from`, and `detail.to`.

## Interaction and accessibility
Native drag-and-drop works with a mouse. Each row also has Up and Down buttons for touch, switch, and keyboard users. With a row focused, use Alt+ArrowUp or Alt+ArrowDown to reorder it. Labels are escaped before rendering.

## Limits
This is a single-list sorter. It does not persist order, upload data, or synchronize with a server. Save `event.detail.items` in the host application.
