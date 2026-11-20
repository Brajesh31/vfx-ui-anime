# 🚦 Release checklist

Use this as the final go/no-go checklist. A checked source audit item is not a substitute for executed tests or human sign-off.

## Source and repository structure

- [x] Inventory contains 82 component folders.
- [x] Build and validator lists cover the same 82 component names.
- [x] Each component folder includes source, standalone demo and API README.
- [x] Registry contains 82 component entries.
- [x] Gallery contains 83 unique demo IDs and coverage for all 82 component tags.
- [x] Generated shared-runtime copies are checked against `core.js`.
- [x] Required GitHub Actions workflow definitions are present.
- [x] GitHub Pages uses separate build/upload and dependent deploy jobs, allowing deploy retries without re-uploading the artifact.
- [x] All 15 phase-specific reports have been consolidated into the project reference and removed.

## Automated verification on the latest package merge commit

Verified on package merge commit `5a5a6dbbf6290cb0427f5bae5e75df2cbcaee323`:

- [x] `npm test` passes. [Validate run 44642047028](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642047028)
- [x] `npm run check` passes. [Validate run 44642047028](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642047028)
- [x] Full Chromium touch, keyboard, form, lifecycle and 390 px overflow checks pass. [Validate run 44642047028](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642047028)
- [x] CodeQL passes. [CodeQL run 44642048581](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642048581)
- [x] GitHub Pages deployment succeeds. [Pages run 44642046915](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642046915)
- [x] OpenSSF Scorecard succeeds. [Scorecard run 44642046769](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642046769)

The Validate browser log for the verified implementation commit records 210 successful checks, zero failures and zero page-side exception lines, including Color Palette roving focus/Enter/Space and Audio Player metadata/seek coverage.

## Human QA

- [ ] Visual review at 390 px, 768 px and desktop widths.
- [ ] Keyboard-only review of controls, menus, dialogs, editors, cards and overlays.
- [ ] Screen-reader review of names, roles, values, status announcements, focus management and dynamic content.
- [ ] Reduced-motion review at initial load and when the preference changes during runtime.
- [ ] Touch/coarse-pointer review on a real device.
- [ ] Cross-browser review in Chromium, Firefox and Safari.
- [ ] Browser console review for uncaught exceptions and failed asset requests.
- [ ] Contrast and focus-visible review for relevant interactive states.

## Package and release

- [x] Browser-only aggregate entry point registers all 82 elements.
- [x] Per-component subpath exports are defined for all 82 elements.
- [x] Package file allowlist includes component scripts and API READMEs.
- [x] `npm pack --dry-run` contents inspected, with no gallery or development tooling in the tarball.
- [x] Tarball installed offline in a clean consumer project.
- [x] All 82 component subpaths resolve and aggregate/single-component imports pass in Chromium.
- [x] Package smoke test passes in the main Validate run. [Run 44642047028](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44642047028)
- [x] OIDC npm publish workflow is configured with provenance and stable-tag checks.
- [x] One-time initial-publish workflow includes a protected token mapping and refuses to overwrite an existing npm package name.
- [ ] Bootstrap the initial npm publish with the [Bootstrap first npm publication](https://github.com/Brajesh31/vfx-ui-anime/actions/workflows/bootstrap-publish.yml) workflow and protected `NPM_TOKEN` repository Actions secret.
- [ ] Configure npm Trusted Publisher for `Brajesh31/vfx-ui-anime`, workflow `publish.yml`, after the initial package exists, then remove the bootstrap token/workflow.
- [ ] Publish stable npm `v0.1.0` from a reviewed `v0.1.0` tag and verify registry installation.
- [x] Publish source-only GitHub pre-release `v0.1.0-rc.1` after source, structure and Chromium checks pass on the release commit. See [the release workflow](https://github.com/Brajesh31/vfx-ui-anime/actions/workflows/release.yml).
- [x] Public browser-only API and browser/CDN consumption model documented.
- [x] Package entry points/exports contract finalized.
- [x] Package published-file allowlist reviewed.
- [x] `npm pack --dry-run` output inspected.
- [x] Clean consumer project installation and usage tested.
- [x] Changelog, package guide, and source release notes prepared.
- [x] Version `0.1.0` selected in the package manifest.
- [x] `private: true` removed from the package manifest.
- [ ] Add npm granular publish token as GitHub Actions secret `NPM_TOKEN` and run the bootstrap workflow.
- [ ] Configure npm Trusted Publisher for `Brajesh31/vfx-ui-anime`, workflow `publish.yml`, after the first package exists; then remove the bootstrap token and workflow.
- [ ] Verify public registry install of `vfx-ui-anime@0.1.0`.

## Current decision

**Source-only GitHub pre-release `v0.1.0-rc.1` is available. Package `0.1.0` and consumer tests are ready and pass on `main`. The npm registry publication remains pending a protected npm token and one manual workflow run. Manual real-device, screen-reader and cross-browser QA is still outstanding.**
