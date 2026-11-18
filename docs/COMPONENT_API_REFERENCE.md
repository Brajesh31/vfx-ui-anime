# 🧩 Component API reference

This reference describes the behavior implemented by the current source files in `components/` and `core.js`. It is an implementation reference, not a promise of native-element parity. Check the limitations in each section before depending on browser form behavior or advanced accessibility patterns.

## Load order and registration

Load `core.js` once before the component scripts when you want particle and impact feedback. Then load only the component files used by the page.

```html
<link rel="stylesheet" href="/styles.css">
<script defer src="/core.js"></script>
<script defer src="/components/button.js"></script>
<script defer src="/components/toggle.js"></script>
<!-- Add the other component scripts you use. -->
```

Each file registers one custom element and guards against registering the same tag twice. Each component uses an open Shadow DOM root. The components call the shared engine with optional chaining, so their underlying controls can still render if `core.js` is absent, but the shared particle effects will not run.

The browser APIs used by the implementation include Custom Elements, Shadow DOM, native form controls, CSS custom properties, Canvas 2D, `requestAnimationFrame`, and `matchMedia`. Form-associated components use `ElementInternals` when `attachInternals()` is available. Test the exact target browsers before depending on that form behavior.

## Component summary

| Element | Source | Main input | Events emitted by the custom element |
|---|---|---|---|
| `<vfx-button>` | `components/button.js` | `variant` attribute and slotted content | `vfx-activate` |
| `<vfx-toggle>` | `components/toggle.js` | `checked`, `label`, `disabled`, `name`, `value` | `change` |
| `<vfx-slider>` | `components/slider.js` | `min`, `max`, `step`, `value`, `disabled` | `input` with `detail.value` |
| `<vfx-checkbox>` | `components/checkbox.js` | `checked`, `disabled`, `value` | `change` |
| `<vfx-radio>` | `components/radio.js` | `options`, `value`, `name`, `disabled`, `required`, `label` | `change` |

| `<vfx-input>` | `components/input.js` | `type`, `value`, `placeholder`, `required`, `disabled`, `autocomplete`, `label` | `input`, `change` |
| `<vfx-tabs>` | `components/tabs.js` | `items`, `value`, `orientation`, `label` | `change` with `detail.value` |
| `<vfx-progress>` | `components/progress.js` | `value`, `label` | None |
| `<vfx-rating>` | `components/rating.js` | `value` | `change` with `detail.value` |
| `<vfx-toast>` | `components/toast.js` | `message` | `vfx-toast` with `detail.message` |
| `<vfx-tooltip>` | `components/tooltip.js` | `text`, `placement` and default slot | None |

Events emitted by a component are dispatched with `bubbles: true` and `composed: true`, unless otherwise stated below. They can therefore be listened for on an ancestor outside the component's Shadow DOM.

## 1. Button

**Tag:** `<vfx-button>`

**Implemented inputs**
- Default slot: button label/content.
- `variant="secondary"`: switches to the alternate light appearance. Other values use the default appearance.

**Interaction and event**
- Uses an internal native `button[type="button"]`, so native button activation and keyboard behavior are retained.
- On click, requests a `burst` impact from `window.VFXAnime` when the engine is loaded.
- Emits `vfx-activate` with no detail payload.

```html
<vfx-button id="save-control">Save changes</vfx-button>
<script>
  document.querySelector("#save-control").addEventListener("vfx-activate", () => {
    console.log("Save control activated");
  });
</script>
```

**Limitations:** There is no public `done()` or `impact()` instance method, disabled attribute handling, link mode, or loading state in the current implementation. The only exposed CSS part is `part="button"` on the internal button.

## 2. Toggle

**Tag:** `<vfx-toggle>`

**Attributes:** `checked`, `label`, `name`, `value`, `disabled`.

