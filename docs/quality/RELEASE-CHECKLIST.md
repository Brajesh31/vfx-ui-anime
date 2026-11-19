# 🚦 Release checklist

Use this as the final go/no-go checklist. A source audit item or a green workflow from an earlier commit is not a substitute for evidence on the release candidate.

## Source and repository structure

- [x] Inventory contains 82 component folders.
- [x] Build and validator lists cover the same 82 component names.
- [x] Each component folder includes source, standalone demo and API README.
- [x] Registry contains 82 component entries.
- [x] Gallery contains 83 unique demo IDs and coverage for all 82 component tags.
- [x] Generated shared-runtime copies are checked against `core.js`.
- [x] Required GitHub Actions workflow definitions are present.

## Automated candidate checks

Verified on candidate commit `dd4be3b0f716172aa0a3a48157c83cd1d91ae380`:

- [x] `npm test` passes.
- [x] `npm run check` passes.
- [x] Full Chromium browser suite passes, including touch, keyboard, form, lifecycle and 390 px overflow checks. [Validate run 44618353514](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44618353514)
- [x] CodeQL passes. [CodeQL run 44618353959](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44618353959)

Post-merge checks that must be verified on the exact resulting `main` commit:

- [ ] Validate workflow remains green on `main`.
- [ ] CodeQL remains green on `main`.
- [ ] GitHub Pages deployment succeeds on `main`.
- [ ] OpenSSF Scorecard succeeds on `main`.

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
- [ ] Version and tag selected after API/package freeze.
- [ ] `private: true` removed only after explicit release approval.
- [ ] GitHub Release and npm publication performed only after all gates pass.

## Current decision

**Automated candidate checks passed. Final release approval is pending human accessibility/visual QA, post-merge workflow confirmation and package-consumer validation.**
