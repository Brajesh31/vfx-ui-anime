# Pagination

Page navigation with previous and next buttons, direct page selection, and a change event containing page and pages.

## Usage

```html
<script src="./index.js"></script>
<!-- See demo.html for a complete example. -->
```

## API

- Custom element: `<vfx-pagination>`.
- Load `index.js` with a plain script tag. No package dependencies are required.
- The component inherits the VFX UI Anime `--vfx-*` theme variables.
- Events bubble and are composed so they can be handled outside the component's shadow root.

## Accessibility

The implementation uses native HTML controls and semantic roles where applicable. Keyboard focus remains visible. OTP fields support numeric input and one-time-code autofill. Drawer uses the browser's native modal dialog behavior.

## Demo

Open `demo.html` in a browser over a local HTTP server.
