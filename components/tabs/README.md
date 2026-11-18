# Tabs

The raised tab itself slides to the one you pick, stretching as it goes, and lands with wedges above it, a puff at the side it came from and speed lines behind it.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/components/tabs/demo.html
```

## Use it

List the tabs as `<option>`s inside it:

```html
<script src="index.js"></script>
<vfx-tabs label="Account">
  <option value="home">Home</option>
  <option value="profile">Profile</option>
  <option value="settings">Settings</option>
</vfx-tabs>
```

```js
el.addEventListener('change', (e) => showPanel(e.detail.value));   // e.detail: { index, value, label }
el.selected = 2;     // from code: moves without the landing effects
el.value;            // the picked option's value
```

| attribute | what it sets | default |
|---|---|---|
| `label` | what a screen reader calls the tab list | Tabs |
| `selected` | the index picked at the start | 0 |

- **It only draws the tabs.** Show and hide your panels on `change`.
- **Keyboard:** the arrow keys move and wrap round, Home and End go to the ends.

## Limits

- **No panels and no `aria-controls`,** because the panels are outside its shadow root. Give each panel `role="tabpanel"` and a label yourself.
- **They do not scroll.** Too many tabs for the width will overflow.


## Phase 2 refinements

- The tab strip now supports horizontal scrolling when its options exceed the available width, while retaining the springing active indicator.
- Resize observation is stored and disconnected when the component leaves the document. It is reattached on reconnect, with a window-resize fallback.
- Reduced-motion mode snaps the active indicator to its selected tab and suppresses the landing sequence. The component still intentionally leaves panel ownership to the consuming application.