# 🗓️ VFX Date Range Picker

A form-associated start/end date control with quick presets, inclusive date ranges, chronological validation and configurable minimum/maximum dates.

## Quick start

```html
<script src="/components/date-range-picker/index.js"></script>
<form>
  <vfx-date-range-picker
    name="booking"
    label="Booking period"
    min="2026-11-01"
    max="2026-12-31"
    required
  ></vfx-date-range-picker>
  <button type="submit">Book dates</button>
</form>
```

## Public API

| API | Description |
|---|---|
| `value` | Read `{ start, end }`, or set an object or a `YYYY-MM-DD/YYYY-MM-DD` string |
| `valid` | Reports required, chronological and min/max validity |
| `preset("7")` | Select today through the next six days, inclusive |
| `preset("30")` | Select today through the next 29 days, inclusive |
| `preset("month")` | Select the current calendar month |
| `clear()` | Clear both dates unless disabled |

Attributes: `name`, `label`, `start`, `end`, `min`, `max`, `required` and `disabled`. Date, label and disabled constraints synchronize while the component is connected. Form reset restores the `start` and `end` attributes.

## Events

- `input`: date editing detail includes `start`, `end`, `valid`, `complete` and `value`.
- `change`: emitted when a valid selection is committed.
- `invalid`: emitted when a committed selection violates the range order or bounds.

## Form behavior

A complete valid range submits as `YYYY-MM-DD/YYYY-MM-DD`. Incomplete optional ranges submit an empty value. A required range must contain both dates. The end date cannot precede the start date. Min/max constraints apply to both endpoints.

## Notes

The component uses the browser's native date inputs. Calendar presentation and locale are controlled by the user's browser and operating system.