**Properties and behavior**
- `checked`: boolean getter/setter reflected to the `checked` attribute.
- `disabled`: read-only boolean getter based on the attribute.
- `label` supplies the visible text and the internal switch button's accessible name.
- The internal control has `role="switch"` and an `aria-checked` state.
- The component is declared form-associated and calls `ElementInternals.setFormValue()` when that API is available.
- The initial `checked` state is saved on connection for the form reset callback.

**Event:** `change`, without a detail payload, when the checked state is changed through the component's setter or click handling. Setting the same value does not emit the event.

```html
<vfx-toggle id="alerts" label="Email alerts" name="alerts" value="enabled"></vfx-toggle>
<script>
  const toggle = document.querySelector("#alerts");
  toggle.addEventListener("change", () => console.log(toggle.checked));
  toggle.checked = true;
</script>
```

**Limitations:** The component does not expose a separate `defaultChecked` property. Validate form submission, reset and disabled-fieldset behavior in browsers you support. An accessible label should be supplied through `label`.

## 3. Slider

**Tag:** `<vfx-slider>`

**Attributes copied into the internal range input on connection:** `min`, `max`, `step`, `value`, `disabled`.

**Property**
- `value`: numeric getter/setter backed by the internal native range input.
- Setting the property updates the internal range and displayed output. It does not dispatch a custom event.

**Event**
- `input`: emitted while the range value changes, with `event.detail.value` containing a number.
- The internal native `change` event triggers a spark effect, but the component does not re-dispatch a custom `change` event from the host.

```html
<vfx-slider id="volume" min="0" max="100" value="42"></vfx-slider>
<script>
  document.querySelector("#volume").addEventListener("input", (event) => {
    console.log(event.detail.value);
  });
</script>
```

**Limitations:** The host does not observe later attribute changes. Set the property after connection when changing the value programmatically. No public `min`, `max`, or `step` properties are implemented.

## 4. Checkbox

**Tag:** `<vfx-checkbox>`

**Attributes:** `checked`, `disabled`, `value`. The default slot provides the visible label text.

**Properties and behavior**
- `checked`: boolean getter/setter reflected to the `checked` attribute.
- `disabled`: read-only boolean getter based on the attribute.
- Uses an internal native checkbox nested in a label.
- Declares form association and calls `ElementInternals.setFormValue()` where available.
- Saves its initial checked state on connection for the form reset callback.

**Event:** `change`, without a detail payload, after the internal checkbox changes. The event is re-dispatched from the custom element host.

```html
<vfx-checkbox id="terms" value="accepted">Accept the terms</vfx-checkbox>
<script>
  document.querySelector("#terms").addEventListener("change", (event) => {
    console.log(event.currentTarget.checked);
  });
</script>
```

**Limitations:** A `required` attribute/property and an explicit `name` API are not implemented by the component source. Validate actual form submission and reset behavior in your browser matrix.

## 5. Radio group

**Tag:** `<vfx-radio>`

**Attributes:** `options`, `value`, `name`, `disabled`, `required`, `label`.
- `options` is a comma-separated string. The default is `Option A,Option B`.
- `value` selects a matching option. When no valid value is provided, the first option is selected unless `required` is present, in which case the group starts unselected so required validity can be checked.
- `name` is applied to the internal native radio inputs and is also the custom element's form field name.
- When `name` is omitted, an instance-specific internal group name is generated so each component remains its own radio group.
- `disabled` disables the internal inputs. Disabled fieldsets are handled through the form-associated disabled callback.
- `required` marks the internal radio choices as required.
- `label` supplies the accessible name for the radiogroup.

**Properties**
- `value`: string getter/setter. The setter selects a matching option and synchronizes the form value. For a required group, setting an empty string clears the selection.
- `disabled`: boolean getter/setter reflected to the `disabled` attribute. The getter also reports disabled-fieldset state.
- `required`: boolean getter/setter reflected to the `required` attribute.

