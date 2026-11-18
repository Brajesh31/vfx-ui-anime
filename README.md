<p align="center"><img src="assets/brand-mark.svg" width="88" alt="VFX UI Anime brand mark"></p>

# ✨ VFX UI Anime

**Anime-inspired motion for everyday interface controls.** VFX UI Anime is a small, dependency-free Web Components library. It adds expressive feedback to buttons, toggles, sliders, forms and common interface patterns using native browser primitives and a shared canvas effects layer.

<p align="center"><img src="assets/hero-illustration.svg" alt="Original abstract anime impact illustration" width="100%"></p>

> Independent implementation inspired by the broader idea of expressive anime-style UI motion. This project is not affiliated with or endorsed by the Sakuga VFX reference project.

<p align="center">
  <img src="https://img.shields.io/badge/vanilla-JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=111" alt="Vanilla JavaScript">
  <img src="https://img.shields.io/badge/Web%20Components-native-6557d9?style=for-the-badge" alt="Native Web Components">
  <img src="https://img.shields.io/badge/dependencies-zero-20a779?style=for-the-badge" alt="Zero runtime dependencies">
  <img src="https://img.shields.io/badge/license-MIT-ff5f9e?style=for-the-badge" alt="MIT License">
</p>

## 🌸 What's included

| Component | Custom element | Purpose |
|---|---|---|
| Button | `<vfx-button>` | Click feedback and impact burst |
| Toggle | `<vfx-toggle>` | Boolean state switch |
| Slider | `<vfx-slider>` | Numeric range input |
| Checkbox | `<vfx-checkbox>` | Boolean form choice |
| Radio | `<vfx-radio>` | Native radio group with named, required and disabled states |
| Input | `<vfx-input>` | Text entry |
| Tabs | `<vfx-tabs>` | Horizontal/vertical tabs with arrow-key navigation |
| Progress | `<vfx-progress>` | Numeric progress display |
| Rating | `<vfx-rating>` | Five-star rating |
| Toast | `<vfx-toast>` | Temporary status message |
| Tooltip | `<vfx-tooltip>` | Contextual hint |

### ⌨️ Improved keyboard interactions

Tabs now support horizontal and vertical orientation, arrow-key navigation, and Home/End selection. Radio groups use native radio inputs for browser keyboard behavior and support accessible group labels, required state, disabled state, and form lifecycle callbacks. The host application remains responsible for associating tabs with their content panels.

## 🚀 Live website and GitHub Pages

<badge color="success">Deployed</badge>

The static website is published through GitHub Pages. The workflow validates the repository, uploads the site artifact, and deploys it when changes are pushed to `main`.

**Live website:** https://brajesh31.github.io/vfx-ui-anime/

[View deployment workflow and latest runs](https://github.com/Brajesh31/vfx-ui-anime/actions/workflows/deploy-pages.yml) · [Open repository Pages settings](https://github.com/Brajesh31/vfx-ui-anime/settings/pages)

See [Deployment](docs/DEPLOYMENT.md) for hosting details and troubleshooting.

## 🚀 Run the gallery locally

No package install or production build step is required.

```bash
git clone https://github.com/Brajesh31/vfx-ui-anime.git
cd vfx-ui-anime
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

## 📦 Use a component

Load the shared engine before the component scripts:

```html
<link rel="stylesheet" href="styles.css">
<script defer src="core.js"></script>
<script defer src="components/button.js"></script>
<vfx-button>Launch</vfx-button>
```

Each component is a JavaScript custom element that uses the shared core. The core creates one page-level canvas and exposes `window.VFXAnime` for effect helpers. See [Installation](docs/INSTALLATION.md), [Component API overview](docs/COMPONENTS.md), and the [detailed component API reference](docs/COMPONENT_API_REFERENCE.md).

## 🧑‍🍳 Try the integration cookbook

Open the [runnable integration cookbook](examples/integration-cookbook.html) to see all eleven components wired to host-page state and events. The accompanying [integration cookbook guide](docs/INTEGRATION_COOKBOOK.md) includes vanilla JavaScript, React, Vue and Angular patterns, plus form and accessibility cautions.

## 🎨 Theme tokens

Override `--vfx-ink`, `--vfx-paper`, `--vfx-lavender`, `--vfx-violet` and `--vfx-pink` in your stylesheet.

## ♿ Accessibility and motion

- Components use native buttons, inputs and keyboard-focusable controls where practical.
- The shared engine respects `prefers-reduced-motion` by disabling canvas particles.
- Tooltips are available on keyboard focus as well as hover.
- Test your own labels, form semantics and assistive-technology combinations before shipping.

This is an initial implementation. Do not assume complete form-associated custom element parity or full screen-reader compatibility without testing in your target browsers.

## 🧰 Development

```bash
npm test
npm run check
python3 -m http.server 8000
```

The checks validate required files, component registrations and key accessibility hooks. They are static checks, not a substitute for browser-based interaction tests.

## 📚 Documentation

- [Installation](docs/INSTALLATION.md)
- [Component API overview](docs/COMPONENTS.md)
- [Detailed component API reference](docs/COMPONENT_API_REFERENCE.md)
- [Integration cookbook](docs/INTEGRATION_COOKBOOK.md)
- [Runnable cookbook example](examples/integration-cookbook.html)
- [Architecture](docs/ARCHITECTURE.md)
- [Development guide](docs/DEVELOPMENT.md)
- [Testing strategy](docs/TESTING.md)
- [Accessibility notes](docs/ACCESSIBILITY.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Framework integrations](docs/INTEGRATIONS.md)
- [Release checklist](docs/RELEASE.md)
- [Visual design system](docs/DESIGN_SYSTEM.md)
- [Visual language board](assets/design-system/visual-language.svg)
- [Motion principles storyboard](assets/design-system/motion-principles.svg)
- [Reference audit: Sakuga VFX](docs/REFERENCE_AUDIT.md)
- [Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)
- [AI agent guide](llms.txt)
- [Agent skill](skills/vfx-ui-anime/SKILL.md)
- [Agent instructions](AGENTS.md)

## 🗺️ Project status

The first public implementation includes eleven components and a static gallery. Browser compatibility, real-device performance, screen-reader behavior and advanced form integration still need a dedicated QA pass. See [known limitations](docs/ACCESSIBILITY.md) and [roadmap](ROADMAP.md).

## 🙏 Inspiration

The interaction concept was inspired by [finktheartist/sakuga-vfx](https://github.com/finktheartist/sakuga-vfx). This repository contains an independent implementation and original code. No original source files or generated art assets are copied into this project.

## 📄 License

MIT. See [LICENSE](LICENSE).
