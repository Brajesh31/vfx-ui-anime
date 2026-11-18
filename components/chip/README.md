# Chip

A selectable token with an optional remove action, press spring, and impact flecks.

## Usage

```html
<script src="./index.js"></script>
<vfx-chip selected>Anime</vfx-chip>
<vfx-chip removable label="Removable tag"></vfx-chip>
```

## API

- Element: `<vfx-chip>`
- `selected`: initial and reflected selection state.
- `removable`: shows a dismiss affordance; removal emits `remove` and removes the element.
- `disabled`: prevents selection and removal.
- `label`: optional text override.
- `change`: bubbles with `{ selected }` after selection changes.

## Accessibility

Uses native buttons with reflected `aria-pressed` and an explicit remove label. Disabled state is native.

## Demo

Open `demo.html` through a local HTTP server.
