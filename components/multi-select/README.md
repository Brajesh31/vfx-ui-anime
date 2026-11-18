# 🧩 VFX Multi Select

A filterable multi-select popover with removable selection chips, keyboard operation, and form association.

```html
<script src="/components/multi-select/index.js"></script>
<vfx-multi-select name="frameworks" options="react::React|vue::Vue|svelte::Svelte" value="react,vue"></vfx-multi-select>
```

## API
- `options`: pipe-separated `value::label` options, or labels alone.
- `value`: selected option values as an array, readable and writable.
- `selectedOptions`: selected option objects.
- `open()`, `close()`, and `clear()`.

## Events
- `open`, `close`, and `change`. Change detail includes selected values and option objects.

## Accessibility
The trigger reports expanded state, options expose listbox semantics and selected state, and Arrow, Enter, Space, and Escape are supported. With a `name`, the selected values are submitted as a comma-separated string.

## Limits
This is a local selection control. It does not fetch remote options or virtualize very large result sets.
