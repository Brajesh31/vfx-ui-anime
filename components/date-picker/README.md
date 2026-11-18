# Date Picker

A date-selection popover with spring reveal, page-turn month transitions, impact feedback, date bounds, and form association.

## Usage

```html
<script src="./index.js"></script>
<vfx-date-picker name="launch-date" label="Launch date" min="2026-01-01"></vfx-date-picker>
```

## API

- Element: `<vfx-date-picker>`
- `value`: selected local date in `YYYY-MM-DD` format.
- `label` and `placeholder`: visible field label and empty-state text.
- `min` and `max`: inclusive date bounds.
- `disabled`: disables the trigger.
- `change`: bubbles with `{ value, date }` after selection.
- Methods: `show()` and `hide()`; read-only property: `opened`.
- Form-associated when a `name` is supplied.

## Accessibility

The trigger exposes dialog semantics and expanded state. Days are labelled buttons, reflect selection, and support arrow-key movement. Escape closes the popover.

## Demo

Open `demo.html` through a local HTTP server.
