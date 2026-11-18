# 🔁 VFX Transfer List

A dual-list selector for moving items between available and selected groups.

```html
<script src="/components/transfer-list/index.js"></script>
<vfx-transfer-list name="frameworks" items="react::React|vue::Vue|svelte::Svelte" value="vue"></vfx-transfer-list>
```

## API
- `items`: pipe-separated `id::label` entries.
- `value`: selected item IDs, readable and writable as an array.
- `selectedItems`: selected item objects.
- `moveToSelected(all?)` and `moveToAvailable(all?)`.

## Events
- `change`: selected IDs and selected item objects.

## Accessibility and limits
Each item is a keyboard-operable button with pressed/selected state. The list uses client-side state and a simple text filter. It does not synchronize with a server or support virtualized collections.
