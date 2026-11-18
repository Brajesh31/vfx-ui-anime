# 🔌 Framework integration notes

VFX UI Anime ships as browser custom elements, not as React, Vue or Angular component packages. It has no framework adapters, framework-specific value accessors or typed wrapper packages.

Load `core.js` once before the component scripts, then load only the component definitions used by the page. Use [Installation](INSTALLATION.md) for the source-file setup and the [Integration Cookbook](INTEGRATION_COOKBOOK.md) for complete snippets and practical cautions.

## React
- Include the custom-element scripts once at application bootstrap or through the host page.
- Use custom elements in JSX when supported by the selected React version.
- For custom DOM events, attach a listener through a ref in an effect and remove it during cleanup.
- Assign numeric or boolean JavaScript properties through a ref when the API exposes a property. Do not assume every property should be passed as a string attribute.
- In TypeScript projects, add JSX intrinsic-element typing for the custom tags if the compiler requires it.

## Vue
- Register the `vfx-` prefix as custom elements in the compiler configuration when needed.
- Use refs and DOM event listeners when you need the exact custom event or detail payload.
- Remove manually attached listeners when the component unmounts.
- Keep application state and associated panel content in Vue. The custom elements do not replace application state management.

## Angular
- Configure the relevant Angular compilation context to accept custom elements when needed.
- Include the scripts through the application's static asset or script configuration.
- Verify custom event typing, change detection, property assignment and form behavior in the selected Angular version.
- This repository does not ship Angular value accessors or wrapper components.

## Vanilla JavaScript
Use [the basic integration example](../examples/basic.html) for a minimal button/toggle setup and [the runnable integration cookbook](../examples/integration-cookbook.html) for all eleven components, delegated event handling, host-owned tab content and a slider-to-progress example.

## Integration limits
No npm package is currently published. `registry.json` is the project's own component inventory, not a shadcn registry manifest. No React wrappers, Vue components, Angular value accessors or framework adapter packages are published. Do not imply otherwise.

The components have documented implementation limitations, especially around native form parity, radio keyboard behavior, tab panels and tooltip relationships. Review [the detailed Component API Reference](COMPONENT_API_REFERENCE.md) and [Accessibility](ACCESSIBILITY.md), and verify your browser/framework combination before production use.
