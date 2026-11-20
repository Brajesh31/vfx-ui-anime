# 🧪 Quality status and release gate

**Last verified:** 20 November 2026  
**Repository:** `Brajesh31/vfx-ui-anime`  
**Branch:** `main`  
**Verified implementation commit:** `5a5a6dbbf6290cb0427f5bae5e75df2cbcaee323`

## Current decision

**npm package `0.1.0` is packaged and passes the clean-consumer test on `main`. Public npm publication is prepared but awaiting the first npm account authorization. The source-only GitHub pre-release `v0.1.0-rc.1` remains available.**

The 14-stage implementation roadmap is complete in scope. The component regressions discovered during the integrated audit have been repaired, and the complete source, browser, security, deployment and Scorecard workflows have passed on the merged `main` commit.

The remaining release work is human QA and package-consumer validation. Passing automated tests does not certify human screen-reader, cross-browser or visual review.

## 1. Post-merge verification on `main`

All four required GitHub Actions workflows passed on package merge commit `5a5a6dbbf6290cb0427f5bae5e75df2cbcaee323`.

| Check | Result | Evidence |
|---|---|---|
| `npm test` | Passed | [Validate run 44642047028](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642047028) |
| `npm run check` | Passed | [Validate run 44642047028](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642047028) |
| Full Chromium touch, keyboard and form interaction suite | Passed | [Validate run 44642047028](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642047028) |
| CodeQL | Passed | [CodeQL run 44642048581](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642048581) |
| GitHub Pages deployment | Passed | [Pages run 44642046915](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642046915) |
| OpenSSF Scorecard | Passed | [Scorecard run 44642046769](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642046769) |

The Validate run on package merge commit `5a5a6dbbf6290cb0427f5bae5e75df2cbcaee323` contains **210 successful checks, zero failures and zero page-side exceptions**. It confirms all 82 custom elements are registered, the shared runtime is present, all component regression groups pass, and the 390 px horizontal-overflow guard passes. The package stage also inspects the npm tarball, confirms all 82 component scripts and API READMEs are present without gallery/development tooling, installs the tarball offline into a clean consumer, resolves every component subpath, and verifies aggregate plus single-component imports in Chromium.


The Chromium harness now allows up to 45 seconds for browser startup, selects a wider random debugging-port range, disables shared-memory pressure, and reports a specific launch/exit/timeout reason if DevTools does not become available. The assertions themselves were not weakened or skipped.

## 2. Component defects corrected

| Area | Root cause | Resolution |
|---|---|---|
| Color Palette | The collection query was mixed up with the single-element query; the initial roving-focus implementation also failed to advance `tabindex` and rebuilt the swatch DOM on every value change, losing focus. | Uses stable query collections, updates selection and `aria-pressed` in place, preserves the focused swatch through selection/list updates, maintains exactly one roving Tab stop, and explicitly handles Enter/Space without duplicate activation. Arrow, Home, End, Enter, Space, selection events and dynamic value/list replacement pass. |
| Markdown Editor | Tab synchronization called `forEach` on the single-element query helper. | Uses a collection query; tab state, input/change events and keyboard navigation pass. |
| Marquee | The internal slot element was assigned to the native `HTMLElement.slot` string property. | Stores the slot reference as `_slotElement`; slot listeners and reconnect behavior work. A MutationObserver synchronizes nested light-DOM changes into the inert duplicate track and is cleaned up on disconnect. |
| Scroll Reveal | The internal slot element collided with the native `HTMLElement.slot` property. | Stores the reference as `_slotElement`; dynamic child observation, reveal/conceal behavior and observer reconnect pass. |
| 3D Flip Card | Enter activation was not reliable in the touch-emulated browser test. | Explicit Enter/Space handling prevents native default activation and toggles exactly once. Both keyboard paths and state/event synchronization pass. |
| Animated Counter | The test removed the element and then tried to query the disconnected node from the document, so it never reconnected it. | The test retains the element reference and now genuinely tests detach finalization, reconnect, reduced motion, same-value refresh, locale formatting and completion events. No component behavior patch was needed for this test defect. |
| Confetti Button | Enter activation was not reliable in the touch-emulated browser test. | Explicit Enter/Space handling prevents duplicate activation; celebration events and reduced-motion behavior pass. |
| Audio Player regression | The browser test assumed a fixed 500 ms was enough for local WAV metadata to load, which was not deterministic under runner load. | The test now waits up to three seconds for actual metadata and duration before seeking, and reports media ready state, network state, error code and event sequence on failure. This changes test timing and diagnostics, not playback behavior. |

The browser test harness was hardened to throw on page-side `Runtime.evaluate` exceptions instead of silently converting exceptions to `undefined`. Color Palette regression coverage now verifies exact event counts, focus retention, roving `tabindex`, Enter/Space activation and dynamic list replacement. The Image Cropper test cleanup is idempotent, and the CDP keyboard helper sends the correct DOM code for Space. Chromium startup now has a longer bounded wait and actionable failure diagnostics.

