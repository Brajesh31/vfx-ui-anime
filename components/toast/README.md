# Toast

A notification that streaks in from the left as a smear, with speed lines behind it, lands in a cloud of dust with ズザッ in dotted letters, wobbles, and after a while leaves by shrinking.

## Run it

```sh
python3 -m http.server 8000     # from the repo folder
# open http://localhost:8000/components/toast/demo.html
```

## Use it

```html
<script src="index.js"></script>
<vfx-toast style="position: fixed; left: 24px; bottom: 24px"></vfx-toast>
```

```js
el.show('Saved successfully!');
el.hide();
el.open;    // true while it is showing
```

| attribute | what it sets | default |
|---|---|---|
| `duration` | seconds it stays | 2.6 |
| `message` | the words when `show()` is given none | Saved successfully! |

- **Put the element where the toast should be.** It is 236 by 56 pixels and keeps that space while hidden; position it yourself, usually fixed in a corner.
- **The message is in a `role="status"` region,** so a screen reader reads it out. The ✕ is a real button.
- **One at a time.** Calling `show()` again replaces the message and plays the arrival again.

## Limits

- **No stack** of several toasts, and no kinds (error, warning). The icon is always the tick.
- **One line.** A long message is cut off with an ellipsis.


## Phase 2 refinements

`show(text, options)` now accepts `options.type` (`success`, `info`, `warning` or `error`) and an optional `options.duration` in seconds. A string may also be passed as the second argument for the type. The `type` attribute supplies the default kind. Error toasts use an assertive alert role; other kinds use a polite status role. The component emits `show` and `hide` events with the type in `event.detail`.

- `duration: 0` leaves the toast open until `hide()` is called.
- Hidden toasts are `inert` and `aria-hidden`, so the dismiss button cannot receive focus while invisible.
- The one-toast-at-a-time behavior and existing slide/impact/recovery animation remain intact.