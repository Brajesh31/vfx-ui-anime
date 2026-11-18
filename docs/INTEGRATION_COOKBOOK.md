# 🧑‍🍳 Integration cookbook

This guide turns the public component APIs into practical host-application patterns. The examples use the current source implementation and do not require a framework adapter or a runtime dependency.

For exact attributes, properties, methods and emitted event payloads, use the [Detailed Component API Reference](COMPONENT_API_REFERENCE.md). For known keyboard, form and screen-reader gaps, use [Accessibility](ACCESSIBILITY.md).

## 1. Choose how to load the library

The repository currently distributes source files, not a published npm package. Do not use an npm install command for this project.

### Use local files

Copy the shared engine and the component scripts you need into your application's static assets. Load the engine before the component scripts:

```html
<link rel="stylesheet" href="/assets/vfx/styles.css">
<script defer src="/assets/vfx/core.js"></script>
<script defer src="/assets/vfx/components/button.js"></script>
<script defer src="/assets/vfx/components/toggle.js"></script>
```

The stylesheet is the project's visual theme and gallery-level styles. Components render their controls in Shadow DOM and use CSS custom properties with some internal fallback styles. You may omit the stylesheet if you do not want the gallery theme, but verify the resulting appearance in your application.

### Use the repository directly during development

Serve the repository root with a static HTTP server:

```bash
python3 -m http.server 8000
```

Then open:
- Gallery: `http://localhost:8000/`
- Basic integration: `http://localhost:8000/examples/basic.html`
- Full cookbook: `http://localhost:8000/examples/integration-cookbook.html`

Do not use `file://` as the primary test path. A local HTTP server provides more representative browser loading behavior.

## 2. Start with a minimal custom element

```html
<link rel="stylesheet" href="/assets/vfx/styles.css">
<script defer src="/assets/vfx/core.js"></script>
<script defer src="/assets/vfx/components/button.js"></script>

<vfx-button id="save">Save changes</vfx-button>
<p id="status" aria-live="polite"></p>

<script>
  document.addEventListener("vfx-activate", (event) => {
    if (event.target.matches("#save")) {
      document.querySelector("#status").textContent = "Save action received.";
    }
  });
</script>
```

The button emits `vfx-activate` when its internal native button is clicked. The host application owns the actual save operation.

## 3. Listen for custom element events

All custom-element events documented by this project bubble and are composed. A listener on an ancestor can observe them outside Shadow DOM.

```js
document.addEventListener("vfx-activate", (event) => {
  console.log("Activated element:", event.target);
});

document.addEventListener("change", (event) => {
  const element = event.target;

  if (element.matches("vfx-toggle")) {
    console.log("Toggle state:", element.checked);
  }

  if (element.matches("vfx-radio")) {
    console.log("Selected option:", element.value);
  }

  if (element.matches("vfx-rating")) {
    console.log("Rating:", event.detail.value);
  }
});
```

**Do not assume every event includes `detail`.** The API reference explicitly identifies which event payloads exist. For example, toggle and checkbox `change` events have no custom detail payload, while tabs and rating events do.

## 4. Keep application state in the host

Custom elements provide interaction primitives. They do not replace your application state model or automatically coordinate related panels and data.

### Slider to progress

```html
<vfx-slider id="volume" min="0" max="100" value="40"></vfx-slider>
<vfx-progress id="volume-preview" value="40" label="Volume preview"></vfx-progress>
<script>
  const slider = document.querySelector("#volume");
  const progress = document.querySelector("#volume-preview");

  slider.addEventListener("input", (event) => {
    progress.value = event.detail.value;
  });
</script>
```

### Tabs with named panel slots

The component owns tab and tabpanel semantics. Keep the content in ordinary HTML and give each child panel a `slot` name that exactly matches one item label:

```html
<vfx-tabs id="sections" label="Content sections" items="Overview,Features,Details">
  <section slot="Overview">
    <h2>Overview</h2>
    <p>Introductory content.</p>
  </section>
  <section slot="Features">
    <h2>Features</h2>
    <p>Feature content.</p>
  </section>
  <section slot="Details">
    <h2>Details</h2>
    <p>Additional details.</p>
  </section>
</vfx-tabs>
<script>
  document.querySelector("#sections").addEventListener("change", (event) => {
    console.log("Selected tab:", event.detail.value);
  });
</script>
```

The component generates each tab and panel ID, sets reciprocal `aria-controls` and `aria-labelledby` references, and hides inactive panels. The selected panel is focusable so keyboard users can move from the tablist into panel content. Use exact slot-label matches, and provide a panel for every item. Horizontal tabs use Left/Right Arrow keys; vertical tabs use Up/Down Arrow keys. Both use Home/End and automatic activation.

### Toast from application code

```html
<vfx-toast id="notice" message="Saved">Show notice</vfx-toast>
<script>
  const notice = document.querySelector("#notice");
  notice.show("Your changes were saved.");
  notice.addEventListener("vfx-toast", (event) => {
    console.log("Displayed:", event.detail.message);
  });
</script>
```

Call `show()` in response to a real application action. The component hides its notice after 2.6 seconds; there is no public hide method or shared queue.

## 5. Framework integration patterns

