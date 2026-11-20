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

1. In npm account settings, create a **one-day granular access token** with **Packages and scopes → All Packages → Read and write**. Because `vfx-ui-anime` does not exist until its first publication, npm cannot scope this initial token to that package yet. This temporarily gives the token write access to all packages on your account, so use the minimum one-day expiry, enable **Bypass 2FA** only if your account policy permits CI publishing, and revoke the token immediately after the first publish. npm removed legacy access tokens in November 2025, so use a granular token. [npm access-token documentation](https://docs.npmjs.com/about-access-tokens/) and [token creation steps](https://docs.npmjs.com/creating-and-viewing-access-tokens/).
2. In GitHub, open [repository Actions secrets](https://github.com/Brajesh31/vfx-ui-anime/settings/secrets/actions) and create the repository secret `NPM_TOKEN`. Never commit it or send it in a chat.
3. Open [Bootstrap first npm publication](https://github.com/Brajesh31/vfx-ui-anime/actions/workflows/bootstrap-publish.yml), choose `main`, select version `0.1.0`, and run the workflow. It reruns source, browser, tarball and clean-consumer tests before the first public publish. It creates the stable `v0.1.0` GitHub release only after npm accepts the package.
4. Once the package exists, open [npm package access settings](https://www.npmjs.com/package/vfx-ui-anime/access) and configure **Trusted Publisher** with GitHub Actions, user/organization `Brajesh31`, repository `vfx-ui-anime`, workflow filename `publish.yml`, and permission for direct `npm publish`. npm requires npm CLI 11.5.1 or newer and Node.js 22.14 or newer for trusted publishing. [npm Trusted Publishers documentation](https://docs.npmjs.com/trusted-publishers/).
5. Verify the trusted publisher is saved, then delete the `NPM_TOKEN` Actions secret and revoke the granular token in npm account settings. The first token-based publish does not use npm OIDC provenance. The next stable release must be a test of the `publish.yml` trusted-publisher OIDC workflow. Remove the one-time bootstrap workflow after the first publication is complete. The first token-based publication does not prove the OIDC configuration; test the OIDC path on the next version.

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