**Interaction and event**
- Uses native radio inputs, preserving the browser's built-in radio selection and keyboard behavior within the group.
- Emits `change`, without a custom detail payload, after the selected option changes.
- Uses `ElementInternals.setFormValue()` and `setValidity()` when available. The component saves its initial value and implements form reset, disabled-state and state-restore callbacks.
- Updates the host `value` attribute when a user selects an option, keeping the property and rendered state synchronized.

```html
<vfx-radio
  id="size-choice"
  label="Size"
  name="size"
  required
  options="Small,Medium,Large"
  value="Medium"
></vfx-radio>
<script>
  const choice = document.querySelector("#size-choice");
  choice.addEventListener("change", () => console.log(choice.value));
  choice.value = "Large";
</script>
```

**Limitations:** Options are comma-separated, so commas cannot appear inside option labels. Form submission, required validity, reset and disabled-fieldset behavior still need testing in every supported browser. The component does not expose a separate `defaultValue` property.

## 6. Text input

**Tag:** `<vfx-input>`

**Attributes:** `type`, `placeholder`, `value`, `required`, `disabled`, `autocomplete`, `label`.

**Property**
- `value`: string getter/setter backed by the internal native input.

**Events**
- `input`: re-dispatched from the host with no custom detail payload.
- `change`: re-dispatched from the host with no custom detail payload.

**Accessibility and forms**
- `label` sets the internal input's `aria-label`. If it is not provided, the placeholder is used, then the fallback name "Text input".
- The custom element declares form association and sets its form value through `ElementInternals` when available.
- It copies its initial value into a reset default when connected.

```html
<vfx-input id="display-name" label="Display name" placeholder="Your name" required></vfx-input>
<script>
  document.querySelector("#display-name").addEventListener("input", (event) => {
    console.log(event.currentTarget.value);
  });
</script>
```

**Limitations:** The complete native constraint-validation API is not proxied. The component does not add a visible label element, and an explicit `label` attribute is preferable to relying on placeholder text for the accessible name.

## 7. Tabs

**Tag:** `<vfx-tabs>`

**Attributes:** `items`, `value`, `orientation`, `label`.
- `items` is a comma-separated list, defaulting to `Overview,Details`. Duplicate and empty labels are removed.
- `value` identifies the selected tab. When no valid value is set, the first item is selected.
- `orientation="horizontal"` (default) uses Left/Right Arrow keys. `orientation="vertical"` uses Up/Down Arrow keys.
- `label` sets the accessible name of the tablist.

**Panel content**
- Add one child element for each tab panel. Set its `slot` attribute to exactly match the corresponding tab label.
- The component creates the panel wrapper and its ARIA relationship. The child content remains normal light-DOM HTML.
- More than one child may use the same slot name. They are rendered together in that tabpanel.
- A tab without a matching slotted child still has a linked, but empty, tabpanel. Provide a matching panel for every item.

**Property**
- `value`: string getter/setter. The getter returns the selected value, falling back to the first item; the setter selects a matching item.
- `orientation`: read-only string getter that returns `horizontal` or `vertical`.

**ARIA, keyboard and event behavior**
- The component renders a named `tablist`, tabs with `role="tab"`, and panels with `role="tabpanel"`.
- Each tab's `aria-controls` points to its panel. Each panel's `aria-labelledby` points back to its tab. Both ends are generated in the same shadow tree.
- Inactive panels are hidden. The selected panel is exposed and has `tabindex="0"` so keyboard users can move from the tablist into its content.
- Exactly one tab is in the tab order. Other tabs use `tabindex="-1"`.
- Arrow keys move focus and selection, wrapping at either end. Horizontal tabs use Left/Right; vertical tabs use Up/Down.
- `Home` selects/focuses the first tab. `End` selects/focuses the last tab.
- Selection follows focus (automatic activation).
- User selection emits `change` with `event.detail.value`. Programmatic `value` changes do not emit the event.

