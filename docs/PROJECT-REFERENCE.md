# 🏗️ VFX UI Anime project reference

This document is the consolidated record of the repository architecture, implementation scope, engineering standards, and the 14-stage component upgrade program. The former per-phase reports have been consolidated here so the project has one durable reference instead of a stack of temporary progress reports.

## 1. Project overview

VFX UI Anime is a browser-native library of 82 custom elements and 83 gallery examples. Each component is implemented as a standalone JavaScript Web Component with a per-component HTML demo and API reference.

The current distribution includes standalone browser scripts and a browser-only npm package contract:
- No application framework is required.
- There is no runtime dependency install for the component library itself.
- Each component script registers its custom element and embeds the shared VFX runtime.
- Components are demonstrated in the static gallery.
- The repository includes Node tooling for source/build checks and Chromium browser interactions.

The live gallery is published at https://brajesh31.github.io/vfx-ui-anime/.

## 2. Repository map

| Path | Responsibility |
|---|---|
| `index.html` | Entry page forwarding visitors to the gallery |
| `gallery/index.html` | Main interactive gallery and demonstrations |
| `components/<name>/index.js` | Component implementation and custom-element registration |
| `components/<name>/demo.html` | Isolated component demonstration |
| `components/<name>/README.md` | Component-specific API and usage reference |
| `core.js` | Shared animation and effects runtime source of truth |
| `registry.json` | Component registry and metadata |
| `llms.txt` | Machine-readable project/component orientation |
| `tools/build.mjs` | Synchronizes the shared runtime into standalone components |
| `tools/validate.mjs` | Structural, syntax, registry, demo and generated-runtime checks |
| `tools/test.mjs` | Chromium browser interaction suite |
| `tools/package-smoke.mjs` | npm tarball, offline consumer install, export-resolution and Chromium import smoke tests |
| `index.js` | Aggregate browser entry point registering all 82 custom elements |
| `.github/workflows/validate.yml` | Validation workflow |
| `.github/workflows/deploy-pages.yml` | Separate GitHub Pages build/artifact and dependent deployment jobs |
| `.github/workflows/codeql.yml` | CodeQL static analysis workflow |
| `.github/workflows/scorecard.yml` | OpenSSF Scorecard workflow |
| `.github/workflows/release.yml` | Source-only pre-release workflow gated on exact candidate verification |
| `.github/workflows/bootstrap-publish.yml` | One-time first npm publication with a protected token |
| `.github/workflows/publish.yml` | Later npm releases using OIDC trusted publishing and provenance |
| `docs/PACKAGE.md` | npm installation, imports, CDN usage and publication instructions |
| `docs/COMPONENTS.md` | Component directory and category index |
| `docs/QUALITY-AND-RELEASE.md` | Current automated evidence and release decision |
| `docs/quality/ANIMATION-DESIGN-SYSTEM.md` | Visual system and motion specification |

## 3. Component architecture

### 3.1 Custom elements

The public custom-element naming convention is `vfx-<component-name>`. Components use browser custom elements and encapsulated shadow DOM. Public properties and attributes vary by component and are documented individually.

The shared base runtime provides:
- Shared animation timing and effect drawing.
- A spring primitive and reusable effect helpers.
- Shadow-root setup and common element lifecycle.
- Event dispatch through composed custom events.
- The documented `window.VFXAnimeFX` runtime object.

Do not infer that all components expose identical methods, events, or value shapes. The individual README and implementation are authoritative.

### 3.2 Standalone source model

Each component implementation embeds the shared runtime between build markers. This is deliberate: a component file can be loaded independently without requiring an application bundler to load `core.js` first.

`core.js` is the editable source of truth for the shared runtime. After a shared-runtime change, run:

```bash
npm run build
npm run check
```

The build step synchronizes the runtime into the 82 component files. The `--check` mode detects generated copies that do not match the source runtime.

Do not edit duplicated embedded runtime blocks by hand. Modify `core.js` and regenerate the component files through the build tool.

### 3.3 Component directory contract

Every component directory is expected to contain:
- `index.js`: standalone component source.
- `demo.html`: local demonstration and example usage.
- `README.md`: installation, API, events, accessibility, behavior and known limits.

The structural validator checks these artifacts and validates the component-to-registry/gallery mapping.

## 4. Shared visual system

The VFX visual identity includes:
- Ink text and outlines.
- White/paper surfaces.
- Lavender shadows and depth.
- Purple line work.
- Pink impact accents.
- Component-specific illustrated effects.
- Spring-driven response for interaction feedback.

The shared visual tokens are defined in the embedded runtime and described in [the animation design system](quality/ANIMATION-DESIGN-SYSTEM.md). Current identity anchors include `--vfx-ink`, `--vfx-card`, `--vfx-soft`, `--vfx-pri`, `--vfx-acc`, `--vfx-dim`, `--vfx-track`, `--vfx-r`, `--vfx-bw`, and `--vfx-sh`.

