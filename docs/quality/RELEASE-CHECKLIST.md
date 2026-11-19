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

## Automated verification on merged `main`

Verified on current `main` head `${head}`:

- [x] `npm test` passes. [Validate run 44627994671](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44627994671)
- [x] `npm run check` passes. [Validate run 44627994671](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44627994671)
- [x] Full Chromium touch, keyboard, form, lifecycle and 390 px overflow checks pass. [Validate run 44627994671](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44627994671)
- [x] CodeQL passes. [CodeQL run 44627994531](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44627994531)
- [x] GitHub Pages deployment succeeds. [Pages run 44627994707](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44627994707)
- [x] OpenSSF Scorecard succeeds. [Scorecard run 44627994720](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44627994720)

The Validate browser log for current `main` records 210 successful checks, zero failures and zero page-side exception lines, including Color Palette roving focus/Enter/Space and Audio Player metadata/seek coverage.

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

- [ ] Public API and supported browser-script/CDN consumption model documented.
- [ ] Package entry points/exports contract finalized.
- [ ] Package published-file allowlist reviewed.
- [ ] `npm pack --dry-run` output inspected.
- [ ] Clean consumer project installation and usage tested.
- [ ] Changelog and release notes prepared.
- [ ] Resolve or explicitly retire the two Vercel status failures caused by the Hobby build-rate limit if Vercel is still intended to be a deployment target.
- [ ] Version and tag selected after API/package freeze.
- [ ] `private: true` removed only after explicit release approval.
- [ ] GitHub Release and npm publication performed only after all gates pass.

## Current decision

**GitHub Actions implementation/integration checks passed on current `main`. Final release approval is pending human QA, Vercel status resolution/retirement and package-consumer validation. No versioned GitHub Release or npm package exists yet.**