```html
<vfx-tabs
  id="sections"
  label="Content sections"
  items="Overview,Features,Details"
  orientation="horizontal"
>
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

**Limitations:** The component manages tab and tabpanel semantics, ID relationships and selected-panel visibility. The host application remains responsible for supplying meaningful panel content through matching named slots. Browser and assistive-technology testing is still required.

## 8. Progress

**Tag:** `<vfx-progress>`

**Attributes:** `value` and `label`.
- `value` defaults to `0` and is clamped to the inclusive range 0–100.
- `label` defaults to "Progress".

**Property**
- `value`: numeric getter/setter. The setter updates the attribute, bar width, displayed percentage and `aria-valuenow`.
- Setting the value to 100 requests a burst effect. There is no custom completion event.

```html
<vfx-progress id="upload-progress" value="20" label="Upload progress"></vfx-progress>
<script>
  document.querySelector("#upload-progress").value = 75;
</script>
```

**Limitations:** The source does not observe later external changes to the `value` attribute. Use the property setter after connection to update the rendered progress. There is no indeterminate mode or completion lifecycle API.

## 9. Rating

**Tag:** `<vfx-rating>`

**Attribute/property:** `value`, rounded to a whole number and clamped from 0 to 5. The initial value defaults to `0`.

**Event:** `change` with `event.detail.value` containing the selected integer from 1 to 5.

```html
<vfx-rating id="product-rating" value="3"></vfx-rating>
<script>
  document.querySelector("#product-rating").addEventListener("change", (event) => {
    console.log("Rating:", event.detail.value);
  });
</script>
```

**Accessibility and limitations:** Each star is a native button with an accessible name and `aria-pressed`. The component supports whole stars only. It does not implement half-star values, arrow-key rating navigation or a form-associated value.

## 10. Toast

**Tag:** `<vfx-toast>`

**Attribute:** `message`, used as the default message when the element connects and when `show()` is called without an argument.

**Method:** `show(message?)` displays the supplied message or the configured/default message.

**Event:** `vfx-toast` with `event.detail.message` containing the displayed text. The event is emitted when `show()` is called.

```html
<vfx-toast id="notice" message="Saved">Show notice</vfx-toast>
<script>
  const toast = document.querySelector("#notice");
  toast.addEventListener("vfx-toast", (event) => console.log(event.detail.message));
  toast.show("Your changes were saved");
</script>
```

**Behavior and limitations:** The component uses a polite live status region and automatically hides the notice after 2.6 seconds. Calling `show()` again resets the timer. Each element controls its own toast; there is no shared queue, public hide method or duration attribute. The `message` attribute is not observed for live updates after connection.

## 11. Tooltip

**Tag:** `<vfx-tooltip>`

**Attributes**
- `text`: tooltip text. Defaults to "Helpful information" and updates live when the attribute changes.
- `placement`: `auto` (default), `top`, or `bottom`. Explicit values request a fixed side; `auto` chooses the side with available room.

**Content and accessibility**
- The default slot renders the trigger content.
- The trigger is keyboard-focusable and is connected to the tooltip through an `aria-describedby` relationship.
- The tooltip element has a unique ID and `role="tooltip"`.
- The hint appears on hover and while focus is within the host.
- Pressing `Escape` dismisses the visible hint. Moving the pointer away or focusing the trigger again allows it to appear again.

**Viewport behavior**
- In `auto` mode, the tooltip prefers above the trigger and flips below when the space above is insufficient and more space is available below.
- The tooltip is horizontally clamped to an 8px viewport margin. Its arrow is shifted to keep pointing toward the trigger.
- Position is recalculated on window resize, scroll, and observed size changes.
- The tooltip wraps long content and limits its width to the smaller of 16rem or the available viewport width minus 2rem.
- The tooltip transition is disabled when `prefers-reduced-motion: reduce` is active.

```html
<vfx-tooltip text="A longer helpful explanation" placement="auto">
  Hover or focus for details