### Motion rules

1. Motion should explain an action, transition, or feedback state.
2. Each component should retain an appropriate motion identity.
3. Decorative motion must not delay a control's functional state change.
4. Repeated input must not cause stale animation callbacks to overwrite newer state.
5. Reduced-motion preferences must preserve information and final state.
6. Frame callbacks, observers, timers, and global listeners must be cleaned up when components disconnect.
7. Avoid unnecessary ambient motion, autoplay, and large media downloads.

## 5. Interaction, accessibility, and safety standards

The original quality audit established a behavior-based acceptance model. The intended review dimensions include:

- Accessible name, role, value, description and state.
- Keyboard operation and visible focus.
- Logical focus movement, modal containment and focus restoration.
- Pointer, touch and pen behavior where applicable.
- Correct native form value, validity, disabled, required and reset behavior.
- Dynamic attribute/property synchronization.
- Empty, invalid, boundary and disabled states.
- Reduced-motion behavior, including a preference change while running.
- Disconnect/reconnect behavior for observers, listeners, media, timers and animation frames.
- Safe display of untrusted labels, code, JSON, rich text and Markdown.
- Responsive behavior at mobile, tablet and desktop widths.

Automated ARIA assertions and simulated input are useful evidence, but they do not certify real assistive-technology behavior. Human screen-reader, keyboard-only and visual review are separate release activities.

## 6. Gallery and registry integrity

The repository contains 82 component folders and 83 gallery examples. The additional gallery example is a second Button variant. Gallery IDs must remain unique even when two examples use the same component tag.

`registry.json` is the component directory metadata source. The validator checks that its component entries map to the expected source and README paths. The gallery should demonstrate all 82 custom-element types and must not silently omit or duplicate a component example.

When adding or renaming a component:
1. Add/update the component source, standalone demo and README.
2. Update the canonical build and validation component lists.
3. Update registry metadata.
4. Add/update its gallery example and keep demo IDs unique.
5. Add targeted browser regressions.
6. Run build checks, structural checks and the full browser suite.
7. Update `docs/COMPONENTS.md` and `llms.txt`.

## 7. Development and test tooling

### Build and structural validation

```bash
npm run build
npm run check
npm test
```

- `npm run build` propagates `core.js` into each standalone component.
- `npm run check` verifies generated runtime consistency and runs structural validation.
- `npm test` runs `tools/validate.mjs`.

### Browser interactions

Start the local gallery server:

```bash
python3 -m http.server 8000
```

Then, from another terminal:

```bash
npm run test:browser
```

The browser test runner uses Node.js and Chromium/Chrome through the Chrome DevTools Protocol. It sets a narrow mobile viewport and touch emulation, then exercises component interactions and regression scenarios. It also checks the 390 px horizontal-overflow guard.

The current exact outcomes and failures are documented in [QUALITY-AND-RELEASE.md](QUALITY-AND-RELEASE.md). Keep test output honest: a test file containing assertions is not proof that those assertions pass.

## 8. Continuous integration and deployment

The repository contains seven GitHub Actions workflows:

| Workflow | Purpose |
|---|---|
| Validate | Run structural/source validation, generated-runtime checks, and browser interaction tests |
| Deploy to GitHub Pages | Validate, upload the static site, and publish it to GitHub Pages |
| CodeQL | Static security analysis |
| OSSF Scorecard | Repository security posture analysis |
| Source pre-release | Verified source-only prereleases |
| Bootstrap npm publication | One-time first npm publish with a protected token |
| Publish npm package | Subsequent version tags with OIDC and provenance |

GitHub Pages is the configured live-site deployment target. Its workflow validates the source and uploads the static-site artifact in a `build` job, then deploys that artifact in a dependent `deploy` job. This separation allows a deployment-only retry without creating a second `github-pages` artifact. The workflow does not cancel an in-progress deployment when a new main-branch push arrives.

Vercel integration status checks are separate from these repository workflows. A Vercel build-rate-limit status must not be interpreted as a GitHub Actions failure or success.

Always record results against the exact release-candidate commit SHA. A green workflow from a prior phase or a different commit does not establish that the current candidate passes.

## 9. Fourteen-stage implementation history

The roadmap is complete as an implementation program. The stages are recorded here as a historical summary rather than separate phase reports.

