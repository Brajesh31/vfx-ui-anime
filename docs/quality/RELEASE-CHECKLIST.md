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

## Automated verification on the latest implementation commit

Verified on implementation commit `0197589d1186ae2d8dc6dd366cbe3f6ab09cdf18`:

- [x] `npm test` passes. [Validate run 44627994671](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44627994671)
- [x] `npm run check` passes. [Validate run 44627994671](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44627994671)
- [x] Full Chromium touch, keyboard, form, lifecycle and 390 px overflow checks pass. [Validate run 44627994671](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44627994671)
- [x] CodeQL passes. [CodeQL run 44627994531](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44627994531)
- [x] GitHub Pages deployment succeeds. [Pages run 44627994707](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44627994707)
- [x] OpenSSF Scorecard succeeds. [Scorecard run 44627994720](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44627994720)

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
- [x] OIDC npm publish workflow is configured with provenance and stable-tag checks.
- [ ] `npm run test:package` passes on the package branch and `main`.
- [ ] Bootstrap the initial npm publish with the [Bootstrap first npm publication](https://github.com/Brajesh31/vfx-ui-anime/actions/workflows/bootstrap-publish.yml) workflow and protected `NPM_TOKEN` repository Actions secret.
- [ ] Configure npm Trusted Publisher for `Brajesh31/vfx-ui-anime`, workflow `publish.yml`, after the initial package exists, then remove the bootstrap token/workflow.
- [ ] Publish stable npm `v0.1.0` from a reviewed `v0.1.0` tag and verify registry installation.
- [x] Publish source-only GitHub pre-release `v0.1.0-rc.1` after source, structure and Chromium checks pass on the release commit. See [the release workflow](https://github.com/Brajesh31/vfx-ui-anime/actions/workflows/release.yml).
- [ ] Public API and supported browser-script/CDN consumption model documented.
- [ ] Package entry points/exports contract finalized.
- [ ] Package published-file allowlist reviewed.
- [ ] `npm pack --dry-run` output inspected.
- [ ] Clean consumer project installation and usage tested.
- [ ] Changelog and release notes prepared.
- [ ] Version and tag selected after API/package freeze.
- [ ] `private: true` removed only after explicit release approval.
- [ ] GitHub Release and npm publication performed only after all gates pass.

## Current decision

**Source-only GitHub pre-release `v0.1.0-rc.1` is available. The npm package contract and publishing workflows are prepared. Stable npm publication remains pending package smoke-test success and npm authorization. Manual cross-browser and assistive-technology QA is still outstanding.**
