# ⏰ VFX Time Picker

A time input with quick presets, keyboard-native editing, adjustable minute steps, and form support.

```html
<script src="/components/time-picker/index.js"></script>
<vfx-time-picker name="meeting" value="09:30" step="15" presets="08:00|09:00|12:00|17:00"></vfx-time-picker>
```

## API
- `value`: time in 24-hour `HH:MM` format.
- `step`: minute increment for the +/- controls.
- `presets`: pipe-separated quick choices.
- `setTime(value)` and `adjust(minutes)`.

## Events
- `change`: includes the time value, hours, and minutes.

## Accessibility
The native time input retains browser keyboard and assistive-technology behavior. Presets and increment/decrement buttons have accessible labels. With a `name`, the value is included in form data.
