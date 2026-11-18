# Radio

A radio group. The picked dot springs in, a fan of wedges goes off it, two puffs drift away, and a hollow ポン pops up beside it.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/components/radio/demo.html
```

## Use it

List the choices as `<option>`s inside it:

```html
<script src="index.js"></script>
<vfx-radio label="Plan" name="plan">
  <option value="free" selected>Free</option>
  <option value="pro">Pro</option>
</vfx-radio>
```

```js
el.addEventListener('change', () => console.log(el.value));
el.value = 'pro';     // from code: no effects
```

| attribute | what it sets | default |
|---|---|---|
| `label` | what a screen reader calls the group | Options |
| `value` | which one is picked (overrides `selected` on the options) | the `selected` option |
| `name` | sent with its form | none |
| `disabled` | can't be changed | off |

- **The options are read once,** when it first appears. Changing them afterwards does nothing; replace the element instead.
- **Underneath are real radio inputs,** so the arrow keys move between them.

## Limits

- One column only.


## Phase 2 refinements

- Form reset restores the initial selected option. A `required` attribute exposes `aria-required` and native form validity through `ElementInternals`.
- The group label updates after connection. Form-disabled changes are mirrored to the native radio inputs.
- Reduced-motion mode snaps the selected dots to their final positions without replaying spring travel.