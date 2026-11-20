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

## Publication status and trusted publishing

The first stable package release is live:

- npm: [`vfx-ui-anime@0.1.0`](https://www.npmjs.com/package/vfx-ui-anime/v/0.1.0)
- Install: `npm install vfx-ui-anime`
- Explicit version: `npm install vfx-ui-anime@0.1.0`
- Registry `latest` dist-tag: `0.1.0`
- GitHub: [stable release v0.1.0](https://github.com/Brajesh31/vfx-ui-anime/releases/tag/v0.1.0)
- Attached package archive: `vfx-ui-anime-0.1.0.tgz`

The bootstrap workflow completed source checks, the full Chromium suite, the package smoke test, tarball creation, npm publication and GitHub release creation. The one-time bootstrap workflow is no longer required for publishing the first version.

### Configure Trusted Publisher for future releases

The repository already contains `.github/workflows/publish.yml`. Before future version tags can use OIDC, create the npm Trusted Publisher connection with these exact values:

| npm field | Value |
|---|---|
| Publisher | GitHub Actions |
| Label | VFX UI Anime GitHub Actions Publisher |
| Organization or user | `brajesh31` |
| Repository | `vfx-ui-anime` |
| Workflow filename | `publish.yml` |
| Environment name | Leave empty |

The workflow uses `npm stage publish`. npm allows this action by default for a trusted publisher. Leave **Allow npm publish** and **Allow npm dist-tag** unchecked because the workflow does not call those commands. The environment field must remain empty because the workflow does not declare a GitHub Actions environment.

After saving the connection, confirm it appears under the npm package's Trusted Publisher settings. Then:

1. Delete the repository Actions secret `NPM_TOKEN`.
2. Revoke the temporary npm granular access token in npm account settings.
3. Retire the one-time `.github/workflows/bootstrap-publish.yml` workflow.
4. Use a real planned release tag to trigger `publish.yml`. It reruns repository, Chromium and clean-consumer checks, then submits the package to npm staging through OIDC.
5. Review each staged version and approve it with 2FA before it becomes publicly installable.

Do not create a fake patch release merely to test OIDC. The first `v0.1.0` release is already published; subsequent release testing belongs on the next legitimate package version.

**Known README correction:** the README snapshot included in npm `0.1.0` still contains pre-publication wording. The GitHub README and repository release documents have been corrected. npm's versioned README cannot be changed retroactively in the immutable `0.1.0` artifact; include the corrected wording in the next legitimate package release.

## Verification

```bash
npm test
npm run check
python3 -m http.server 8000
npm run test:browser
npm run test:package
```

The package smoke test inspects the npm tarball, installs it offline in an empty consumer project, resolves all exports, and tests aggregate and single-component browser imports in Chromium.
