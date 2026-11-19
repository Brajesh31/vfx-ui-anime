# 🧩 VFX Multi Select

A filterable multi-select popover with removable selection chips, keyboard navigation, live option updates, and native form association.

~~~html
<script src="/components/multi-select/index.js"></script>
<vfx-multi-select
  name="frameworks"
  label="Frameworks"
  placeholder="Choose frameworks"
  options="react::React|vue::Vue|svelte::Svelte"
  value="react,vue"
  required
></vfx-multi-select>
~~~

## API

| Member | Contract |
|---|---|
| `options` attribute | Pipe-separated values. Use `value::label`; labels alone receive numeric string values. |
| `value` property | Read/write array of selected value strings. A comma-separated string is also accepted by the setter. |
| `selectedOptions` | Read-only array of selected `{ value, label }` objects. |
| `label` attribute | Accessible name for the trigger and listbox. |
| `placeholder` attribute | Empty-selection summary text. |
| `required` / `disabled` | Native form-required and disabled state. |

Methods: `open()`, `close()`, `toggleValue(value)`, and `clear()`. Opening returns false when disabled or already open. Selection methods return false when blocked or when the requested option is not present.

## Events

- `open` and `close`: include the current selected values.
- `input`: emitted after a selection change.
- `change`: includes selected values and selected option objects.

## Keyboard and forms

The trigger opens the panel and moves focus to its filter. Arrow Up/Down and Home/End move through visible options. Enter/Space toggles the focused option, Arrow Down from the filter focuses the first option, and Escape closes the panel and restores focus to the trigger. Chip removal buttons are independently keyboard operable.

With a `name`, selected values are submitted as a comma-separated string. The required state uses form validity, form reset restores the initial `value`, and disabled/fieldset-disabled states block interaction and submission.

## Dynamic behavior and limits

Changing `options` removes selections that no longer exist. The `value`, `label`, and `placeholder` attributes update the rendered state. Duplicate option values and blank entries are ignored. This is a local selector; it does not fetch remote options or virtualize very large result sets.
