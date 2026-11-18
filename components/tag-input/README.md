# Tag Input

A token input. Press Enter to add a tag, use each remove button to delete one, or press Backspace on an empty field to remove the last tag.

## Usage

```html
<script src="./index.js"></script>
<!-- See demo.html for a complete example. -->
```

## API

- Custom element: `<vfx-tag-input>`.
- Load `index.js` with a plain script tag. No package dependencies are required.
- The component inherits the VFX UI Anime `--vfx-*` theme variables.
- Events bubble and are composed so they can be handled outside the component's shadow root.

## Accessibility

The implementation uses native HTML controls and semantic roles where applicable. Keyboard focus remains visible. OTP fields support numeric input and one-time-code autofill. Drawer uses the browser's native modal dialog behavior.

## Demo

Open `demo.html` in a browser over a local HTTP server.
