# 🗓️ VFX Date Range Picker

A start/end date control with quick range presets, chronological validation, and form association.

```html
<script src="/components/date-range-picker/index.js"></script>
<vfx-date-range-picker name="booking" start="2026-11-20" end="2026-11-27"></vfx-date-range-picker>
```

## API
- `value`: object `{start, end}`, or a `start/end` string.
- `valid`: whether the end date is on or after the start date.
- Methods: `preset("7")`, `preset("30")`, `preset("month")`, and `clear()`.
- Attributes: `start`, `end`, `min`, `max`, and `label`.

## Events
- `change`: reports the selected range. `invalid` reports impossible ordering.

## Form behavior
With a `name` attribute, the valid range is submitted as `YYYY-MM-DD/YYYY-MM-DD`. Incomplete ranges submit an empty value.
