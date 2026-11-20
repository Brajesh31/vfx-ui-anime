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

## GitHub Packages registry

The project keeps its existing unscoped npmjs release and is configured to publish a second, scoped package to GitHub Packages:

- npmjs: `vfx-ui-anime@0.1.0`
- GitHub Packages: `@brajesh31/vfx-ui-anime@0.1.0`
- GitHub Packages registry: `https://npm.pkg.github.com`
- GitHub Actions workflow: [`.github/workflows/publish-github-package.yml`](../.github/workflows/publish-github-package.yml)

The first GitHub Packages publication is not complete until the workflow below runs successfully. The source `package.json` intentionally remains named `vfx-ui-anime` and continues publishing to npmjs. The GitHub Packages workflow creates a verified tarball, changes only the temporary copy's package name to `@brajesh31/vfx-ui-anime`, points that copy at GitHub Packages, and publishes it with the repository-scoped `GITHUB_TOKEN`. It does not rename, overwrite, or republish the npmjs package.

### First GitHub Packages publication

1. Open [Publish GitHub Package](https://github.com/Brajesh31/vfx-ui-anime/actions/workflows/publish-github-package.yml).
2. Select **Run workflow** on `main`.
3. Wait for the validation, Chromium interaction suite, npm tarball/consumer smoke test and package publication to finish.
4. Open the repository's **Packages** section or [GitHub Packages for Brajesh31](https://github.com/Brajesh31?tab=packages).
5. GitHub makes a first-published package private by default. Review its package settings and change visibility to **Public** if public installation is intended. Confirm that the package is linked to this repository.

The workflow requests `packages: write` and uses `GITHUB_TOKEN`; it does not require an additional publishing secret or a personal access token in GitHub Actions. Future stable `vX.Y.Z` tags trigger the same workflow. Pre-release tags are ignored.

### Install from GitHub Packages

The committed project `.npmrc` maps only the `@brajesh31` scope to GitHub Packages and reads the token from the `NODE_AUTH_TOKEN` environment variable. It does not redirect the existing unscoped npmjs package.

For local installation of a private GitHub Package, create a GitHub **personal access token (classic)** with at least `read:packages`, then provide it as an environment variable:

```bash
export NODE_AUTH_TOKEN=YOUR_GITHUB_PAT_CLASSIC
npm install @brajesh31/vfx-ui-anime
unset NODE_AUTH_TOKEN
```

Use a `write:packages` scope only when publishing locally. For CI publishing in this repository, use the provided `GITHUB_TOKEN` workflow instead. Never commit a token to `.npmrc` or paste it into source files.

## Publication status and trusted publishing

The first stable package release is live:

- npm: [`vfx-ui-anime@0.1.0`](https://www.npmjs.com/package/vfx-ui-anime/v/0.1.0)
- Install: `npm install vfx-ui-anime`
- Explicit version: `npm install vfx-ui-anime@0.1.0`
- Registry `latest` dist-tag: `0.1.0`
- GitHub: [stable release v0.1.0](https://github.com/Brajesh31/vfx-ui-anime/releases/tag/v0.1.0)
- Attached package archive: `vfx-ui-anime-0.1.0.tgz`

The one-time bootstrap workflow completed source checks, the full Chromium suite, the package smoke test, tarball creation, npm publication and GitHub release creation. It has been removed from the repository because the first stable release is complete.

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

After saving the connection, confirm it appears under the npm package's Trusted Publisher settings. The one-time bootstrap workflow has already been removed because `v0.1.0` is published. The bootstrap credential is no longer needed: delete the repository Actions secret `NPM_TOKEN` and revoke the temporary npm granular access token in npm account settings. Use a real planned release tag to trigger `publish.yml`; it reruns repository, Chromium and clean-consumer checks, then submits the package to npm staging through OIDC. Review each staged version and approve it with 2FA before it becomes publicly installable.

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
