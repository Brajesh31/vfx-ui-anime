# 🔌 Framework integration notes

VFX UI Anime ships as browser custom elements, not as React, Vue, or Angular component packages. It has no framework adapters, framework-specific value accessors, or typed wrapper packages.

## Loading the controls

Eleven controls are self-contained scripts: Button, Toggle, Slider, Checkbox, Radio, Input, Tabs, Progress, Rating, Toast, and Tooltip. Load only the scripts you use. They do not need the repository's separate `core.js` file.

The additional Like, Accordion, Segmented, and Notification controls use this repository's `core.js` engine. Load `core.js` before any of those four scripts.

See [Installation](INSTALLATION.md) and the [Integration Cookbook](INTEGRATION_COOKBOOK.md) for exact script tags.

## React
- Include each required custom-element script once at application bootstrap or through the host page.
- Use custom elements in JSX when supported by the selected React version.
- For custom DOM events, attach a listener through a ref in an effect and remove it during cleanup.
- Assign numeric or boolean JavaScript properties through a ref when the API exposes a property. Do not assume every property should be passed as a string attribute.
- In TypeScript projects, add JSX intrinsic-element typing for the custom tags if the compiler requires it.

## Vue
- Register the `vfx-` prefix as custom elements in the compiler configuration when needed.
- Use refs and DOM event listeners when you need the exact custom event or detail payload.
- Remove manually attached listeners when the component unmounts.
- Keep application state and associated tab panel content in Vue. The Tabs component draws and manages the tab list only, it does not render or manage external panels.

## Angular
- Configure the relevant Angular compilation context to accept custom elements when needed.
- Include the scripts through the application's static asset or script configuration.
- Verify custom event typing, change detection, property assignment, and form behavior in the selected Angular version.
- This repository does not ship Angular value accessors or wrapper components.

## Vanilla JavaScript
Use [the basic integration example](../examples/basic.html) for a minimal button/toggle setup and [the runnable integration cookbook](../examples/integration-cookbook.html) for examples covering the source-backed controls and additional VFX components.

## Integration limits
No npm package is currently published. `registry.json` is this project's component inventory, not a shadcn registry manifest. No React wrappers, Vue components, Angular value accessors, or framework adapter packages are published.

The component APIs have documented limits. For example, Tabs does not manage panel content, Radio reads its child options on connection, and Tooltip has a fixed positioning model. Review the [Component API Reference](COMPONENT_API_REFERENCE.md) and each component's README. Verify your browser/framework combination before production use.
