# Day 1: Official launch announcement

**Status:** Draft prepared. Not yet published as a GitHub Discussion.  
**Target category:** Announcements  
**Canonical destination:** https://github.com/Brajesh31/vfx-ui-anime/discussions

## Discussion title

✨ Introducing VFX UI Anime: 82 Animated Web Components

## Ready-to-paste Discussion body

Today I'm introducing **VFX UI Anime**, an open-source collection of 82 dependency-free, anime-inspired Web Components.

The idea behind the project is simple: everyday interface controls can be practical and expressive at the same time.

VFX UI Anime brings together browser-native custom elements, a shared motion language, illustrated impact effects and interaction-focused controls. It includes components for forms, navigation, feedback, data visualization, creative workflows and more.

### Explore the project

- 🌐 **Live gallery:** https://brajesh31.github.io/vfx-ui-anime/
- 💻 **Source repository:** https://github.com/Brajesh31/vfx-ui-anime
- 📦 **npm package:** https://www.npmjs.com/package/vfx-ui-anime
- 📖 **Component index:** https://github.com/Brajesh31/vfx-ui-anime/blob/main/docs/COMPONENTS.md
- 🤝 **Contributing guide:** https://github.com/Brajesh31/vfx-ui-anime/blob/main/CONTRIBUTING.md

### What's included?

- 82 browser-native custom element types.
- 83 interactive gallery examples.
- 82 standalone component demos.
- No runtime framework or third-party component dependency.
- Aggregate imports and individual component subpaths.
- MIT license.

### Try it

Install the npm package:

```bash
npm install vfx-ui-anime
```

Register all components in a browser-side entry module:

```js
import 'vfx-ui-anime';
```

Or import one component:

```js
import 'vfx-ui-anime/button';
```

Then use its registered custom element:

```html
<vfx-button>Save</vfx-button>
```

VFX UI Anime is browser-only. Load it after the DOM environment exists. It does not currently provide React/Vue wrappers or named component classes. Check each component's documentation for its supported attributes, properties, events and slots.

### I'd value specific developer feedback

1. Which component would you try first, and what would you build with it?
2. Is the installation and component documentation clear enough to get started?
3. Which interaction, API or accessibility detail should be improved first?
4. If you try it in a project, what works well and what gets in your way?

Please share reproducible issues, screenshots or small examples where possible. Critical feedback is welcome. Contributions to documentation, demos, tests and implementation are welcome too.

**Explore the gallery, try a component and help improve the project.**

---

## Maintainer publication steps

1. Open https://github.com/Brajesh31/vfx-ui-anime/discussions.
2. Select **New discussion**.
3. Choose the **Announcements** category.
4. Copy the title and body above into the corresponding fields.
5. Preview the Markdown and verify the gallery, npm and documentation links.
6. Publish the discussion.
7. Copy its canonical URL into `docs/community/CAMPAIGN-PROGRESS.md`.
8. Only then mark Day 1 complete.

Do not create a second announcement if an equivalent Day 1 discussion has already been published. In that case, record the existing canonical URL instead.

## Publication evidence

- Draft file commit: to be recorded in campaign progress after this file is committed.
- Discussion URL: pending maintainer publication.
