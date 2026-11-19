# 🚦 Release checklist

Use this as the final go/no-go checklist for a release candidate. A checked source audit item is not a substitute for an executed test or human sign-off.

## Source and repository structure

- [x] Inventory contains 82 component folders.
- [x] Build and validator lists cover the same 82 component names.
- [x] Each component folder includes source, standalone demo and API README.
- [x] Registry contains 82 component entries.
- [x] Gallery contains 83 unique demo IDs and coverage for all 82 component tags.
- [x] Generated shared-runtime copies are checked against `core.js`.
- [x] Structural checks passed on the latest audited commit before this documentation pass.

## Automated checks

- [x] `npm test` passed on commit `0169832aa1efbe657ab951b7e00f8edc44ef5bdc`.
- [x] `npm run check` passed on commit `0169832aa1efbe657ab951b7e00f8edc44ef5bdc`.
- [x] GitHub Pages deployment passed on commit `4dee151d4e26ed15047c1951071c3fbd8c86acee`.
- [x] OpenSSF Scorecard passed on commit `4dee151d4e26ed15047c1951071c3fbd8c86acee`.
- [ ] Chromium browser suite passes on the final release-candidate SHA.
- [ ] CodeQL passes on the final release-candidate SHA.
- [ ] GitHub Pages deployment passes on the final release-candidate SHA.
- [ ] OpenSSF Scorecard passes on the final release-candidate SHA.

The latest corrected browser workflow failed. See [QUALITY-AND-RELEASE.md](../QUALITY-AND-RELEASE.md) for run links, logs, and component-level findings.

## Human QA

- [ ] Visual review at 390 px, 768 px and desktop widths.
- [ ] Keyboard-only review of controls, menus, dialogs, editors, cards and overlays.
- [ ] Screen-reader review of names, roles, values, status announcements, focus management and dynamic content.
- [ ] Reduced-motion review at initial load and when the preference changes during runtime.
- [ ] Touch/coarse-pointer review.
- [ ] Cross-browser review in Chromium, Firefox and Safari.
- [ ] Browser console review for uncaught exceptions and failed asset requests.

## Package and release

- [ ] Final public API and package consumption model documented.
- [ ] Public package entry points and published file allowlist established.
- [ ] `npm pack --dry-run` inspected.
- [ ] Clean consumer project install and usage tested.
- [ ] Changelog and release notes prepared.
- [ ] Version and tag selected after API freeze.
- [ ] `private: true` removed only after explicit release approval.
- [ ] GitHub Release and npm publication performed only after all gates pass.

## Current decision

**Not approved for release.** Structural validation passed, but the latest full Chromium browser suite failed in several Phase 11–13 component scenarios. Manual visual and accessibility sign-off is also outstanding.