</vfx-tooltip>

<vfx-tooltip text="This hint is requested below the trigger" placement="bottom">
  Bottom placement
</vfx-tooltip>
```

**Limitations:** The component supplies the tooltip description but does not make an otherwise non-interactive trigger meaningful by itself. Use concise text and do not place interactive controls inside the tooltip. Automated source checks do not replace browser/assistive-technology verification of the `aria-describedby` relationship, Escape behavior, and edge placement.

## Shared motion engine: `window.VFXAnime`

The engine is created by `core.js`. The current public object exposes the following members:

| Member | Signature | Behavior |
|---|---|---|
| `emit` | `emit(type, x, y, options = {})` | Emits particles at viewport coordinates. |
| `impact` | `impact(element, type = "burst", power = 1)` | Emits an effect at the center of an element's bounding rectangle. |
| `spring` | `spring(from, to, elapsedSeconds)` | Returns the current scalar value from the engine's damped cosine easing expression. |
| `reducedMotion` | read-only getter | Reflects the current `prefers-reduced-motion: reduce` media-query state. |
| `version` | string | Currently `"1.0.0"`. |

### Particle options and behavior

- `emit` accepts `options.count` and `options.power`.
- The default count is 13 for `type === "burst"`, and 7 for other types.
- The default power is 1.
- The current renderer gives `burst` diamond-like particles, `spark` violet particles, and other types lavender circular particles.
- When reduced motion is active, `emit` returns without creating particles. This suppresses particle effects, not all CSS transitions or component state changes.
- The canvas is appended to the document body, marked `aria-hidden="true"`, and resized with the viewport. Its device-pixel ratio is capped at 2.

Example:

```js
const button = document.querySelector("vfx-button");
window.VFXAnime?.impact(button, "spark", 0.8);
window.VFXAnime?.emit("burst", 120, 90, { count: 18, power: 1.2 });
```

**Limitations:** The engine is a lightweight visual-effects helper, not a general animation timeline or a physics simulation. The `spring` helper returns a scalar easing value; it does not schedule animation frames or mutate an element. There is no public particle cleanup, pause, or global configuration API.

## Event handling pattern

Because events are bubbling and composed, ordinary ancestor listeners work:

```js
document.addEventListener("vfx-activate", (event) => {
  console.log("Activated:", event.target);
});

document.addEventListener("change", (event) => {
  if (event.target.matches("vfx-toggle, vfx-checkbox, vfx-radio")) {
    console.log("Changed:", event.target);
  }
});
```

For generic event names such as `input` and `change`, check the originating custom element before assuming that the event has a `detail` property. Only the events listed with an explicit detail payload above provide one.

## Styling and customization

- The components render their internal controls in Shadow DOM. Ordinary page CSS does not select arbitrary internal nodes.
- The components reference project CSS custom properties such as `--vfx-ink`, `--vfx-paper`, `--vfx-lavender`, `--vfx-violet`, and `--vfx-pink` with component-specific fallbacks.
- The internal button of `<vfx-button>` exposes `part="button"`. No broader `::part()` API is currently provided.
- Use the visual design rules in [the design system](DESIGN_SYSTEM.md) as design guidance, not as a guarantee that every current component already uses every token.

## Compatibility and production guidance

The source code is intentionally small, but small does not mean browser parity is complete. Before production use, test:
- Custom element registration and Shadow DOM in each target browser.
- Form submission, validation, reset, required and disabled behavior for each form-associated control.
- Keyboard-only operation and screen-reader output, especially for radio groups, tabs, ratings and tooltips.
- Reduced-motion behavior, zoom, narrow viewports, stacking contexts, dialogs and sticky layouts.
- Event propagation and property/attribute synchronization in the host framework.

See [Accessibility](ACCESSIBILITY.md), [Testing](TESTING.md) and [Framework integrations](INTEGRATIONS.md) for the corresponding project guidance.
