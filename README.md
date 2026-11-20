# ✨ VFX UI Anime

**Anime-inspired impact motion for real interface controls.**

VFX UI Anime is a collection of **82 dependency-free Web Components** with a shared visual language built around spring motion, illustrated impact effects, responsive controls, and practical interaction behavior.

- **82 custom element types**
- **83 interactive gallery examples**
- **82 standalone component demos**
- **No runtime framework or third-party component dependency**
- **MIT licensed**
- **Public npm package: `vfx-ui-anime@0.1.0`**

[Explore the live gallery](https://brajesh31.github.io/vfx-ui-anime/) · [Browse the source](https://github.com/Brajesh31/vfx-ui-anime) · [Read the component index](docs/COMPONENTS.md)

---

## 🎬 What is included

The library covers everyday UI, navigation, forms, content editing, workflow controls, data visualization, media, and motion.

| Area | Components |
|---|---|
| Core controls | Button, Toggle, Slider, Checkbox, Radio, Input, Tabs, Progress, Rating |
| Feedback and overlays | Toast, Tooltip, Menu, Dialog, Drawer, Alert, Skeleton |
| Form and input controls | Select, Textarea, Number, Search, File Upload, Color Picker, Segmented Control, OTP, Tag Input, Pagination, Stepper |
| Navigation and selection | Accordion, Breadcrumb, Calendar, Date Picker, Command Palette, Context Menu, Combobox, Multi Select |
| Creative workflow | Drag and Drop, Carousel, Timeline, Radial Menu, Image Cropper, Signature Pad, Before/After |
| Data and productivity | Kanban, Data Grid, Tree View, Transfer List, Split Pane, Wizard, Guided Tour, Stopwatch, Emoji Picker, Copy Code |
| Charts and dashboards | Bar Chart, Donut Chart, Sparkline, KPI Card, Gauge, Heatmap, Treemap |
| Creative and media | Drawing Canvas, Color Palette, Audio Player, Video Player, Markdown Editor, JSON Editor |
| 3D and advanced motion | Tilt Card, Flip Card, Particle Field, Marquee, Scroll Reveal, Animated Counter, Confetti Button |
| Rich content and utilities | Password Field, Date Range Picker, Notification Center, Rich Text Editor, Gradient Picker, Lightbox Gallery |

For the exact custom-element names, source paths, individual API documents, and demo paths, see **[docs/COMPONENTS.md](docs/COMPONENTS.md)**. Each component's folder also contains its own `README.md` and `demo.html`.

## 🚀 Try the gallery locally

The project is a static site. Start a local HTTP server from the repository root:

```bash
python3 -m http.server 8000
```

Open:

```text
http://localhost:8000/
```

The root page forwards to the interactive gallery.

The gallery is also hosted on GitHub Pages:

**https://brajesh31.github.io/vfx-ui-anime/**

## 🧩 Use a component in a web page

Component files are standalone browser scripts. Load the exact component script with a regular script tag, then use its registered custom element.

Example using Button:

```html
<script src="./components/button/index.js"></script>

<vfx-button variant="primary">
  Save changes
</vfx-button>
```

A second example using a form control:

```html
<script src="./components/toggle/index.js"></script>

<label>
  <span>Enable notifications</span>
  <vfx-toggle name="notifications" checked></vfx-toggle>
</label>
```

The markup above illustrates script loading and custom-element usage. Check the relevant component README for the actual supported attributes, properties, event names, form semantics, and slots. Do not assume that all components share the same API.

### How the standalone runtime works

- Each `components/<name>/index.js` file registers one custom element.
- Each component script embeds the shared VFX runtime so that the script can be loaded independently.
- The shared runtime source of truth is `core.js`.
- `tools/build.mjs` synchronizes the shared runtime into the component files.
- The runtime exposes `window.VFXAnimeFX`; component styles use the `--vfx-*` CSS custom-property namespace.
- Component implementation files are browser scripts, not framework-specific React/Vue wrappers.

## 🎨 Visual and motion language

The design uses an ink-and-paper base, lavender offset depth, purple outlines, pink impact accents, custom illustrated effects, and spring-driven response.

The project-wide motion and visual specification is maintained in [docs/quality/ANIMATION-DESIGN-SYSTEM.md](docs/quality/ANIMATION-DESIGN-SYSTEM.md).

The intended quality principles are:

- Motion communicates an interaction or a state change. It is not required for the control to function.
- Controls retain distinct motion identities instead of sharing one generic transition.
- Reduced-motion preferences preserve the same information and final state without unnecessary animation.
- Keyboard and touch interactions are considered alongside pointer behavior.
- Dynamic data, disabled states, invalid values, empty states, and component lifecycle transitions are part of the API contract.
- User-provided text is rendered safely. Editors and visual components must not execute submitted source text.

## 🛠️ Development and verification

### Requirements

- Node.js 20 or later for the repository tooling.
- npm.
- Python 3 for the simple local HTTP server.
- Chromium or Chrome for the real-browser interaction suite.

### Commands

```bash
# Rebuild the shared runtime embedded in component scripts
npm run build

# Check generated runtime parity and repository structure
npm run check

# Run structural and source validation
npm test

# Start a local server in terminal 1
python3 -m http.server 8000

# Run real touch/keyboard/browser tests in terminal 2
npm run test:browser
```

The browser command expects the gallery to be served at `http://localhost:8000/gallery/`. The test runner drives Chromium through its DevTools Protocol. It checks interactions, form behavior, accessibility-related state, dynamic attributes, reduced-motion behavior, lifecycle behavior, and the mobile-width overflow guard.

**Current verified status is recorded in [docs/QUALITY-AND-RELEASE.md](docs/QUALITY-AND-RELEASE.md).** Do not treat a passing source validator as proof that browser interactions pass.

## 📚 Documentation map

| Document | Purpose |
|---|---|
| [Component index](docs/COMPONENTS.md) | All 82 elements, categories, source folders, demos, and API references |
| [Project reference](docs/PROJECT-REFERENCE.md) | Architecture, runtime, component contract, gallery, tooling, project history across all 14 phases |
| [Quality and release](docs/QUALITY-AND-RELEASE.md) | Current verification evidence, resolved browser regressions, manual sign-off, package-release gates |
| [Accessibility guide](docs/ACCESSIBILITY.md) | Keyboard, focus, reduced-motion, screen-reader and manual QA guidance |
| [Animation design system](docs/quality/ANIMATION-DESIGN-SYSTEM.md) | Visual tokens, motion principles, runtime rules, accessibility and visual QA |
| [License](LICENSE) | MIT License |
| [Contributing](CONTRIBUTING.md) | Contribution expectations and local checks |
| [Security](SECURITY.md) | Responsible vulnerability reporting |
| [Code of Conduct](CODE_OF_CONDUCT.md) | Community participation standards |
| [Support](SUPPORT.md) | Troubleshooting and usage support |

## 📦 Install and use as an npm package

The browser-only npm package `vfx-ui-anime@0.1.0` is publicly available. It has one aggregate browser entry point and individual subpaths for all 82 custom elements.

```bash
npm install vfx-ui-anime
```

Register every custom element:

```js
import 'vfx-ui-anime';
```

Or register one element only:

```js
import 'vfx-ui-anime/button';
```

The project uses browser-native Web Components, not named React/Vue classes. The package must be loaded after the DOM exists. See [the package guide](docs/PACKAGE.md) for all component paths, CDN usage, SSR limitations, exact tarball contents, and publication instructions.

### GitHub Packages registry

A scoped GitHub Packages distribution is configured as `@brajesh31/vfx-ui-anime`. The existing `vfx-ui-anime` npmjs package remains unchanged. The first GitHub Packages publication still needs one manual workflow run.

```bash
npm install @brajesh31/vfx-ui-anime
```

The repository [`.npmrc`](.npmrc) routes only the `@brajesh31` scope to GitHub Packages and reads authentication from `NODE_AUTH_TOKEN`. For local installs of a private package, use a GitHub personal access token (classic) with `read:packages`. GitHub Actions publishing uses the repository's `GITHUB_TOKEN` with `packages: write`.

The [GitHub Packages publishing workflow](.github/workflows/publish-github-package.yml) must be run once from Actions to create the first package. Until that run succeeds, `npm install @brajesh31/vfx-ui-anime` will not resolve. GitHub makes first-published packages private by default; change the package visibility to Public in package settings if public GitHub Packages access is intended. See [the package guide](docs/PACKAGE.md) for the exact authentication and publishing steps.

**Publication status:** `vfx-ui-anime@0.1.0` is publicly available on npm. Install it with `npm install vfx-ui-anime` or pin `npm install vfx-ui-anime@0.1.0`. The `latest` distribution tag resolves to `0.1.0`. The stable [GitHub Release v0.1.0](https://github.com/Brajesh31/vfx-ui-anime/releases/tag/v0.1.0) includes the package tarball. For future versions, `.github/workflows/publish.yml` is configured to stage packages through npm Trusted Publishing (OIDC) once the Trusted Publisher connection is saved for this repository; each staged release requires maintainer review and 2FA approval. Confirm the connection in npm settings, then remove the no-longer-needed `NPM_TOKEN` GitHub Actions secret and revoke the temporary granular token.

