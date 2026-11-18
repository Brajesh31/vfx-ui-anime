# Avatar

A portrait element with initials fallback, optional image, presence indicator, and spring entrance.

## Usage

```html
<script src="./index.js"></script>
<vfx-avatar name="Brajesh Kumar" status="online" size="large"></vfx-avatar>
```

## API

- Element: `<vfx-avatar>`
- `name`: accessible name and initials source.
- `src`: optional image URL. A failed image falls back to initials and emits `image-error`.
- `status`: `online`, `busy`, `away`, or `offline`; omit to hide the indicator.
- `size`: `small`, default, `large`, or `xl`.

## Accessibility

The portrait exposes an image role and accessible name. Presence is decorative, so provide meaningful context elsewhere when presence matters.

## Demo

Open `demo.html` through a local HTTP server.
