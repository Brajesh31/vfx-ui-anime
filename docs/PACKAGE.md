# 📦 npm package

VFX UI Anime is a browser-only Web Components package. It does not provide React/Vue wrappers or named JavaScript classes. Importing the package registers custom elements in the browser's global custom-element registry.

## Install

```bash
npm install vfx-ui-anime
```

The package has no runtime dependencies.

## Register all 82 components

In a client-side application entry module:

```js
import 'vfx-ui-anime';
```

The package also exports metadata:

```js
import { version, componentNames, componentTags } from 'vfx-ui-anime';
```

## Register only one component

Use its side-effect subpath:

```js
import 'vfx-ui-anime/button';
```

Then use it in HTML:

```html
<vfx-button>Save</vfx-button>
```

Every component has a matching subpath. The full list is in [the component index](COMPONENTS.md).

## CDN / browser module

```html
<script type="module" src="https://cdn.jsdelivr.net/npm/vfx-ui-anime@0.1.0/components/button/index.js"></script>
<vfx-button>Save</vfx-button>
```

Each `components/<name>/index.js` file is standalone and already contains its shared runtime copy. Do not load `core.js` separately.

## Browser requirements and limitations

- Browser-only: entry points use `window`, `document`, `customElements`, Shadow DOM, and browser APIs.
- Do not import the root entry point during server-side rendering. Load it after the DOM environment exists.
- Root import registers all 82 elements. Prefer a subpath when only one or a few components are required.
- Registration imports are side effects. Bundlers must retain them.
- Component attributes, properties, methods, events, form behavior, and slots vary. The README in each component folder is authoritative.
- No React/Vue wrappers, CommonJS entry point, or named component classes are provided.
- CI verifies the package in Chromium. Screen-reader, real-device touch, Firefox, and Safari manual certification remain separate QA tasks.

## Verification

```bash
npm test
npm run check
python3 -m http.server 8000
npm run test:browser
npm run test:package
```

The package smoke test inspects the npm tarball, installs it offline in an empty consumer project, resolves all exports, and tests aggregate and single-component browser imports in Chromium.
