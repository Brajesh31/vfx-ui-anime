# Sakuga Accordion

A disclosure component with a real expanded state, springing chevron and manga impact when opened.

## Usage

```html
<script src="./accordion.js"></script>
<sakuga-accordion label="More details">
  Put the expandable content here.
</sakuga-accordion>
```

- Use the `open` attribute or `element.open` property for state.
- Use `disabled` to prevent interaction.
- Fires a bubbling, composed `change` event with `detail.open`.
- Content remains real DOM content and is hidden when collapsed.
