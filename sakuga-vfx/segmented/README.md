# Sakuga Segmented

A single-choice segmented control. Supply options as child `<option>` elements.

## Usage

```html
<script src="./segmented.js"></script>
<sakuga-segmented label="Period" id="period">
  <option value="day" selected>Day</option>
  <option value="week">Week</option>
  <option value="month">Month</option>
</sakuga-segmented>
<script>
  document.querySelector("#period").addEventListener("change", (event) => {
    console.log(event.detail.value, event.detail.label);
  });
</script>
```

- Read or set `element.value`.
- Fires a bubbling, composed `change` event with `detail.value`, `detail.index` and `detail.label`.
- Use `disabled` to disable the choices.
