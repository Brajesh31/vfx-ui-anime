# 📦 Installation and integration

The current release is distributed as source files. There is no npm package published yet.

## Eleven standalone animated controls

The Button, Toggle, Slider, Checkbox, Radio, Input, Tabs, Progress, Rating, Toast, and Tooltip scripts are self-contained. Copy the selected component file into your app and include it directly. You do not need to install or load `core.js` for these controls.

```html
<script defer src="/assets/components/button/index.js"></script>
<vfx-button>Confirm</vfx-button>
```

Each file defines one custom element and includes the motion code and artwork it needs. See its component README for API details.

## Four additional VFX UI Anime controls

Like, Accordion, Segmented, and Notification use this repository's separate `core.js` engine. Load the engine before the selected component:

```html
<script defer src="/assets/core.js"></script>
<script defer src="/assets/components/like/index.js"></script>
<vfx-like label="Like" liked-label="Liked"></vfx-like>
```

## React

Custom elements can be used in React markup. For component events, attach a ref and register a DOM event listener in an effect. Confirm the exact React version's custom-element event behaviour before relying on JSX event props.

## Vue

Vue can render custom elements. Configure the relevant custom-element recognition rule if your build reports unknown-element warnings.

## Registry status

`registry.json` is this project's component inventory. It is not currently a shadcn registry manifest and should not be passed to the shadcn CLI.
