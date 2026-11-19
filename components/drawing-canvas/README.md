# 🖌️ Drawing Canvas

A responsive, dependency-free drawing surface with pointer, touch, and keyboard input, bounded undo history, clear, and PNG export.

## Quick start

~~~html
<script src="./components/drawing-canvas/index.js"></script>
<vfx-drawing-canvas label="Sketch pad" color="#6558d9" size="4"></vfx-drawing-canvas>
~~~

The component registers as **vfx-drawing-canvas**. Its source file includes the shared VFX runtime, so it can be loaded on its own.

## Attributes and properties

| Attribute | Property | Default | Behavior |
|---|---|---|---|
| label | label | Drawing surface... | Accessible name announced when the canvas receives focus. |
| color | color | #6558d9 | Hex ink color in #RRGGBB form. Invalid attribute values fall back to the default. |
| size | size | 4 | Brush width in CSS pixels, rounded and clamped to 1 through 24. |
| disabled | disabled | false | Disables drawing, brush controls, undo, clear, and export. |

Attribute changes update the visible controls and accessible name after the element is connected. The color property ignores invalid values. The size property ignores non-finite input and clamps valid numeric values.

## Methods

| Method | Result | Description |
|---|---|---|
| clear() | boolean | Clears the surface, records the previous image for undo, and emits clear and change. |
| undo() | boolean | Restores the previous saved image. Returns false when disabled or when history is empty. |
| toDataURL() | string | Returns the current drawing as a PNG data URL, or an empty string if export is unavailable. |
| download() | boolean | Requests a local drawing.png download and emits the export result. |

Undo history is bounded to the most recent 20 drawing actions. Resizing preserves the visible image. A ResizeObserver keeps the bitmap aligned with the rendered canvas; older environments use a window-resize fallback. The observer and fallback listener are cleaned up when the element is disconnected and restored when it reconnects.

## Events

Events bubble and cross the component's shadow boundary.

| Event | Detail |
|---|---|
| change | { input, dataUrl }, where input is pointer, keyboard, clear, or undo. |
| clear | {}, emitted after a successful clear. |
| undo | {}, emitted after a successful undo. |
| export | { dataUrl, mimeType: "image/png" }, emitted when a PNG download is requested. |
| export-error | { reason }, emitted if a PNG data URL cannot be created. |

## Keyboard and accessibility

- Tab to focus the drawing surface.
- Use the arrow keys to draw from the current keyboard cursor.
- Hold Shift with an arrow key for 1-pixel movement. Regular arrow movement advances by 8 pixels.
- The canvas exposes an accessible name, keyboard shortcut metadata, and a live status/instruction description.
- The native ink, brush-size, and action buttons retain their built-in keyboard behavior.
- The disabled state is exposed through aria-disabled and native disabled controls.

## Data and privacy

Drawing pixels remain in the browser. The component does not upload, persist, or transmit the drawing. Applications decide what to do with the PNG data URL or the change event payload.

## Known limits

- The brush accepts six-digit hexadecimal colors, not arbitrary CSS color syntax.
- The component provides freehand strokes, not shape tools, layers, erasing, or pressure-sensitive brush dynamics.
- The undo stack holds at most 20 snapshots. Large high-density canvases can use substantial browser memory.
- PNG export depends on browser canvas support and can be restricted by browser security rules when an application deliberately draws cross-origin assets onto the canvas. This component does not load external assets.
