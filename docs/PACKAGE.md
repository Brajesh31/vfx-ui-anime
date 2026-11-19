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

## First public publication and trusted publishing

The npm package must exist before npm can attach a Trusted Publisher. The initial publication is therefore bootstrapped once using a protected GitHub Actions secret:

1. Create an npm granular access token with publish permission for `vfx-ui-anime` and the required 2FA bypass for CI.
2. In GitHub, open **Settings → Secrets and variables → Actions** and create the repository secret `NPM_TOKEN`. Never commit it or send it in a chat.
3. Open **Actions → Bootstrap first npm publication**, choose `main`, select version `0.1.0`, and run the workflow. It reruns source, browser, tarball and clean-consumer tests before the first public publish. It creates the stable `v0.1.0` GitHub release only after npm accepts the package.
4. Once `https://www.npmjs.com/package/vfx-ui-anime` exists, open its **Settings → Trusted Publisher** page. Add GitHub Actions with user/organization `Brajesh31`, repository `vfx-ui-anime`, workflow filename `publish.yml`, and allow direct `npm publish`.
5. Verify the trusted publisher is saved, then delete the `NPM_TOKEN` Actions secret and remove the one-time bootstrap workflow in the next maintenance change.

Later stable version tags use `.github/workflows/publish.yml`, npm OIDC trusted publishing, and provenance. The bootstrap workflow is only for the first package publication.

## Verification

```bash
npm test
npm run check
python3 -m http.server 8000
npm run test:browser
npm run test:package
```

The package smoke test inspects the npm tarball, installs it offline in an empty consumer project, resolves all exports, and tests aggregate and single-component browser imports in Chromium.