The elements remain browser custom elements inside framework applications. Load `core.js` and the component files once at application bootstrap or through the framework's static asset configuration. Use DOM listeners for custom events when framework template event handling does not expose the event payload reliably.

### React

Use a ref and attach a DOM listener in an effect:

```jsx
import { useEffect, useRef, useState } from "react";

export function SaveControl() {
  const controlRef = useRef(null);
  const [message, setMessage] = useState("Ready");

  useEffect(() => {
    const element = controlRef.current;
    if (!element) return;

    const handleActivate = () => setMessage("Save action received.");
    element.addEventListener("vfx-activate", handleActivate);

    return () => element.removeEventListener("vfx-activate", handleActivate);
  }, []);

  return (
    <>
      <vfx-button ref={controlRef}>Save</vfx-button>
      <p aria-live="polite">{message}</p>
    </>
  );
}
```

Load the custom-element scripts before this component is used. In TypeScript projects, add the appropriate JSX intrinsic-element typing for the custom tag if the compiler requires it. Assign non-string properties such as numeric `value` through a ref, rather than relying on string attributes when the API requires a JavaScript property.

### Vue

Register the prefix as a custom element in the Vue compiler configuration where required, then use a ref to attach custom event listeners:

```vue
<script setup>
import { onBeforeUnmount, onMounted, ref } from "vue";

const control = ref(null);
const message = ref("Ready");

function handleActivate() {
  message.value = "Save action received.";
}

onMounted(() => {
  control.value?.addEventListener("vfx-activate", handleActivate);
});

onBeforeUnmount(() => {
  control.value?.removeEventListener("vfx-activate", handleActivate);
});
</script>

<template>
  <vfx-button ref="control">Save</vfx-button>
  <p aria-live="polite">{{ message }}</p>
</template>
```

Use element properties through the component ref for values that should remain JavaScript numbers or booleans. Keep application state and associated content in Vue.

### Angular

Configure Angular to accept custom elements in the relevant compilation context when required, include the component scripts through the application's static asset/script configuration, then listen for the DOM custom event:

```html
<vfx-button (vfx-activate)="onActivate()">Save</vfx-button>
<p aria-live="polite">{{ status }}</p>
```

```ts
status = "Ready";

onActivate(): void {
  this.status = "Save action received.";
}
```

The exact schema configuration depends on whether the application uses NgModules or standalone components. Verify event typing, change detection, property assignment and custom-element loading in the Angular version used by the host project. This repository does not ship Angular wrappers or value accessors.

## 6. Use the shared motion engine deliberately

The engine is global and initialized by `core.js`. Use optional chaining if a page can load a component without loading the engine:

```js
const target = document.querySelector("#save");
window.VFXAnime?.impact(target, "spark", 0.8);
window.VFXAnime?.emit("burst", 120, 90, { count: 16, power: 1.1 });
```

The engine's `spring(from, to, elapsedSeconds)` helper returns a scalar easing value. It does not animate a DOM element by itself.

Respect reduced motion in host-authored animations too. The core suppresses canvas particles when `prefers-reduced-motion: reduce` is active, but it does not remove every transition authored inside component styles or host application CSS.

## 7. Form and accessibility cautions

The current source is not a drop-in replacement for every native form control:
- Form-associated elements use `ElementInternals` opportunistically. Browser behavior must be tested, including submit, reset, disabled fieldsets and validity.
- The checkbox wrapper does not expose a `name` API in the current implementation.
- The radio wrapper uses native radio inputs and the browser's radio keyboard behavior. Its `value`, `required` and `disabled` properties can be assigned from JavaScript. Test independent groups, configured names, form submission, required validity, reset and disabled fieldsets in target browsers.
- The input wrapper does not proxy the complete native constraint-validation API.
- Tabs implement keyboard navigation and roving focus, but do not create linked tabpanels or manage panel visibility.
- Tooltip placement does not collision-check viewport edges and the trigger is not connected to the tooltip with `aria-describedby`.
- Rating uses separate native buttons and does not implement arrow-key rating navigation.

Use native controls or another fully tested component when those gaps conflict with a production requirement. Do not assume that a form-associated declaration guarantees identical behavior across browsers.

## 8. Run and test the examples

```bash
npm test
npm run check
python3 -m http.server 8000
```

Then open the [integration cookbook example](../examples/integration-cookbook.html) and verify:
1. Each control can be focused and operated using a keyboard where its underlying control supports it.
2. The event log updates after interactions.
3. Slider changes update the progress preview.
4. Tabs update the host-owned content message.
5. Button activation triggers the toast.
6. The browser console contains no errors.
7. At narrow and wide viewport widths, the example remains readable.

These are manual test instructions. Static repository validation does not execute the example in a browser, and no browser automation result is implied.

## Related references

- [Detailed Component API Reference](COMPONENT_API_REFERENCE.md)
- [Component overview](COMPONENTS.md)
- [Installation](INSTALLATION.md)
- [Accessibility and compatibility](ACCESSIBILITY.md)
- [Testing strategy](TESTING.md)
- [Architecture](ARCHITECTURE.md)
- [Runnable cookbook page](../examples/integration-cookbook.html)