The GitHub Pages workflow now separates source validation/artifact upload into a `build` job and runs `deploy-pages` in a dependent `deploy` job. Retrying deployment no longer repeats the artifact upload, and an in-progress deployment is not cancelled by a new push. The latest Pages run passes with this layout.

## 3. What the automated pass establishes

The current integrated workflow exercises:

- Registration of all 82 custom elements and presence of the shared runtime.
- Original signature control interactions, touch input, keyboard operations and form integration.
- Form reset and fieldset-disabled behavior.
- Dynamic attribute/property synchronization, empty/invalid states and selection.
- Editors, media lifecycle, drawing, charts, workflow components and overlays.
- Reduced-motion and disconnect/reconnect scenarios covered by the browser suite.
- The repaired Phase 11–13 regression groups.
- A 390 px horizontal-overflow guard.
- Source syntax, generated runtime parity, component structure, registry and gallery checks.

This is strong automated evidence, but it is not a substitute for human testing across browsers and assistive technologies.

## 4. Manual sign-off still outstanding

Complete and record the following before declaring a public release production-approved:

- [ ] Visual review at 390 px, 768 px and desktop widths.
- [ ] Keyboard-only review in a real desktop browser, including focus entry, movement, dismissal and restoration.
- [ ] Screen-reader review of names, roles, values, status announcements, dialogs, tabs/panels and dynamic content.
- [ ] Reduced-motion review before page load and after changing the preference at runtime.
- [ ] Touch/coarse-pointer review of drag, swipe, crop and scroll interactions on a real device.
- [ ] Contrast and focus-indicator review across relevant component states and supported themes.
- [ ] Browser console review during manual interaction.
- [ ] Cross-browser spot checks in current Chromium, Firefox and Safari.

Use [ACCESSIBILITY.md](ACCESSIBILITY.md) for the review matrix. Automated DOM assertions do not certify assistive-technology behavior or complete WCAG conformance.

## 5. npm package contract and publication

The repository is MIT-licensed and contains Code of Conduct, Contributing, Security, Support, Citation and project documentation. The existing license remains attributed to Brajesh Kumar.

The package now has an aggregate browser entry point (`index.js`), a direct import subpath for each of the 82 elements, a restricted tarball file allowlist, and a clean-consumer smoke-test runner. Component implementation scripts are unchanged. Before publication:

- [x] Freeze the browser-only API: an aggregate import, per-component side-effect subpaths, and exported component name/tag metadata.
- [x] Document browser/CDN usage and the server-side rendering limitation.
- [x] Define the package entry point, exports map, and file allowlist.
- [x] Pass `npm run test:package` on `main`. [Validate run 44642047028](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642047028).
- [ ] Complete all manual QA items above.
- [x] Prepare the `0.1.0` package version, changelog, release notes, and package guide.
- [x] Remove `"private": true` and set package version `0.1.0` on the package branch.
- [x] Add a version-tagged npm publishing workflow using GitHub OIDC and provenance.
- [ ] Bootstrap the first npm publication with the [Bootstrap first npm publication](https://github.com/Brajesh31/vfx-ui-anime/actions/workflows/bootstrap-publish.yml) workflow and a protected npm granular token stored as the repository Actions secret `NPM_TOKEN` (do not commit or paste the token into chat).
- [ ] After the first package exists, configure npm Trusted Publisher for `Brajesh31/vfx-ui-anime` and workflow `publish.yml`, then remove the bootstrap token and one-time bootstrap workflow.
- [ ] Create stable tag `v0.1.0` only after package smoke tests and the npm publisher configuration are verified.

The GitHub Pages gallery is deployed, and the source-only GitHub pre-release is [v0.1.0-rc.1](https://github.com/Brajesh31/vfx-ui-anime/releases/tag/v0.1.0-rc.1). The npm package `0.1.0` is prepared and its tarball/consumer/browser smoke tests pass on `main`. It is **not yet published to npm**. The bootstrap workflow will refuse to publish if `vfx-ui-anime` is already claimed, and it requires an authorized npm granular token stored as the GitHub Actions secret `NPM_TOKEN`. After first publication, configure npm Trusted Publisher for `publish.yml`, remove the token, and use OIDC/provenance for future tags.

## 6. Release decision

**The package contract and tarball/consumer verification are complete on `main`. The public npm release is blocked only by npm account authorization and the one-time bootstrap action. Real-device, assistive-technology, Firefox/Safari and visual QA remain unperformed, so full WCAG or cross-browser certification is not claimed.**

The component regressions are fixed and the complete integrated Chromium suite passed on the verified implementation commit. Do not describe the npm package as published or final-release-approved until the remaining checks above are completed.
