# 🌈 VFX Gradient Picker

A two-color linear-gradient editor with angle control, visual presets, live preview, and form association.

```html
<script src="/components/gradient-picker/index.js"></script>
<vfx-gradient-picker name="background" from="#ff5fa8" to="#8f8df7" angle="135"></vfx-gradient-picker>
```

## API
- `from`, `to`: six-digit hexadecimal colors.
- `angle`: direction in degrees.
- `value`: CSS `linear-gradient(...)` string, readable and writable for two-color six-digit hex gradients.

## Events
- `change`: CSS value, both colors, and angle.
- `copy-request`: emits the CSS value for the host application to copy if appropriate.

## Form behavior
With a `name` attribute the gradient CSS string is submitted as the field value.
