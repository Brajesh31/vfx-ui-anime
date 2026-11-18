# Calendar

A standalone month-grid calendar with page-turn motion, date-impact effects, keyboard navigation, date bounds, and form association.

## Usage

```html
<script src="./index.js"></script>
<vfx-calendar name="event-date" value="2026-11-18" min="2026-01-01"></vfx-calendar>
```

## API

- Element: `<vfx-calendar>`
- `value`: selected date in local `YYYY-MM-DD` format.
- `min` and `max`: inclusive date bounds.
- `disabled`: disables date selection.
- `locale`: optional locale for month and date labels.
- `change`: bubbles with `{ value, date }`; clearing emits an empty value and null date.
- Arrow keys move by day or week; Home/End move to week bounds; PageUp/PageDown move by month.
- Form-associated when a `name` is supplied.

## Accessibility

Uses labelled date buttons, selected/current-date state, visible focus, and keyboard date navigation. State does not depend on animation completing.

## Demo

Open `demo.html` through a local HTTP server.
