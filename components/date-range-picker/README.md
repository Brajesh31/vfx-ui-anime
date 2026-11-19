# 🗓️ VFX UI Anime Date Range Picker

A start/end date control with chronological validation, minimum and maximum bounds, quick presets, clear action, live feedback, and native form association.

## Quick start

```html
<script src="/components/date-range-picker/index.js"></script>

<form>
  <vfx-date-range-picker
    name="booking"
    label="Booking period"
    min="2026-11-20"
    max="2026-12-31"
    start="2026-11-20"
    end="2026-11-27"
    required
  ></vfx-date-range-picker>
  <button type="submit">Continue</button>
</form>
```

## API

| Member | Type | Description |
|---|---|---|
| `value` | object or string | Read `{ start, end }`; set with the same object or a `YYYY-MM-DD/YYYY-MM-DD` string. |
| `valid` | boolean | True when the range satisfies ordering, required, and bound constraints. |
| `preset(kind)` | method | Selects `7`, `30`, or `month`. Presets include the current date. |
| `clear()` | method | Clears both dates. Returns false when disabled. |

### Attributes

| Attribute | Default | Description |
|---|---|---|
| `name` | empty | Form field name. |
| `label` | `Choose date range` | Visible control label. |
| `start`, `end` | empty | Initial dates and reset values, in ISO date format. |
| `min`, `max` | none | Inclusive ISO date bounds. |
| `required` | false | Requires both dates. |
| `disabled` | false | Disables fields, presets, and clear action. |

### Events

- `input`: reports interim date edits with `start`, `end`, `valid`, `complete`, and `value`.
- `change`: reports a committed valid selection.
- `invalid`: reports an invalid committed selection.

Events bubble and cross the shadow boundary.

## Form behavior and validation

A complete valid range is submitted as `YYYY-MM-DD/YYYY-MM-DD`. Incomplete or invalid ranges submit an empty value. Required, chronological, minimum, and maximum constraints participate in form validity. Native date inputs provide their platform date-entry behavior.

## Accessibility and responsive behavior

Both fields have explicit labels and connect to a live validation summary. Invalid state is exposed on the affected input. Buttons remain keyboard-operable, and the field layout collapses to one column on narrow screens.

## Limits

The component handles local calendar dates, not time zones or instants. Applications that convert these dates to timestamps must define their own time-zone policy. Presets use the user's local calendar date.

## Standalone behavior

The component is dependency-free and can be loaded with a plain script tag.
