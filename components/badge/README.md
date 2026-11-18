# Badge

A compact status marker with a spring entrance, status-specific colour, optional pulse, and animated status updates.

## Usage

```html
<script src="./index.js"></script>
<vfx-badge status="success" pulse>Deployed</vfx-badge>
```

## API

- Element: `<vfx-badge>`
- `status`: `success`, `warning`, `error`, `info`, or `neutral`.
- `label`: optional text override; otherwise the element's text is used.
- `pulse`: enables a restrained live-status pulse.
- Updating `status` animates the marker and impact accents.
- Colours use the shared `--vfx-*` theme tokens.

## Accessibility

The badge exposes `role="status"`. Keep its text meaningful and do not communicate state through colour alone.

## Demo

Open `demo.html` through a local HTTP server.
