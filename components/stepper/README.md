# Stepper

A bounded quantity control with spring feedback, directional effects, keyboard shortcuts, and form association.

## Usage

```html
<script src="./index.js"></script>
<vfx-stepper name="quantity" label="Quantity" value="2" min="0" max="10" step="1"></vfx-stepper>
```

## API

- Element: `<vfx-stepper>`
- `value`, `min`, `max`, and `step` define the numeric range.
- `label` provides the visible group label.
- `disabled` disables both buttons.
- `change` bubbles with `{ value }` after a user-initiated change.
- Arrow keys adjust the value; Home and End move to the bounds.
- Form-associated; provide a `name` to include it in form submission.

## Accessibility

Buttons have explicit accessible names, the control has a labelled group, and the current value is announced through a polite live output.

## Demo

Open `demo.html` through a local HTTP server.
