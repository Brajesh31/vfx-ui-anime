# 🔌 Framework integration notes

The library ships as browser custom elements, not React/Vue/Angular components. Load `core.js` once and load only the component scripts used by the page.

## React
- Import or include the scripts at application bootstrap.
- Use custom elements directly in JSX when supported by the React version in use.
- For custom DOM events, attach listeners through a ref and a React effect if JSX event handling does not expose the custom event.
- Pass primitive attributes deliberately. For object values or complex state, use element properties through a ref.

## Vue
- Register the `vfx-` prefix as custom elements in the compiler configuration if needed.
- Listen to documented custom events.
- Keep panel state and application state in Vue. The custom elements do not replace application state management.

## Angular
- Configure the schema for custom elements if the compiler requires it.
- Include the scripts through the application's asset or script configuration.
- Verify custom event typing and form behavior in the chosen Angular version.

## Vanilla JavaScript
Use the examples in `examples/basic.html`. The browser's Custom Elements API handles registration.

## Integration limits
No framework adapter packages, typed React wrappers, Angular value accessors or Vue-specific components are published yet. Do not imply they exist.
