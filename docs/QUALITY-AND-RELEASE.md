# 🧪 Quality status and release gate

**Last updated:** 20 November 2026  
**Repository:** `Brajesh31/vfx-ui-anime`  
**Branch:** `main`  
**Package implementation commit:** `72748136c9eddf1cf160d1d41f92841e59d1f557`  
**Latest fully verified main commit:** `87475f1acba1aa4734199b1de323d4866c4e2b5f`

## Current decision

**The stable `vfx-ui-anime@0.1.0` package is published on npm, and GitHub Release `v0.1.0` is published with the `.tgz` archive attached.** The `latest` npm dist-tag resolves to `0.1.0`. The first-publish workflow completed successfully and its one-time bootstrap workflow has been removed. The scoped GitHub Packages version `@brajesh31/vfx-ui-anime@0.1.0` is also published. All nine non-main branches have been deleted and GitHub now reports only `main`. Remaining work is reviewing GitHub Packages visibility, verifying npm Trusted Publisher account configuration, removing the obsolete `NPM_TOKEN` secret and revoking its granular token, plus human QA for accessibility, real-device behavior and cross-browser compatibility.

The 14-stage component roadmap is complete in scope. The regressions found during the integrated audit have been repaired. The successful first-publication run on `eda39329832fe722cfbd4073a5472fd515df2629` passed the structural/source checks, full Chromium component suite and npm tarball/consumer smoke test before publishing the package and creating the GitHub Release. The archive contains 170 files.

Automated success does not certify visual quality, screen-reader behavior, real-device touch behavior or full WCAG conformance.

## 1. Post-update automated verification

The first stable release candidate commit `72748136c9eddf1cf160d1d41f92841e59d1f557` passed:

- [Validate on the release branch](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44646096871)
- [CodeQL on the release branch](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44646096770)

The latest fully verified `main` commit is `87475f1acba1aa4734199b1de323d4866c4e2b5f`. All five main-branch checks completed successfully on that exact commit:

- [Validate](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44683131903): passed source/structure checks, the full Chromium interaction suite, npm tarball/consumer smoke tests, and distribution archive upload.
- [CodeQL](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44683131836): passed.
- [OpenSSF Scorecard](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44683131863): passed.
- [GitHub Pages deployment](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44683131822): build and deployment passed.
- [Post-CodeQL alert inventory](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44683282248): completed after CodeQL and uploaded `open-alerts.json` containing exactly `[]` (zero open code-scanning alerts).

The inventory workflow is triggered by a completed successful CodeQL run, not by a push, so it does not sample the alert list before analysis finishes. The inventory artifact ID is `14605600685` and its JSON contents were downloaded and checked.

The validation suite covers source structure, generated runtime parity, registry/gallery consistency, all 82 component registrations, browser interaction/regression groups, keyboard/touch-emulated/form/lifecycle behavior and the 390 px overflow guard. The package test inspects the npm tarball, installs the archive offline in a clean consumer, resolves all 82 subpaths, and checks aggregate plus isolated component imports in Chromium.

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
- [ ] Delete the no-longer-needed repository `NPM_TOKEN` secret and revoke the temporary npm granular token. The bootstrap workflow has already been removed.

- [ ] Use the next legitimate package release to verify OIDC staging, provenance and 2FA approval.
- [ ] Correct the stale pre-publication status sentence in the npm-hosted README in the next legitimate version. The GitHub README has been corrected on `main`.

The published npm `0.1.0` page is live, but the README snapshot embedded in the tarball was packed before the first publication completed and still contains stale pre-publication wording. This does not change the package tarball's installability or entry points. The GitHub README is current; refresh the npm-hosted README with the next legitimate package version.

### Additional GitHub Packages distribution

The scoped GitHub Packages package `@brajesh31/vfx-ui-anime@0.1.0` has now been published successfully.

- [x] Add repository `.npmrc` scope mapping for `@brajesh31` and environment-based `NODE_AUTH_TOKEN` authentication.
- [x] Add `publish-github-package.yml` with `packages: write` and repository-scoped `GITHUB_TOKEN`.
- [x] Verify and document the scoped package build, repository association and install instructions.
- [x] Publish `@brajesh31/vfx-ui-anime@0.1.0` using [workflow run 44682012502](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44682012502). The complete validation, Chromium, package smoke-test and publication job succeeded.
- [ ] Review package settings and set visibility to Public if public GitHub Packages access is intended.
- [ ] Verify public/private installation behavior according to the selected visibility.

The publishing job reported `@brajesh31/vfx-ui-anime@0.1.0` and `npm publish` completed successfully. GitHub's first-publish default visibility is Private, so publication is complete but public visibility still requires a package-settings decision. The existing unscoped npmjs package is unchanged.

### Repository branch cleanup

- [x] Confirm `main` is the repository default branch.
- [x] Delete all nine non-main branches on 20 November 2026.
- [x] Verify GitHub branch API returns exactly one branch: `main`.
- [x] Remove the temporary one-time branch cleanup workflow after successful verification.

## 5. Release decision

**Stable package release: published. GitHub release notes and repository documentation: corrected. Production quality sign-off: still open.** Do not describe the package as fully production-certified until the manual visual, keyboard, screen-reader, reduced-motion, real-device touch, contrast/focus and Firefox/Safari checks have been completed and recorded.

