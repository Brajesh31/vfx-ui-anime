# 🧪 Quality status and release gate

**Last updated:** 20 November 2026  
**Repository:** `Brajesh31/vfx-ui-anime`  
**Branch:** `main`  
**Package implementation commit:** `72748136c9eddf1cf160d1d41f92841e59d1f557`  
**Latest documentation commit before this report update:** `f0f11646af0aec8f981663b5cec31c8d1b02bdec`

## Current decision

**The v0.1.0 npm package contract and automated package smoke tests are committed to `main`. The stable npm publication and stable GitHub Release are not complete.** The first npm publication requires an authorized maintainer-created npm credential stored as the protected repository Actions secret `NPM_TOKEN` and a manual workflow dispatch. In addition, real-device, assistive-technology and cross-browser QA remain outstanding.

The 14-stage component roadmap is complete in scope. The regressions found during the integrated audit have been repaired. The full Chromium suite and npm tarball/consumer checks passed on the release work branch before that commit was fast-forwarded to `main`. Main-branch CI has been triggered again on the current commit; use the live [Actions runs](https://github.com/Brajesh31/vfx-ui-anime/actions) for their final conclusion.

Automated success does not certify visual quality, screen-reader behavior, real-device touch behavior or full WCAG conformance.

## 1. Post-update automated verification

The exact release candidate commit `72748136c9eddf1cf160d1d41f92841e59d1f557` passed:

- [Validate on the release branch](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44646096871)
- [CodeQL on the release branch](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44646096770)

The same commit was fast-forwarded to `main`. New main-branch runs were started for Validate, CodeQL, OpenSSF Scorecard and GitHub Pages deployment. Their live status is available in [GitHub Actions](https://github.com/Brajesh31/vfx-ui-anime/actions).

The existing validation suite covers source structure, generated runtime parity, registry/gallery consistency, all 82 component registrations, browser interaction/regression groups, keyboard/touch-emulated/form/lifecycle behavior and the 390 px overflow guard. The package test inspects the npm tarball, installs the archive offline in a clean consumer, resolves all 82 subpaths, and checks aggregate plus isolated component imports in Chromium.

## 2. Component regressions corrected

| Area | Root cause | Resolution |
|---|---|---|
| Color Palette | Collection query mixed with single-element query; roving focus and re-render caused focus loss. | Stable collection queries, in-place selection state, preserved focus, one roving Tab stop and correct keyboard activation. |
| Markdown Editor | Tab synchronization called `forEach` on a single-element query helper. | Uses collection query; tab state, input/change events and keyboard navigation pass. |
| Marquee | Internal slot reference collided with native `HTMLElement.slot`. | Uses `_slotElement`; nested light-DOM observation and reconnect cleanup. |
| Scroll Reveal | Internal slot reference collided with native `HTMLElement.slot`. | Uses `_slotElement`; dynamic child observation and reconnect behavior. |
| 3D Flip Card | Enter activation was unreliable in touch-emulated browser tests. | Explicit Enter/Space handling without duplicate activation. |
| Animated Counter | Test queried a disconnected node from the document instead of reconnecting the retained element. | Corrected detach/reconnect test setup; no component behavior patch required. |
| Confetti Button | Enter activation was unreliable in touch-emulated browser tests. | Explicit Enter/Space handling without duplicate activation. |
| Audio Player regression | Fixed metadata wait was timing-sensitive under runner load. | Bounded event-based metadata wait and improved diagnostics; playback behavior unchanged. |

The browser harness now fails on uncaught page-side runtime exceptions. Chromium startup diagnostics were strengthened without weakening assertions.

## 3. Manual QA still required

Complete and record these checks before describing the package as production-certified:

- [ ] Visual review at 390 px, 768 px and desktop widths.
- [ ] Keyboard-only review in a real desktop browser, including focus entry, movement, dismissal and restoration.
- [ ] Screen-reader review of names, roles, values, announcements, dialogs, tabs/panels and dynamic content.
- [ ] Reduced-motion review before page load and after changing the preference at runtime.
- [ ] Real-device touch/coarse-pointer review of drag, swipe, crop and scroll interactions.
- [ ] Contrast and focus-indicator review across component states and themes.
- [ ] Browser console review during manual interaction.
- [ ] Cross-browser spot checks in current Chromium, Firefox and Safari.

Use [ACCESSIBILITY.md](ACCESSIBILITY.md) for the detailed review matrix. Automated DOM assertions are not a substitute for assistive-technology testing.

## 4. npm package contract and publication

The browser-only npm package is `vfx-ui-anime@0.1.0`. It exposes one aggregate entry point and one direct subpath for each of the 82 custom elements. It has no runtime dependencies and does not provide React/Vue wrappers or named component classes.

- [x] Freeze the browser-only API: aggregate import, per-component side-effect subpaths, and exported component metadata.
- [x] Document browser/CDN usage and server-side rendering limitations.
- [x] Define the package entry point, exports map and restricted file allowlist.
- [x] Add a tarball/consumer/Chromium package smoke test.
- [x] Commit the package contract and publication workflows to `main`.
- [ ] Complete manual QA above.
- [ ] Create an npm granular publish token with minimum viable scope and expiry; store it only as the protected GitHub Actions secret `NPM_TOKEN`.
- [ ] Run [Bootstrap first npm publication](https://github.com/Brajesh31/vfx-ui-anime/actions/workflows/bootstrap-publish.yml) on `main`, selecting `0.1.0`. The workflow reruns package tests and refuses to overwrite an existing package.
- [ ] Verify `vfx-ui-anime@0.1.0` is installable from npm.
- [ ] Configure npm Trusted Publisher for owner `Brajesh31`, repository `vfx-ui-anime`, workflow `publish.yml`; then revoke/delete the bootstrap token and retire the one-time bootstrap workflow.
- [ ] Confirm npm provenance for subsequent OIDC staged publishes. A maintainer must review each staged package and approve it with 2FA.
- [ ] Verify the stable GitHub Release and its actual npm `.tgz` asset after the first publication succeeds.

Do not put `NPM_TOKEN` in Git, workflow YAML, issues, logs or chat. The first-publish token requires broad access because the npm package does not exist yet and therefore cannot be scoped to that package; use the shortest expiry offered, keep it protected, and revoke it immediately after first publication.

## 5. Release decision

**Repository package preparation: complete. Stable public release: blocked by maintainer-controlled npm authorization and manual QA.**

The source-only GitHub pre-release [v0.1.0-rc.1](https://github.com/Brajesh31/vfx-ui-anime/releases/tag/v0.1.0-rc.1) remains available. The gallery is deployed through [GitHub Pages](https://brajesh31.github.io/vfx-ui-anime/). Do not claim that npm `0.1.0` has been published or that manual accessibility/cross-browser certification is complete until the unchecked items above have actually been performed.
