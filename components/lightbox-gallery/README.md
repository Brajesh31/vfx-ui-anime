# 🖼️ VFX Lightbox Gallery

A responsive thumbnail gallery with an animated native-dialog viewer, previous/next navigation, captions, asynchronous image feedback, and focus restoration.

~~~html
<script src="/components/lightbox-gallery/index.js"></script>
<vfx-lightbox-gallery
  label="Project screenshots"
  items="City::/images/city.jpg|Forest::/images/forest.jpg|Concept art::"
></vfx-lightbox-gallery>
~~~

## Attributes and API

| Member | Contract |
|---|---|
| `items` attribute | Pipe-separated `label::imageURL` entries. Leave the URL empty to show a styled placeholder. |
| `items` property | Read-only array snapshot of the parsed gallery items. |
| `label` | Accessible name for the thumbnail group. |
| `activeIndex` | Read/write current item index. The setter delegates to `goTo(index)`. |

Methods: `open(index = 0)`, `close()`, `goTo(index)`, `next()`, and `previous()`. Navigation wraps around the ends. Methods return false when no item can be opened or moved to.

## Events

- `open`: selected index and item.
- `change`: new index and item.
- `close`: final index and item.
- `image-load`: image index, label, and source after the current viewer image loads.
- `image-error`: image index, label, and source when the current viewer image fails.

## Keyboard and accessibility

Each thumbnail is a labelled button. The viewer is a native modal dialog labelled by its current caption. Left/Right Arrow moves between images, and Escape uses native dialog dismissal. Closing returns focus to the original thumbnail when it still exists. The gallery group label can be changed dynamically.

## Dynamic behavior and limits

Changing the `items` attribute rebuilds the thumbnails, clamps the active index, updates an open viewer, and closes it when the collection becomes empty. Stale asynchronous image callbacks are ignored. Missing or failed image sources use a labelled placeholder. Supply image URLs your application is authorized to display; this component does not upload, transform, or persist images.