| Stage | Scope | Main work |
|---|---|---|
| 1. Component audit and quality baseline | All 82 components | Inventory, source review, design token capture, priority map, universal acceptance matrix, and visual/motion specification |
| 2. Signature controls | Button, Toggle, Slider, Checkbox, Radio, Input, Tabs, Progress, Rating, Toast, Tooltip | Form lifecycle, validation, stale animation guards, overlays, focus, touch and reduced-motion behavior |
| 3. Core interface and feedback | Select, Textarea, Number, Search, File Upload, Color Picker, Accordion, Segmented, OTP, Tag Input, Pagination, Alert, Skeleton, Badge, Avatar, Chip, Breadcrumb, Stepper | Dynamic property/attribute updates, native validity, disabled-state behavior, file filtering, OTP completion and observer cleanup |
| 4. Navigation and overlays | Menu, Dialog, Drawer, Calendar, Date Picker, Command Palette, Context Menu, Combobox | Focus entry/return, Escape handling, dynamic labels and values, date bounds, disabled guards and native modal behavior |
| 5. Creative workflow | Drag and Drop, Carousel, Timeline, Radial Menu, Image Cropper | Dynamic collections, keyboard/focus behavior, empty states, crop geometry, safe asynchronous image loading and cleanup |
| 6. Workflow, data and creative | Kanban, Data Grid, Tree View, Signature Pad, Before/After | Data normalization, selection consistency, keyboard drawing, image state synchronization and empty/error fallbacks |
| 7. Advanced selection and layout | Multi Select, Time Picker, Transfer List, Split Pane, Lightbox Gallery | Collection normalization, form reset/validity, bounded time changes, keyboard resizing, modal focus restoration and image errors |
| 8. Productivity and content | Password Field, Date Range Picker, Notification Center, Rich Text Editor, Gradient Picker | Validation, rich-text sanitization, dynamic notification data, gradient stops and form behavior |
| 9. Workflow utilities | Wizard, Guided Tour, Stopwatch, Emoji Picker, Copy Code | Sequential validation, focus management, monotonic time, search/navigation and safe whitespace-preserving code display |
| 10. Charts and dashboards | Bar Chart, Donut Chart, Sparkline, KPI Card, Gauge, Heatmap, Treemap | Numeric normalization, SVG geometry, accessible summaries, keyboard selection and no-data states |
| 11. Creative tools and audio | Drawing Canvas, Color Palette, Audio Player | Canvas accessibility and export, functional CSS color parsing, clipboard fallback and native audio lifecycle |
| 12. Media, editors and 3D cards | Video Player, Markdown Editor, JSON Editor, Tilt Card, Flip Card | Media lifecycle, safe preview rendering, dynamic editor state, pointer/reduced-motion behavior and accessible card state |
| 13. Advanced motion | Particle Field, Marquee, Scroll Reveal, Animated Counter, Confetti Button | Bounded motion settings, slot/observer lifecycle, locale formatting, safe labels and reduced-motion effects |
| 14. Whole-library integration | All 82 components, registry, gallery, build/test tooling and CI | Static source/registry/demo/runtime checks, unique gallery identity, synchronized generated runtime and release gate definition |

### Recorded component counts

The original audit records 82 component folders, 82 standalone entry points, 82 component demos and 83 gallery examples. The roadmap's phase boundaries are implementation milestones. They do not mean that all possible manual QA or release approval steps have been completed.

## 10. Known design constraints and non-goals

The components are intentionally focused, not full replacements for large specialist products. Known limitations vary by component and are listed in each component README. Examples include single-series chart behavior, native browser media/codec constraints, local-only drawing/image processing, and browser-dependent clipboard/media permissions.

Do not describe a component as supporting a feature merely because a similar component in another library supports it. Use the component's actual source and README as the contract.

## 11. Project ownership and governance

The repository currently includes:
- MIT license.
- Contribution guidance.
- Code of Conduct.
- Security reporting guidance.
- Support guidance.
- Citation metadata.
- GitHub Actions workflows for validation, deployment, CodeQL and Scorecard.

The MIT license file is retained as supplied and attributes copyright to Brajesh Kumar. The license permits use and redistribution subject to its terms; it does not imply that an npm package has been published.

## 12. Maintenance guidance

Before changing a component:
1. Read its local README and demo.
2. Inspect the actual custom-element API and existing regression assertions.
3. Keep unrelated source and behavior unchanged.
4. Add a focused test for each behavior change.
5. Test disabled, empty, invalid, reduced-motion and disconnect/reconnect states where relevant.
6. Rebuild generated runtime copies if `core.js` changed.
7. Run `npm test`, `npm run check` and the full Chromium suite.
8. Review the console for uncaught errors.
9. Update the component README and component index.

Before cutting a release:
1. Use a clean commit and verify all required workflows on that exact SHA.
2. Pass every browser regression group.
3. Complete keyboard, visual, touch and assistive-technology manual review.
4. Review security, governance and package contents.
5. Validate the npm tarball and public entry points.
6. Add release notes and a version/tag only after sign-off.
