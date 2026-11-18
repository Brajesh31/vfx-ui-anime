<p align="center"><img src="assets/brand-mark.svg" width="88" alt="VFX UI Anime brand mark"></p>

# ✨ VFX UI Anime

**Anime-impact motion for everyday interface controls.** Fifteen native Web Components, including eleven fully animated, source-backed controls with spring motion, impact bursts, drawn smoke, splashes, slashes, and embedded frame artwork.

<p align="center"><img src="assets/hero-illustration.svg" alt="Abstract impact artwork" width="100%"></p>

## 🌸 The component library

Every component has its own folder with `index.js`, `demo.html`, and `README.md`.

| Component | Element | Component folder |
|---|---|---|
| Button | `<vfx-button>` | [components/button/](components/button/) |
| Toggle | `<vfx-toggle>` | [components/toggle/](components/toggle/) |
| Slider | `<vfx-slider>` | [components/slider/](components/slider/) |
| Checkbox | `<vfx-checkbox>` | [components/checkbox/](components/checkbox/) |
| Radio | `<vfx-radio>` | [components/radio/](components/radio/) |
| Input | `<vfx-input>` | [components/input/](components/input/) |
| Tabs | `<vfx-tabs>` | [components/tabs/](components/tabs/) |
| Progress | `<vfx-progress>` | [components/progress/](components/progress/) |
| Rating | `<vfx-rating>` | [components/rating/](components/rating/) |
| Toast | `<vfx-toast>` | [components/toast/](components/toast/) |
| Tooltip | `<vfx-tooltip>` | [components/tooltip/](components/tooltip/) |
| Like | `<vfx-like>` | [components/like/](components/like/) |
| Accordion | `<vfx-accordion>` | [components/accordion/](components/accordion/) |
| Segmented | `<vfx-segmented>` | [components/segmented/](components/segmented/) |
| Notification | `<vfx-notification>` | [components/notification/](components/notification/) |

The first eleven controls are self-contained scripts. Each carries the motion engine it needs, so they can run independently without loading the separate `core.js` file. The Like, Accordion, Segmented, and Notification controls use the additional VFX UI Anime engine in `core.js`.

## 🚀 Explore

Open the [interactive component gallery](index.html), browse the [artwork gallery](art-gallery/), or try a [standalone button demo](components/button/demo.html).

## 📦 Use a source-backed component

The original animated controls are standalone scripts. Load the component directly:

```html
<script defer src="/components/button/index.js"></script>
<vfx-button>Confirm</vfx-button>
```

The other eleven original controls follow the same pattern. See the component's local README for attributes, properties, events, behaviour, and limits.

## 📦 Use one of the additional VFX controls

These four controls use the additional shared VFX UI Anime engine:

```html
<script defer src="/core.js"></script>
<script defer src="/components/like/index.js"></script>
<vfx-like label="Like" liked-label="Liked"></vfx-like>
```

## 🎨 Design language

White paper surfaces, deep violet ink, lavender impact fills, pink accents, bold outlines, spring overshoot, and hand-drawn motion artwork. Component tokens use the `--vfx-*` prefix.

## ♿ Accessibility and motion

- Controls use native browser inputs or buttons inside their custom elements where appropriate.
- Keyboard behaviour, form participation, and accessible names are documented per component.
- The source-backed effect engine respects `prefers-reduced-motion`.
- Test each control in the browsers and assistive technologies used by your application.

## 🧰 Development

No package install is required to run the static gallery:

```bash
python3 -m http.server 8000
```

Run `npm run check` for static validation and `npm run test:browser` for the browser interaction suite.

## 📚 Documentation

- [Component overview](docs/COMPONENTS.md)
- [Component API reference](docs/COMPONENT_API_REFERENCE.md)
- [Installation](docs/INSTALLATION.md)
- [Architecture](docs/ARCHITECTURE.md)
- [Accessibility](docs/ACCESSIBILITY.md)
- [Testing](docs/TESTING.md)
- [Design system](docs/DESIGN_SYSTEM.md)
- [Changelog](CHANGELOG.md)

## License

See the root [MIT license](LICENSE) for this repository's own files. Adapted third-party components and their required license terms are disclosed in [THIRD_PARTY_NOTICES/LICENSES.md](THIRD_PARTY_NOTICES/LICENSES.md).
