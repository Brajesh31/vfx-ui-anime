# Breadcrumb

Semantic path navigation with a directional trail when an ancestor is activated.

## Usage

```html
<script src="./index.js"></script>
<vfx-breadcrumb>
  <a href="/home">Home</a>
  <a href="/library">Library</a>
  <span>Current page</span>
</vfx-breadcrumb>
```

## API

- Element: `<vfx-breadcrumb>`
- Supply ancestor anchors followed by a final element for the current page.
- The last item receives `aria-current="page"` and is not navigable.
- Activating an ancestor emits a bubbling `navigate` event with `{ index, label, href }`.

## Accessibility

Uses a labelled navigation landmark, native anchors, and marks the current page. Keep ancestor links meaningful and ordered.

## Demo

Open `demo.html` through a local HTTP server.
