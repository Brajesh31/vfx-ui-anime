# ⏰ VFX Time Picker

A time input with quick presets, keyboard-native editing, bounded minute adjustments, accessible labels, and native form association.

~~~html
<script src="/components/time-picker/index.js"></script>
<vfx-time-picker
  name="meeting"
  label="Meeting time"
  value="09:30"
  min="08:00"
  max="18:00"
  step="15"
  presets="08:00|09:00|12:00|13:30|17:00"
  required
></vfx-time-picker>
~~~

## Attributes and API

| Member | Contract |
|---|---|
| `value` | 24-hour time in `HH:MM` format. |
| `step` | Positive whole-number minute increment for the +/- controls. Defaults to 15 minutes and is capped at 720. |
| `min` / `max` | Inclusive time bounds in `HH:MM` format. |
| `presets` | Pipe-separated quick choices. Invalid time strings are ignored. |
| `label` | Visible and accessible field label. |
| `disabled` / `required` | Native form state. |

The `value` property is readable and writable. `setTime(value, emit = true)` validates the input format and returns false for malformed times. `adjust(minutes)` moves by the requested number of minutes and returns false when the result would exceed the day or configured bounds.

## Events

- `input`: emitted while the native time input changes and after supported adjustments.
- `change`: emitted when a time is committed through native change, presets, or adjustment. Detail includes the `value`, `hours`, and minute-of-hour value.

## Accessibility and forms

The component uses a native `input[type=time]`, preserving browser keyboard and assistive-technology behavior. The +/- controls and presets have accessible names; selected presets expose `aria-pressed`. With a `name`, a non-empty valid time is submitted. Required, min, max, and step constraints contribute to form validity. Form reset restores the initial value, or 09:30 when no value attribute was supplied.

## Limits

Values use the browser's 24-hour `HH:MM` format. This component does not model time zones, dates, recurring schedules, or intervals that cross midnight.
