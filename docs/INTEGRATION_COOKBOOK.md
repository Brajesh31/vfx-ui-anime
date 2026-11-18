# 🧑‍🍳 Integration cookbook

This guide uses the actual APIs implemented by the components. No framework adapter or runtime package is required.

For complete attributes, methods, events, and known limits, use the [Component API Reference](COMPONENT_API_REFERENCE.md) and each component's README.

## 1. Choose the correct script loading pattern

### Eleven standalone animated controls

Button, Toggle, Slider, Checkbox, Radio, Input, Tabs, Progress, Rating, Toast, and Tooltip each include their own animation runtime and artwork. Load each control directly:

```html
<script defer src="/components/button/index.js"></script>
<script defer src="/components/toggle/index.js"></script>
<vfx-button>Save</vfx-button>
<vfx-toggle label="Notifications"></vfx-toggle>
```

Do not load the separate `core.js` just for these eleven controls. Their standalone runtime is initialised once on the page and reused by any other standalone controls.

### Four additional VFX UI Anime controls

Like, Accordion, Segmented, and Notification use this repository's separate `core.js` engine. Load it first:

```html
<script defer src="/core.js"></script>
<script defer src="/components/like/index.js"></script>
<script defer src="/components/accordion/index.js"></script>
<vfx-like label="Like" liked-label="Liked"></vfx-like>
<vfx-accordion label="Details">Panel content</vfx-accordion>
```

### Run the repository locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000/` for the full interactive gallery, or open any individual `components/<name>/demo.html` page.

## 2. Button success state

The Button emits an ordinary click event. The impact animation happens on click. Call `.done()` only after the operation has actually succeeded:

```html
<script defer src="/components/button/index.js"></script>
<vfx-button id="save">Save changes</vfx-button>
<p id="status" aria-live="polite"></p>
<script>
  const button = document.querySelector("#save");
  const status = document.querySelector("#status");

  button.addEventListener("click", async () => {
    try {
      await saveChanges();
      button.done();
      status.textContent = "Saved successfully.";
    } catch {
      status.textContent = "Save failed. Try again.";
    }
  });
</script>
```

Use `variant="secondary"` for the quieter button. Use `type="submit"` when the button should submit its containing form.

## 3. Form controls

### Toggle

```html
<vfx-toggle label="Email notifications" name="email_notifications"></vfx-toggle>
<script>
  const toggle = document.querySelector("vfx-toggle");
  toggle.addEventListener("change", () => {
    console.log("Notifications enabled:", toggle.checked);
  });
</script>
```

Read or set `checked`. Calling `flip()` programmatically plays the animated transition; assigning `checked` from code sets the state directly.

### Slider driving Progress

```html
<vfx-slider id="upload-speed" min="0" max="100" value="40" label="Upload progress"></vfx-slider>
<vfx-progress id="upload-progress" label="Uploading"></vfx-progress>
<script>
  const slider = document.querySelector("#upload-speed");
  const progress = document.querySelector("#upload-progress");

  slider.addEventListener("input", () => {
    progress.set(Number(slider.value) / 100);
  });
</script>
```

The Slider fires `input` while moving and `change` when released. Progress accepts values from 0 to 1, supports `.set(value, immediate)` and `.reset()`, and emits `vfx:done` when its animated bar reaches the end.

### Checkbox

```html
<vfx-checkbox name="remember">Remember this device</vfx-checkbox>
<script>
  const checkbox = document.querySelector("vfx-checkbox");
  checkbox.addEventListener("change", () => {
    console.log(checkbox.checked);
  });
</script>
```

### Radio

Supply the choices as child `option` elements:

```html
<vfx-radio label="Plan" name="plan">
  <option value="free" selected>Free</option>
  <option value="pro">Pro</option>
</vfx-radio>
<script>
  const radio = document.querySelector("vfx-radio");
  radio.addEventListener("change", () => console.log(radio.value));
</script>
```

Radio reads its options when it first connects. Replace the element to change the option list after connection.

### Input

```html
<vfx-input label="Email" type="email" placeholder="you@example.com" name="email"></vfx-input>
<script>
  const input = document.querySelector("vfx-input");
  input.addEventListener("input", () => console.log(input.value));
</script>
```

Supported input types are `text`, `email`, `search`, `url`, `tel`, and `password`.

### Rating

```html
<vfx-rating label="Rate this recipe" name="rating"></vfx-rating>
<script>
  const rating = document.querySelector("vfx-rating");
  rating.addEventListener("change", () => console.log(rating.value));
</script>
```

Rating ranges from 0 to 5. Clicking the currently selected star again clears the value.

## 4. Navigation and feedback

### Tabs with host-managed panels

Tabs renders the tab list only. It does not create, hide, or manage associated panel content. Listen for its change event and update your own panel:

```html
<vfx-tabs id="sections" label="Sections">
  <option value="overview">Overview</option>
  <option value="features">Features</option>
  <option value="details">Details</option>
</vfx-tabs>
<section id="overview-panel">Overview content</section>
<section id="features-panel" hidden>Features content</section>
<section id="details-panel" hidden>Details content</section>
<script>
  const tabs = document.querySelector("#sections");
  const panels = [...document.querySelectorAll("[id$='-panel']")];

  tabs.addEventListener("change", (event) => {
    panels.forEach((panel) => {
      panel.hidden = panel.id !== event.detail.value + "-panel";
    });
  });
</script>
```

The event detail contains `index`, `value`, and `label`. Arrow keys move between tabs, and Home/End move to the first/last tab.

### Toast

```html
<vfx-toast id="notice" message="Saved successfully!"></vfx-toast>
<script>
  const toast = document.querySelector("#notice");
  toast.show("Your changes were saved.");
  // Call toast.hide() when it should disappear early.
</script>
```

Position the Toast element where it should appear, for example with `position: fixed` in a page stylesheet.

### Tooltip

```html
<vfx-tooltip text="We use this to send your receipt." label="Why we ask"></vfx-tooltip>
```

It opens on hover, focus, or tap, and Escape closes it. The element also exposes `.show()` and `.hide()`.

## 5. Additional VFX UI Anime controls

Load `core.js` before these four components.

### Like

```html
<vfx-like label="Like" liked-label="Liked"></vfx-like>
<script>
  const like = document.querySelector("vfx-like");
  like.addEventListener("change", () => console.log(like.pressed));
</script>
```

### Accordion

```html
<vfx-accordion label="What is included?">The panel content goes here.</vfx-accordion>
```

Use the `open` property or attribute to read or set the disclosure state. Its trigger and region are linked with accessible IDs.

### Segmented

```html
<vfx-segmented label="Time range" value="Week">
  <option value="Day">Day</option>
  <option value="Week">Week</option>
  <option value="Month">Month</option>
</vfx-segmented>
```

Read `.value` and listen for `change`.

### Notification

```html
<vfx-notification count="3"></vfx-notification>
```

The button clears the unread count when activated.

## 6. Integration cautions

- Do not assume that every control uses the same event payload. Check the component README.
- Tabs does not manage its panels. The host application owns the panel content.
- Toggle and Checkbox expose `.checked`; Slider exposes `.value` and `.valueAsNumber`.
- Keep form names and labels meaningful when using controls in forms.
- Respect `prefers-reduced-motion` and test keyboard operation in the target browser.
