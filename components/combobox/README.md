# Combobox

An editable, filterable option picker with keyboard navigation, form association, and spring-highlight selection feedback.

## Usage

```html
<script src="./index.js"></script>
<vfx-combobox name="framework" label="Framework"><option value="react">React</option><option value="vue">Vue</option><option value="svelte">Svelte</option></vfx-combobox>
```

## API

- Element: `<vfx-combobox>`
- Provide child `<option>` elements with optional values and disabled states.
- `label`, `placeholder`, `value`, and `disabled` configure the field.
- Read or set `value`; `input` bubbles with `{ query, value }` while typing.
- `change` bubbles with `{ value, label, index }` after choosing an option.
- Arrow Up/Down moves through filtered options; Enter commits; Escape and Tab close.
- Form-associated when a `name` is supplied.

## Accessibility

Uses the combobox/listbox/option pattern, accessible label, active-descendant tracking, expanded state, keyboard selection, and native input focus.

## Demo

Open `demo.html` through a local HTTP server.
