# 🧭 VFX Radial Menu

A compact action launcher that fans out around its center trigger with keyboard movement and explicit selection events.

```html
<script src="/components/radial-menu/index.js"></script>
<vfx-radial-menu items="Create|Edit|Share|Preview|Export|Settings"></vfx-radial-menu>
```

## API
- `items`: pipe-separated action labels, up to eight.
- `opened`: read-only open state.
- `show()` and `hide()`: open or close the menu.
- `choose(index)`: activate an action.

## Events
- `open`, `close`, and `select`. The select event detail includes `index` and `label`.

## Accessibility
The center trigger exposes `aria-expanded` and an action-specific label. Escape closes the menu. Arrow keys move focus between actions.

## Limits
The component emits intent only. It does not perform the selected action. Connect the `select` event to application logic.
