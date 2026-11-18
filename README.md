# ✨ VFX UI Anime

**Expressive anime-impact motion for everyday interface controls.**

VFX UI Anime is a rebranded, carefully adapted distribution of the original animated control library. It keeps the original component behavior, spring motion, painted toggle animation, particle effects, sound-effect lettering, interaction timing, and standalone demos. The public identity uses VFX UI Anime branding.

The gallery contains **12 live demonstrations**: primary and secondary Button examples, plus Toggle, Slider, Checkbox, Radio, Input, Tabs, Progress, Rating, Toast, and Tooltip. These are **11 reusable component types**.

## 🎮 Live gallery

Run the site locally:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000/](http://localhost:8000/). The home page forwards to the interactive gallery.

## 🧩 Components

| Component | Custom element | Source |
|---|---|---|
| Button | `<vfx-button>` | [components/button](components/button/) |
| Toggle | `<vfx-toggle>` | [components/toggle](components/toggle/) |
| Slider | `<vfx-slider>` | [components/slider](components/slider/) |
| Checkbox | `<vfx-checkbox>` | [components/checkbox](components/checkbox/) |
| Radio | `<vfx-radio>` | [components/radio](components/radio/) |
| Input | `<vfx-input>` | [components/input](components/input/) |
| Tabs | `<vfx-tabs>` | [components/tabs](components/tabs/) |
| Progress | `<vfx-progress>` | [components/progress](components/progress/) |
| Rating | `<vfx-rating>` | [components/rating](components/rating/) |
| Toast | `<vfx-toast>` | [components/toast](components/toast/) |
| Tooltip | `<vfx-tooltip>` | [components/tooltip](components/tooltip/) |

Each component folder contains its standalone JavaScript file, demo page, and API notes. Every original control includes the shared motion/effects runtime inside its own JavaScript file, so it can be loaded independently. The root `core.js` is the source of truth used by the build tool.

## 🛠️ Development and validation

```sh
node tools/build.mjs          # regenerate embedded runtime and toggle frames
node tools/build.mjs --check  # verify generated files are current
npm test                      # validate repository structure and registry
```

For interaction tests, start the local server in one terminal and run:

```sh
node tools/test.mjs http://localhost:8000/gallery/
```

The browser test uses real touch and keyboard events in Chromium. Set `CHROME` to the browser executable if it is not on your PATH.

## 📦 Package status

This repository is being prepared for review. **No npm package has been published.** Package naming, registry installation, versioning, and release automation will be finalized only after the website and component behavior are approved.

## 🎨 Branding

The public project name is **VFX UI Anime**. Component tags use the `vfx-*` prefix, the shared runtime uses `window.VFXAnimeFX`, and theme tokens use the `--vfx-*` prefix.

## ⚖️ Licensing and attribution

The animated component implementations and associated artwork are adapted from an MIT-licensed third-party project. The original copyright and complete permission terms are preserved in [THIRD_PARTY_NOTICES/LICENSES.md](THIRD_PARTY_NOTICES/LICENSES.md). The root [LICENSE](LICENSE) applies to the repository's own original VFX UI Anime contributions and does not replace third-party terms.
