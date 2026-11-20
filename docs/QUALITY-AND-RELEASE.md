# 🧪 Quality status and release gate

**Last updated:** 20 November 2026  
**Repository:** `Brajesh31/vfx-ui-anime`  
**Branch:** `main`  
**Package implementation commit:** `72748136c9eddf1cf160d1d41f92841e59d1f557`  
**Latest documentation commit before this report update:** `f0f11646af0aec8f981663b5cec31c8d1b02bdec`

## Current decision

**The stable `vfx-ui-anime@0.1.0` package is published on npm, and GitHub Release `v0.1.0` is published with the `.tgz` archive attached.** The `latest` npm dist-tag resolves to `0.1.0`. The first-publish workflow completed successfully. Remaining work is npm Trusted Publisher setup/credential cleanup and human QA for accessibility, real-device behavior and cross-browser compatibility.

The 14-stage component roadmap is complete in scope. The regressions found during the integrated audit have been repaired. The successful first-publication run on `eda39329832fe722cfbd4073a5472fd515df2629` passed the structural/source checks, full Chromium component suite and npm tarball/consumer smoke test before publishing the package and creating the GitHub Release. The archive contains 170 files.

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

## 4. npm package and publication status

The browser-only npm package `vfx-ui-anime@0.1.0` is publicly published. It exposes one aggregate entry point and one direct subpath for each of the 82 custom elements. It has no runtime dependencies and does not provide React/Vue wrappers or named component classes.

- [x] Freeze the browser-only API: aggregate import, per-component side-effect subpaths, and exported component metadata.
- [x] Document browser/CDN usage and server-side rendering limitations.
- [x] Define the package entry point, exports map and restricted file allowlist.
- [x] Add a tarball/consumer/Chromium package smoke test.
- [x] Commit the package contract and publication workflows to `main`.
- [x] Publish `vfx-ui-anime@0.1.0` to npm.
- [x] Verify the npm version endpoint resolves and the `latest` dist-tag points to `0.1.0`.
- [x] Publish GitHub Release `v0.1.0` and attach `vfx-ui-anime-0.1.0.tgz`.
- [ ] Complete and record manual QA above.
- [ ] Create and verify npm Trusted Publisher for GitHub Actions, owner/user `Brajesh31`, repository `vfx-ui-anime`, workflow filename `publish.yml`, with no environment name.
- [ ] After OIDC setup is verified, delete the repository `NPM_TOKEN` secret and revoke the temporary npm granular token.
- [ ] Retire the one-time bootstrap workflow after credential cleanup.
- [ ] Use the next legitimate package release to verify OIDC staging, provenance and 2FA approval.
- [ ] Correct the stale pre-publication status sentence in the npm-hosted README in the next legitimate version. The GitHub README has been corrected on `main`.

The published npm `0.1.0` page is live, but its README was packed before the first publication completed and still contains stale pre-publication wording. This does not change the package tarball's installability or entry points.

## 5. Release decision

**Stable package release: published. GitHub release notes and repository documentation: corrected. Production quality sign-off: still open.** Do not describe the package as fully production-certified until the manual visual, keyboard, screen-reader, reduced-motion, real-device touch, contrast/focus and Firefox/Safari checks have been completed and recorded.

