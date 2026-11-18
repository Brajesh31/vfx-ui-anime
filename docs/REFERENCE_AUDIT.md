# 🔍 Phase 1 Reference Audit: Sakuga VFX

> **Audit date:** 2026-11-18  
> **Scope:** Reference inspection and target gap analysis only. No component implementation, redesign, or application behavior changes were made in this phase.

## 1. Executive summary

The reference project is [finktheartist/sakuga-vfx](https://github.com/finktheartist/sakuga-vfx). The target is [Brajesh31/vfx-ui-anime](https://github.com/Brajesh31/vfx-ui-anime).

Both repositories contain eleven broad custom-element categories. They are not currently feature-equivalent.

The reference is a detailed motion-component library with a shared spring/effects engine, a one-page live gallery, eleven individually documented demos, eleven independently loadable custom-element scripts, a painted toggle animation, a shadcn-compatible registry, an agent skill, asset tracing/build utilities, deterministic frame inspection, and Chromium interaction tests.

The target is an independent, lightweight implementation with the same eleven component categories, a compact shared particle engine, one static showcase, a project inventory, documentation, GitHub governance, and deployment automation. The target has the right component inventory, but many interactions are currently simplified or absent.

**Phase 1 conclusion:** the reference inventory and implementation model have been inspected. The feature gaps are documented below. Phase 1 is complete as a source and documentation audit, with one limitation: browser-based screenshots and interaction tests were inspected as code but not executed in this environment. No claim of runtime visual parity is made.

## 2. Repository snapshots

| Item | Reference | Target |
|---|---|---|
| Repository | `finktheartist/sakuga-vfx` | `Brajesh31/vfx-ui-anime` |
| Default branch | `main` | `main` |
| Visibility | Public | Public |
| Audited commit | `c3dabb173928a3ad2372183103caf2e6f50953d0` | `dcd91154855ee209c2853d0285d4670220673e80` |
| Git tree entries | 74 | 67 |
| Blob/file entries | 56 | 56 |
| Directory entries | 18 | 11 |
| Unique component types | 11 | 11 |
| Gallery examples | 12 cards, including two button variants | 11 component cards |
| Runtime dependencies stated | None | None |

The source tree count includes the source's component demo directories, artwork, skills, and tooling. The target tree includes a larger set of project governance and documentation files. Matching file counts do not indicate matching implementation depth.

## 3. Reference repository inventory

### Root files and top-level areas

| Path or area | Purpose |
|---|---|
| `.gitignore`, `LICENSE`, `README.md` | Repository metadata, license, primary documentation |
| `index.html` | Redirects visitors to `gallery/` |
| `core.js` | Shared motion, canvas, effect, timing, and custom-element foundation |
| `gallery/index.html` | Main interactive component showcase |
| `registry.json` | shadcn registry manifest for component installation |
| `llms.txt` | AI-readable project and component index |
| `art/words/` | Six original sound-effect artwork source images |
| `skills/sakuga-vfx/` | Agent skill, shared core copy, starter example, frame-inspection script |
| `tools/` | Core synchronization, screenshots, browser interaction tests, artwork tracing |
| `vercel.json` | Vercel trailing-slash configuration |

### Component directories

Every component has a JavaScript implementation, a component README, and a dedicated `index.html` demo page.

| Component | Implementation | Documentation | Demo |
|---|---|---|---|
| Button | `button/button.js` | `button/README.md` | `button/index.html` |
| Toggle | `toggle/toggle.js` | `toggle/README.md` | `toggle/index.html` |
| Slider | `slider/slider.js` | `slider/README.md` | `slider/index.html` |
| Checkbox | `checkbox/checkbox.js` | `checkbox/README.md` | `checkbox/index.html` |
| Radio | `radio/radio.js` | `radio/README.md` | `radio/index.html` |
| Input | `input/input.js` | `input/README.md` | `input/index.html` |
| Tabs | `tabs/tabs.js` | `tabs/README.md` | `tabs/index.html` |
| Progress | `progress/progress.js` | `progress/README.md` | `progress/index.html` |
| Rating | `rating/rating.js` | `rating/README.md` | `rating/index.html` |
| Toast | `toast/toast.js` | `toast/README.md` | `toast/index.html` |
| Tooltip | `tooltip/tooltip.js` | `tooltip/README.md` | `tooltip/index.html` |

The reference contains 12 gallery demo cards, not 12 unique element types. The primary and secondary button examples are separate cards, while they both use `<sakuga-button>`.

## 4. Reference visual and interaction model

### Design language

The source implementation and its documentation describe a visual system built around:

- White paper-like surfaces, dark ink outlines, lavender shadow tones, and restrained pink accents.
- Two-tone flat artwork with a strong outline rather than conventional soft, blurred particle effects.
- Controls that remain visually quiet at rest and react when used.
- Spring-driven anticipation, impact, follow-through, and settling.
- Japanese manga-style sound-effect lettering integrated into selected interaction moments.
- A responsive gallery with bordered cards, live component examples, short usage instructions, and per-component documentation links.

The gallery CSS uses a content width of approximately 1080px and cards that adapt to available width. It has a narrow-screen layout adjustment for its wider progress card. Each component demo page has an isolated stage, a short interaction hint, and a live feedback line. The individual pages support an `?embed=1` presentation mode that hides their heading and hint.

### Shared animation engine

The reference `core.js` is approximately 40.6 KB and contains considerably more than a particle emitter.

Its inspected public surface includes:

- A numerical `Spring` class with velocity, stiffness, damping, and frame stepping.
- Easing, interpolation, clamping, and random-value helpers.
- One shared animation clock and one page-level canvas.
- Optional component-local back layers for effects that must render behind a control.
- Shared scheduling through `later()`, persistent rendering through `persist()`, and manual clock advancement through `advance()`.
- Reduced-motion preference handling.
- A custom-element base class with Shadow DOM setup, component lifecycle handling, shared frame registration, helper selectors, and optional form association.
- Shared effect primitives: smoke puffs, impact bursts, crystal shards, rings, splash crowns, crescent slashes, speed lines, accent wedges, smoke rings, wobble marks, and glints.
- Six traced sound-effect word paths with alternate hollow and dotted treatments.
- Shared geometry, escaping, squash-animation, and idempotent custom-element registration helpers.

Every source component includes a copy of the shared core between build markers. The first loaded component initializes `window.SakugaFX`; the other components reuse it. The build utility synchronizes the root core into those component files.

### Reference interaction vocabulary

The main visual reactions are deliberately composed from multiple animation beats:

1. **Anticipation:** press, stretch, squash, or move in the direction of the action.
2. **Impact:** the state change is paired with a focused burst or sound-effect visual.
3. **Follow-through:** particles, smoke, slashes, drops, or lettering travel away from the control.
4. **Settle:** spring motion returns the control to a stable state.

The reference skill specifically requires the underlying control state to change independently of decorative effects. It also describes flat two-tone artwork, volume-preserving squash, and effects that shrink or thin rather than relying on opacity fades.

## 5. Component-by-component feature matrix

The table records behavior described by the source component code and its component documentation. It does not imply that the same behavior has already been implemented in the target.

| Component | Reference API and behavior | Current target gap |
|---|---|---|
| **Button** | `variant="secondary"`, `type`, `disabled`; native button semantics; `done()` success check; `impact()`; press squash, inverted impact frame, burst behind the button, crystals, smoke, and ドン! lettering. | Current target offers a basic button with CSS press scaling and generic impact particles. No `done()` or `impact()` public component method, no full impact sequence, and no documented disabled/type-submit parity. |
| **Toggle** | `label`, `checked`, `name`, `value`, `disabled`; `checked` property and `flip()`; switch semantics and `aria-checked`; `change` event; form-associated; 43-frame painted animation at 30 FPS. | Target has a basic CSS switch, checked state, label, form hooks, and a generic particle effect. It does not reproduce the painted 43-frame transition, smear, splash, or settling animation. |
| **Slider** | `value`, `min`, `max`, `step`, `label`, `unit`, `name`, `disabled`; `valueAsNumber`; native range input; `input` while dragging and `change` on release; spring lag, value bubble, speed-driven cloud, shards, and release slash. | Target has a native range input and output. It lacks the spring-driven thumb, bubble, drag-velocity effects, release sequence, documented `name`/form integration, and full public API parity. |
| **Checkbox** | `checked`, `name`, `value`, `disabled`; native checkbox; checked property; `change`; form-associated; animated tick, twin crescents, crystals, glint, and dotted ズザッ lettering. | Target has a native checkbox, checked state, form hooks, and generic burst. The distinctive slash, crystals, glint, and lettering sequence are missing. |
| **Radio** | `label`, `value`, `name`, `disabled`; child `<option>` choices; native radio inputs; arrow-key behavior; form-associated; springing dot, fan wedges, smoke puffs, and hollow ポン. | Target uses comma-separated `options` rather than child options, with a basic radio group and generic effect. It does not currently match the reference option model or complete keyboard and accessibility behavior. |
| **Input** | `label`, `placeholder`, `value`, `type`, `autocomplete`, `name`, `disabled`; value property; native input; `input` and `change`; caret-position dust and occasional chips while typing. | Target offers a native text input and standard text/form behavior. It lacks caret-position effects, spring response, and the reference's exact attribute/event contract. Target supports a `required` attribute, which the reference README says is not fully forwarded. |
| **Tabs** | Child `<option>` choices; `label`, initial `selected` index; `selected` and `value` properties; `change` detail with index/value/label; arrow, Home, and End keyboard navigation; springing raised indicator. | Target uses comma-separated `items` and string `value`. It lacks the selected-index API, Home/End and arrow navigation, spring indicator, and the reference event detail shape. Neither project currently supplies complete external tab-panel management. |
| **Progress** | `label`, 0..1 `value`, `done-label`, optional `demo`; `set()`, `reset()`, `done`; `sakuga:done` event after the animated bar reaches completion; storm cloud, ground, pebbles, rumble, burst, and check. | Target uses a 0..100 value and basic CSS width transition. It lacks the imperative set/reset lifecycle, event, and storm-cloud sequence. |
| **Rating** | `label`, 0..5 `value`, `name`, `disabled`; form-associated; rating radio semantics and arrow keys; sequential star pops, wedges, glint, hollow ポン, and five-star burst. | Target renders five buttons and changes the value, but does not match the radio-group ARIA/keyboard model or the reference's sequential animation and form behavior. |
| **Toast** | `message`, `duration`; `show()`, `hide()`, `open`; dismiss button; live status region; smear entrance, landing dust, dotted ズザッ, wobble, and shrink exit. | Target has a message, show method, timeout, and status region. It lacks the public hide/open API, explicit close button, and the full entrance/exit animation. |
| **Tooltip** | `text`, `label`; slotted trigger; `show()`, `hide()`, `open`; hover, focus, tap, Escape behavior; button trigger and `aria-describedby`; spring bubble, puffs, ring, wedges, and hollow カチッ. | Target shows on hover/focus, but uses a span trigger and lacks the complete button/ARIA relationship, Escape dismissal API, and show/hide/open properties. |

## 6. Target implementation baseline

### Existing application files

| Target path | Current role |
|---|---|
| `index.html` | Main static showcase with all eleven component types |
| `styles.css` | Page layout, component cards, brand palette, responsive rules |
| `core.js` | Shared particle effects and reduced-motion handling |
| `components/*.js` | Eleven custom-element implementations |
| `assets/brand-mark.svg`, `assets/hero-illustration.svg` | Target's original brand and hero artwork |
| `examples/basic.html` | Basic integration example |
| `registry.json` | Target's component inventory |
| `skills/vfx-ui-anime/SKILL.md` | Target-specific agent instructions |
| `llms.txt` | AI-facing project information |
| `tools/validate.mjs` | Static repository/component validation |

### Documentation and governance already present

The target already includes:

- `README.md`, `CHANGELOG.md`, `ROADMAP.md`, `AGENTS.md`, and `CITATION.cff`.
- `docs/COMPONENTS.md`, `ARCHITECTURE.md`, `ACCESSIBILITY.md`, `INSTALLATION.md`, `INTEGRATIONS.md`, `DEVELOPMENT.md`, `TESTING.md`, `DEPLOYMENT.md`, and `RELEASE.md`.
- Architecture SVG and Mermaid diagrams.
- `CONTRIBUTING.md`, `CODE_OF_CONDUCT.md`, `SECURITY.md`, and `SUPPORT.md`.
- GitHub issue and pull-request templates, CODEOWNERS, Dependabot, and GitHub Actions workflows for validation, deployment, CodeQL, and Scorecard.

These are a strong repository-governance baseline. The next implementation phase should improve the component product, not recreate files that already exist.

### Target shared engine comparison

The target's `core.js` is approximately 2.5 KB. It creates one page-level canvas, emits generic particle shapes, runs a requestAnimationFrame loop, supports the reduced-motion preference, and exposes `window.VFXAnime` with `emit()`, `impact()`, and a simple spring-like helper.

The reference's approximately 40.6 KB core has a much larger animation model: numerical spring integration, scheduled callbacks on a shared clock, multiple canvas layers, manual time advancement, a custom-element base class, geometry helpers, numerous named effect primitives, and traced sound-effect lettering.

The architecture choice is not simply "large core is better." The reference duplicates the shared core inside each component file and embeds the toggle's sprite sheet, while the target centralizes the engine. The target's modular architecture can be retained and extended without adopting the source's duplication strategy.

## 7. Supporting tooling and distribution audit

| Capability | Reference | Target |
|---|---|---|
| Component registry | shadcn-compatible `registry.json` with `registry:file` items and CLI installation guidance | Project inventory only; target docs correctly state it is not currently a shadcn registry manifest |
| Agent skill | `skills/sakuga-vfx/SKILL.md`, shared core, starter example, frame-review script | `skills/vfx-ui-anime/SKILL.md` with project-specific integration rules |
| AI discovery | Detailed `llms.txt` with all components, install commands, docs, and skill links | Initial `llms.txt`; should be expanded when APIs and installation paths stabilize |
| Core synchronization | `tools/build.mjs` and `--check`; writes core into every component and embeds toggle frames | No corresponding source synchronization tool; target uses one shared core file |
| Asset pipeline | `tools/trace.py` traces six WebP lettering assets into path definitions | No comparable artwork tracing pipeline |
| Browser interaction tests | `tools/test.mjs`, Chrome DevTools Protocol, touch/key/form/viewport checks | `tools/validate.mjs` only; no browser interaction automation in the current target |
| Screenshot capture | `tools/shot.mjs` | A screenshot helper is documented in the target development area, but a source-equivalent deterministic frame-sheet reviewer is not present |
| Frame inspection | `skills/sakuga-vfx/look.mjs` pauses and steps the shared clock, captures reaction frames into a contact sheet | No equivalent deterministic animation inspection tool |
| Individual component demos | Eleven component-specific demo routes | One central showcase and one basic example |
| Package distribution | shadcn CLI registry files | No published npm package; source-copy instructions documented |

## 8. Quality, accessibility, and testing findings

### Reference test coverage inspected

The reference's `tools/test.mjs` is a real-browser interaction test script, not a file-existence check. Its assertions cover:

- Registration of all eleven elements and the shared core.
- Button activation and the `done()` success state.
- Toggle state and `aria-checked`.
- Slider drag and keyboard stepping.
- Checkbox and radio selection.
- Input typing.
- Tabs selection and arrow navigation.
- Rating value and lit-star count.
- Progress completion and animated `set(0.5)`.
- Toast arrival and automatic departure.
- Tooltip open and Escape dismissal.
- FormData values for form-associated controls.
- No horizontal overflow at a 390px viewport.
- Browser exception logging.

The inspected script requires Node 22+, Chrome or Chromium, and a locally served page. The source README says the project has been checked in headless Chromium with real touch/key events and frame-by-frame sheets, but has not yet been tried in Safari, Firefox, on a real phone, or with a screen reader.

### Target test baseline

The target's `npm test` and `npm run check` both invoke `tools/validate.mjs`. That script checks required file paths, gallery references, component registrations, registry length, and the presence of a reduced-motion hook. It explicitly describes itself as static validation.

This is useful repository validation, but it does not currently demonstrate that the components work through real mouse, touch, keyboard, forms, or screen-reader interactions.

### Accessibility gaps to preserve in the next phase backlog

- Verify form-associated custom elements across browsers, including reset, disabled, name/value submission, and validation behavior.
- Complete radio-group arrow-key and focus behavior.
- Implement tabs roving focus and correctly linked external panels where the API promises them.
- Ensure labels and accessible state announcements are consistent across components.
- Add reliable Escape dismissal and accessible trigger relationships to tooltip.
- Validate focus, zoom, contrast, reduced motion, and keyboard use.
- Verify the global canvas stacking behavior around dialogs, sticky headers, popovers, and other overlays.
- Run manual screen-reader checks before claiming accessibility certification.

## 9. Licensing and reuse constraints

The reference repository contains an MIT license with copyright notice for **Justin Finkelman**. The source README describes its sound-effect artwork and toggle frames as project-generated assets.

MIT is a permissive license, but substantial copies of its source code must retain the required copyright and license notice. The target currently carries its own MIT license under Brajesh Kumar. Therefore:

- Do not copy the reference's complete source files or artwork into the target and leave the target's single-owner license notice unchanged.
- The safest route for the target's current independent-project positioning is to reproduce the behavior with independently written code and newly created or appropriately licensed artwork.
- If a future decision is made to reuse upstream code or assets, first identify the exact reused files and retain all required notices and applicable terms.
- Public visibility of the source repository does not itself waive copyright or asset licensing terms.

This is a technical project audit, not legal advice.

## 10. Prioritized implementation gaps for later phases

The list below is the output of Phase 1. It is a backlog, not permission to begin later phases now.

| Priority | Gap | Reason |
|---|---|---|
| P0 | Define the intended API and interaction contract for all eleven controls | Prevents visual work from masking missing or inconsistent component behavior |
| P0 | Expand the shared engine with spring-based motion, scheduled effects, lifecycle cleanup, and layered drawing | Most reference reactions depend on these shared capabilities |
| P0 | Add real-browser tests for the target | The current static validator cannot verify runtime behavior |
| P1 | Implement the detailed button, toggle, slider, checkbox, and radio reaction sequences | These are core interaction demonstrations |
| P1 | Implement the missing component APIs/events and accessibility semantics | Avoids a visually similar but functionally incompatible library |
| P1 | Implement progress, rating, toast, and tooltip's complete documented behavior | Closes the remaining major control gaps |
| P1 | Create original sound-effect artwork and the toggle animation asset | The reference uses custom artwork, not generic particles |
| P2 | Add a gallery experience with individual component demos, live event feedback, and installation guidance | Makes the product discoverable and testable |
| P2 | Build a project-specific registry and improve `llms.txt` and the agent skill | Makes the finished library easier to adopt and discover |
| P2 | Add deterministic animation frame capture and visual regression comparisons | Gives animation quality a repeatable review process |
| P3 | Complete cross-browser, real-device, and assistive-technology QA | Needed before publishing broad compatibility/accessibility claims |

## 11. Deployment and repository automation status

The target's GitHub Pages workflow has now completed successfully. The latest inspected deployment run is:

- [Deploy to GitHub Pages, run 44233606857](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44233606857)
- Job: `build-and-deploy`
- Result: `success`
- Successful steps included source validation, Pages configuration, static artifact upload, and website deployment.
- Published URL: [https://brajesh31.github.io/vfx-ui-anime/](https://brajesh31.github.io/vfx-ui-anime/)

The earlier deployment failure was superseded by this successful run. The README and deployment guide had stale text saying Pages was still disabled; those statements are corrected alongside this audit.

The inspected Validate, CodeQL, and OSSF Scorecard runs for the same audited commit also completed successfully. A separate Vercel deployment status reported a deployment rate limit; that does not change the successful GitHub Pages workflow result.

## 12. Audit limitations and completion record

### What was inspected

- Both repository trees and repository metadata.
- Reference root README, shared core, gallery, registry, AI index, agent skill, starter example, build/test/screenshot/artwork tooling.
- All eleven reference component implementations, their component READMEs, and dedicated demo pages.
- Target README, root showcase, shared core, all eleven component scripts, package metadata, registry, component API documentation, architecture, accessibility, installation, integration, development, testing, deployment, roadmap, changelog, and agent skill.
- The latest GitHub Pages deployment job and its individual step conclusions.

### What was not executed

- The repositories were not cloned into a local browser-test environment.
- The reference's Chrome/Chromium test runner was inspected but not run.
- Pixel-by-pixel screenshot comparisons were not captured.
- Safari, Firefox, real-device, and screen-reader tests were not performed.
- The binary WebP artwork was inventoried by source tree metadata and documentation, not visually reviewed frame by frame.

As a result, the behavior matrix is based on inspected source code and repository documentation. It is not a claim that every animation has been observed at runtime.

### Phase 1 completion

- [x] Repository metadata and full tree inventories captured.
- [x] Eleven reference component implementations audited.
- [x] Eleven component APIs and behavior families compared.
- [x] Gallery, demos, engine, assets, registry, skill, and tooling inventoried.
- [x] Dependency, license, accessibility, and testing constraints recorded.
- [x] Target gaps prioritized for subsequent work.
- [x] Stale deployment documentation corrected.
- [x] No Phase 2 implementation work started.

**Phase 1 status: COMPLETE.** The next phase remains untouched until separately requested.
