# ✨ VFX UI Anime

**Anime-impact motion for real interface controls.**

VFX UI Anime is a dependency-free Web Component collection. The original 11 adapted component types are retained with their spring behavior, painted toggle sequence, sound-effect artwork, impact effects, and standalone demos. Sixteen additional controls extend the same design and interaction language.

**Current library: 32 component types and 28 live gallery demos.** The 28 demos include primary and secondary Button examples.

## 🎮 Live gallery

Run a local server from the repository root:

```sh
python3 -m http.server 8000
```

Open [http://localhost:8000/](http://localhost:8000/). The home page forwards to the interactive component gallery.

## 🧩 Component library

| Component | Element | Component folder |
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
| Select | `<vfx-select>` | [components/select](components/select/) |
| Textarea | `<vfx-textarea>` | [components/textarea](components/textarea/) |
| Number Stepper | `<vfx-number>` | [components/number](components/number/) |
| Search | `<vfx-search>` | [components/search](components/search/) |
| Menu | `<vfx-menu>` | [components/menu](components/menu/) |
| Dialog | `<vfx-dialog>` | [components/dialog](components/dialog/) |
| File Upload | `<vfx-file-upload>` | [components/file-upload](components/file-upload/) |
| Color Picker | `<vfx-color-picker>` | [components/color-picker](components/color-picker/) |
| Accordion | `<vfx-accordion>` | [components/accordion](components/accordion/) |
| Segmented Control | `<vfx-segmented>` | [components/segmented](components/segmented/) |
| OTP Input | `<vfx-otp>` | [components/otp](components/otp/) |
| Tag Input | `<vfx-tag-input>` | [components/tag-input](components/tag-input/) |
| Pagination | `<vfx-pagination>` | [components/pagination](components/pagination/) |
| Alert | `<vfx-alert>` | [components/alert](components/alert/) |
| Drawer | `<vfx-drawer>` | [components/drawer](components/drawer/) |
| Skeleton Loader | `<vfx-skeleton>` | [components/skeleton](components/skeleton/) |

Each component folder contains:

- `index.js`, the standalone Web Component implementation, including the shared VFX animation runtime.
- `demo.html`, an isolated working preview.
- `README.md`, installation, API, events, behavior, accessibility, and limits.

## ⚡ Motion language

The library uses a restrained paper-and-ink palette, flat lavender shadow shapes, pink impact accents, and hand-drawn smoke, shards, crescents, speed lines, ticks, and sound-effect lettering. Interactive controls use spring response rather than generic CSS easing. Effects are triggered by real interactions, not idle animation.

Every component remains usable with `prefers-reduced-motion`. State changes and form values do not depend on animation completing.

## 🛠️ Development and quality checks

```sh
node tools/build.mjs
node tools/build.mjs --check
npm test
```

To run the real touch and keyboard interaction suite, start the server in one terminal:

```sh
python3 -m http.server 8000
```

Then run:

```sh
npm run test:browser
```

The browser suite exercises the original controls and the new controls, including selection, keyboard navigation, form values, file selection, menu actions, and dialog flows.

## 📦 Package status

**Not published.** The package metadata remains private while the expanded library is reviewed. npm publishing, registry release, versioning, and a public install command will only be enabled after approval.

## 🎨 Branding

The public project name is **VFX UI Anime**. Component tags use the `vfx-*` prefix, the shared runtime uses `window.VFXAnimeFX`, and theme tokens use the `--vfx-*` prefix.

## ⚖️ Licensing and attribution

The eleven adapted original component implementations and associated artwork retain the upstream MIT copyright and permission terms in [THIRD_PARTY_NOTICES/LICENSES.md](THIRD_PARTY_NOTICES/LICENSES.md). The eight additional controls were independently authored for VFX UI Anime. The root [LICENSE](LICENSE) applies to the repository's own contributions and does not replace third-party terms.


## Additional components in this release

- **Badge**: status labels with animated updates and optional pulse.
- **Avatar**: portraits, initials fallback, and presence states.
- **Chip**: selectable and removable tokens.
- **Breadcrumb**: semantic navigation trails.
- **Stepper**: bounded quantity input with keyboard and form support.

Each component includes a standalone implementation, isolated demo, and API documentation under `components/<name>/`.
