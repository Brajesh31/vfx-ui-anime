# ✨ VFX UI Anime

**Anime-inspired impact motion for real interface controls.**

VFX UI Anime is a collection of **82 dependency-free Web Components** with a shared visual language built around spring motion, illustrated impact effects, responsive controls, and practical interaction behavior.

- **82 custom element types**
- **83 interactive gallery examples**
- **82 standalone component demos**
- **No runtime framework or third-party component dependency**
- **MIT licensed**
- **Not yet published to npm**

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

## 📦 Package and release status

The source repository is MIT-licensed. The npm package is **not published**. The current `package.json` intentionally retains `"private": true`.

The complete integrated validation suite, CodeQL, GitHub Pages deployment and OpenSSF Scorecard all passed on merged `main` commit `bb7bd2928bd4605e15528d9d3550b2a718bc6ab9`. See [the exact run links and remaining release gates](docs/QUALITY-AND-RELEASE.md).

The package is not yet release-approved. Manual visual, keyboard-only, touch and screen-reader review remains outstanding, as do package tarball inspection and a clean consumer installation test. Do not use an npm install command as though a public version already exists.

## 📄 License

VFX UI Anime is distributed under the [MIT License](LICENSE).

Copyright © 2026 Brajesh Kumar.
