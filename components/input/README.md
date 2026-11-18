# Input

A text field that kicks up dust. Focus it and three wedges fly off the corner. Every key throws a puff of dust, and now and then a chip, from where the caret is, and the box gives a little.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/components/input/demo.html
```

## Use it

```html
<script src="index.js"></script>
<vfx-input label="Email" type="email" placeholder="you@example.com" name="email"></vfx-input>
```

```js
el.addEventListener('input', () => console.log(el.value));
el.value = 'hello';
```

| attribute | what it sets | default |
|---|---|---|
| `label` | what a screen reader calls it | Text |
| `placeholder`, `value` | like an input's | empty |
| `type` | text, email, search, url, tel or password | text |
| `autocomplete` | like an input's | off |
| `name` | sent with its form | none |
| `disabled` | can't be typed in | off |

- **Size:** 230 pixels wide; set `--vfx-input-width` to change it. `::part(input)` reaches the input.
- In a password field the dust still follows the caret, measured over dots.

## Limits

- **No validation styles.** `required`, `pattern` and the like are not passed through, and there is no invalid look.
- One line only; there is no textarea.


## Phase 2 refinements

- `required`, `readonly`, `minlength`, `maxlength` and `pattern` are now forwarded to the native input, including when changed after connection. The allowed input `type` and `autocomplete` attributes also stay synchronized.
- The custom element mirrors native validity through `ElementInternals` and exposes `validity`, `validationMessage`, `checkValidity()`, `reportValidity()` and `setCustomValidity()`.
- Form reset restores the initial `value` attribute. Form-disabled changes remain mirrored to the native input even while the custom element's own `disabled` attribute changes. Invalid state receives a visible style and `aria-invalid`.
- Reduced-motion mode settles the focus/typing spring without removing the caret dust when motion is enabled.