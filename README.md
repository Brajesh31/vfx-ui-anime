# ✨ VFX UI Anime

**Anime-inspired motion for everyday interface controls.** VFX UI Anime is a small, dependency-free Web Components library. It adds expressive feedback to buttons, toggles, sliders, forms and common interface patterns using native browser primitives and a shared canvas effects layer.

> Independent implementation inspired by the broader idea of expressive anime-style UI motion. This project is not affiliated with or endorsed by the Sakuga VFX reference project.

<p align="center">
  <img src="https://img.shields.io/badge/vanilla-JavaScript-f7df1e?style=for-the-badge&logo=javascript&logoColor=111" alt="Vanilla JavaScript">
  <img src="https://img.shields.io/badge/Web%20Components-native-6557d9?style=for-the-badge" alt="Native Web Components">
  <img src="https://img.shields.io/badge/dependencies-zero-20a779?style=for-the-badge" alt="Zero dependencies">
  <img src="https://img.shields.io/badge/license-MIT-ff5f9e?style=for-the-badge" alt="MIT License">
</p>

## 🌸 What's included

| Component | Custom element | Purpose |
|---|---|---|
| Button | `<vfx-button>` | Click feedback and impact burst |
| Toggle | `<vfx-toggle>` | Boolean state switch |
| Slider | `<vfx-slider>` | Numeric range input |
| Checkbox | `<vfx-checkbox>` | Boolean form choice |
| Radio | `<vfx-radio>` | Single choice from options |
| Input | `<vfx-input>` | Text entry |
| Tabs | `<vfx-tabs>` | Select a tab |
| Progress | `<vfx-progress>` | Numeric progress display |
| Rating | `<vfx-rating>` | Five-star rating |
| Toast | `<vfx-toast>` | Temporary status message |
| Tooltip | `<vfx-tooltip>` | Contextual hint |

## 🚀 Run the gallery

No package install or build step is required.

```bash
git clone https://github.com/Brajesh31/vfx-ui-anime.git
cd vfx-ui-anime
python3 -m http.server 8000
```

Open [http://localhost:8000](http://localhost:8000).

You can also use any static HTTP server. Opening the HTML directly with `file://` is not recommended because browser security and module behavior vary.

## 📦 Use a component

Load the shared engine before the component scripts:

```html
<link rel="stylesheet" href="styles.css">
<script defer src="core.js"></script>
<script defer src="components/button.js"></script>

<vfx-button>Launch</vfx-button>
```

Each component is a standalone JavaScript file once the shared core is loaded. The core creates one page-level canvas and exposes `window.VFXAnime` for effect helpers.

### Toggle

```html
<script defer src="core.js"></script>
<script defer src="components/toggle.js"></script>
<vfx-toggle label="Email updates" name="updates"></vfx-toggle>
``

### Slider

```html
<script defer src="core.js"></script>
<script defer src="components/slider.js"></script>
<vfx-slider min="0" max="100" value="42"></vfx-slider>
``

### Progress

```html
<script defer src="core.js"></script>
<script defer src="components/progress.js"></script>
<vfx-progress value="68" label="Upload progress"></vfx-progress>
``

See [Component API](docs/COMPONENTS.md) for attributes, properties and events.

## 🎨 Theme tokens

Override these CSS custom properties in your own stylesheet:

| Token | Default | Usage |
|---|---|---|
| `--vfx-ink` | `#211b43` | Text and outlines |
| `--vfx-paper` | `#fffdfb` | Page surface |
| `--vfx-lavender` | `#aaa5ff` | Motion shadow |
| `--vfx-violet` | `#6557d9` | Primary accent |
| `--vfx-pink` | `#ff5f9e` | Impact accent |

## ♿ Accessibility and motion

- Components use native buttons, inputs and keyboard-focusable controls where practical.
- The shared engine respects `prefers-reduced-motion` by disabling canvas particles.
- Tooltips are available on keyboard focus as well as hover.
- Test your own labels, form semantics and assistive-technology combinations before shipping.

This is an initial implementation. Do not assume complete form-associated custom element parity or full screen-reader compatibility without testing in your target browsers.

## 🧰 Development

There is no bundler. Serve the repository locally, edit the component files, then run:

```bash
npm test
npm run check
```

The checks validate required files, component registrations and key accessibility hooks. They are static checks, not a substitute for browser-based interaction tests.

## 📚 Documentation

- [Component API](docs/COMPONENTS.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Development guide](docs/DEVELOPMENT.md)
- [Accessibility notes](docs/ACCESSIBILITY.md)
- [Deployment](docs/DEPLOYMENT.md)
- [Roadmap](ROADMAP.md)
- [Changelog](CHANGELOG.md)
- [AI agent guide](llms.txt)
- [Agent skill](skills/vfx-ui-anime/SKILL.md)

## 🗺️ Project status

The first public implementation includes eleven components and a static gallery. Browser compatibility, real-device performance, screen-reader behavior and advanced form integration still need a dedicated QA pass. See [known limitations](docs/ACCESSIBILITY.md) and [roadmap](ROADMAP.md).

## 🙏 Inspiration

The interaction concept was inspired by [finktheartist/sakuga-vfx](https://github.com/finktheartist/sakuga-vfx). This repository contains an independent implementation and original code. No original source files or generated art assets are copied into this project.

## 📄 License

MIT. See [LICENSE](LICENSE).
