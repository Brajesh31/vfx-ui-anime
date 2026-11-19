# 🌈 VFX Gradient Picker

A form-associated linear-gradient editor with up to eight independently editable color stops, stop positions, angle control, presets, live CSS output and change events.

## Quick start

```html
<script src="/components/gradient-picker/index.js"></script>
<form>
  <vfx-gradient-picker
    name="background"
    from="#ff5fa8"
    to="#8f8df7"
    angle="135"
  ></vfx-gradient-picker>
  <button type="submit">Apply</button>
</form>
```

## Public API

| API | Description |
|---|---|
| `value` | Read/write a supported CSS `linear-gradient(...)` string |
| `stops` | Read/write an array of `{ id, color, position }` stops |
| `from`, `to` | Read/write the first and last stop colors |
| `angle` | Read/write the gradient direction from 0 to 360 degrees |
| `addStop(color?)` | Add a stop at a useful position, up to eight stops |
| `removeStop(id)` | Remove a stop when at least two remain |
| `selectStop(id)` | Select a stop for editing |

The `stops` attribute accepts a JSON array or the compact `#hex@position|#hex@position` format. The `value` parser supports linear gradients with two to eight six-digit hexadecimal color stops and optional percentage positions. Invalid values are ignored rather than partially applied.

## Events

- `input`: live detail includes CSS `value`, `from`, `to`, `angle` and a copy of `stops`.
- `change`: committed control changes, stop additions/removals and preset changes.
- `copy-request`: requests that the host application copy the current CSS value. The component does not access the clipboard by itself.

## Form and accessibility

With a `name` attribute the current CSS gradient is submitted as the field value. The stop selector, color input, position slider, angle slider and action buttons have accessible names and visible focus styles. A disabled host disables editing controls.

## Limits

The editor intentionally supports linear gradients made from six-digit hex colors. It does not parse radial/conic gradients, named colors, alpha colors, color spaces or arbitrary CSS expressions.
