# Context Menu

A pointer-anchored action menu with right-click and keyboard activation, viewport-aware positioning, focus movement, and impact-snap feedback.

## Usage

```html
<script src="./index.js"></script>
<vfx-context-menu items="Open|Copy link|Rename|Delete"><div tabindex="0">Right-click this area</div></vfx-context-menu>
```

## API

- Element: `<vfx-context-menu>`
- `items`: pipe-separated menu labels.
- `disabled`: prevents opening.
- Right-click opens the menu; Shift+F10 or ContextMenu key opens it for keyboard users.
- Events: `open` with pointer coordinates and `select` with `{ index, label, value, danger }`.

## Accessibility

Menu items use native buttons and menu roles. Arrow Up/Down and Home/End move focus; Escape closes. The slotted trigger should be keyboard-focusable.

## Demo

Open `demo.html` through a local HTTP server.
