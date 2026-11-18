# Sakuga Like

A semantic like/favorite button with a spring press, heart pop, impact burst, crystal shards, ポン lettering and a glint.

## Usage

```html
<script src="./like.js"></script>
<sakuga-like id="favorite"></sakuga-like>
<script>
  document.querySelector("#favorite").addEventListener("change", (event) => {
    console.log(event.detail.pressed);
  });
</script>
```

- `aria-pressed` reflects the current state.
- Fires a bubbling, composed `change` event with `detail.pressed`.
- Set `size="small"` for a compact button.
- Honors the shared reduced-motion behavior.
