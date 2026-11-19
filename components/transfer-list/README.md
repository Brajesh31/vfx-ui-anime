# 🔁 VFX Transfer List

A dual-list selector for moving items between available and selected groups, with filtering, bulk actions, dynamic data, and form support.

~~~html
<script src="/components/transfer-list/index.js"></script>
<vfx-transfer-list
  name="frameworks"
  available-label="Available frameworks"
  selected-label="Included frameworks"
  items="react::React|vue::Vue|svelte::Svelte"
  value="vue"
></vfx-transfer-list>
~~~

## Attributes and API

| Member | Contract |
|---|---|
| `items` attribute | Pipe-separated `id::label` entries. |
| `items` property | Read/write array of objects with non-empty `id` and `label` fields. |
| `value` | Read/write array of selected item IDs; the attribute accepts comma-separated IDs. |
| `selectedItems` | Read-only selected item objects. |
| `available-label` / `selected-label` | Visible group titles and corresponding listbox accessible names. |
| `disabled` | Blocks selection and movement. |

Methods: `moveToSelected(all = false)` and `moveToAvailable(all = false)`. Passing true moves all items in the relevant direction. Both methods return false when no item can be moved or the component is disabled.

## Events

- `input` and `change`: include selected IDs and selected item objects.

## Keyboard and forms

Items are real buttons, so they can be marked with standard Tab, Enter, and Space interaction. Movement controls have accessible labels. The live status text reports the selected item count.

With a `name`, the selected IDs are submitted as a comma-separated string. Form reset restores the initial `value`; disabled and fieldset-disabled states block changes and remove the form value.

## Dynamic behavior and limits

Changing `items` through the attribute or property rebuilds both lists, ignores duplicate or incomplete IDs, and removes selections that no longer exist. The available-list search filters available entries. This component keeps data locally and does not synchronize with a server or virtualize large collections.
