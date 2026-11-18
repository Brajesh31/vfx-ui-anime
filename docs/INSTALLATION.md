# 📦 Installation and integration

The current release is distributed as source files. There is no npm package published yet.

## Vanilla HTML
1. Copy `core.js` into your static assets.
2. Copy the desired component script into your assets.
3. Include the core first, then the component script.
4. Add the custom element to your markup.

```html
<script defer src="/assets/core.js"></script>
<script defer src="/assets/components/button/index.js"></script>
<vfx-button>Continue</vfx-button>
```

## React
Custom elements can be used in React markup. For component events, attach a ref and register a DOM event listener in an effect. Confirm the exact React version's custom-element event behavior before relying on JSX event props.

## Vue
Vue can render custom elements. Configure the relevant custom-element recognition rule if your build reports unknown-element warnings.

## Registry status
`registry.json` is this project's own component inventory. It is not currently a shadcn registry manifest and should not be passed to the shadcn CLI.
