# 🚦 VFX UI Anime Release Checklist

Use this checklist before approving a public release or declaring the repository production-ready. A checked structural item means the current repository contents were audited; it does not replace a successful command run or human QA session.

## ✅ Source and repository integrity

- [x] Repository inventory contains exactly 82 component folders.
- [x] `tools/build.mjs` and `tools/validate.mjs` list the same 82 component names in the same order.
- [x] All 82 component JavaScript files pass a static syntax parse.
- [x] All 82 component files embed the exact current `core.js` content between the build markers.
- [x] The toggle's embedded WebP data URI matches `components/toggle/frames.webp`.
- [x] Each component has an `index.js`, `demo.html`, and `README.md`.
- [x] All 82 standalone demos load their own component script.
- [x] All inline JavaScript blocks in the 82 demos pass a static syntax parse.
- [x] All 82 component READMEs have a heading and non-empty usage/documentation content.
- [x] Registry contains 82 unique names, each mapped to its exact component source and README reference.
- [x] Gallery contains 83 unique demo IDs and covers all 82 component tags. Multiple gallery examples for the same component are allowed.
- [x] Corrected the duplicate gallery ID on the Secondary button example to `button-secondary`.
- [x] Required GitHub Actions workflow files exist and their configuration contains the expected push-to-main triggers.

## 🧪 Required automated execution evidence

These checks are configured in the repository workflows, but they must be observed passing on the release candidate commit before release approval.

- [ ] `npm test` passes on the release candidate commit.
- [ ] `npm run check` passes, including generated-runtime parity and repository structure.
- [ ] `npm run test:browser` passes in Chromium at the configured 390 px viewport.
- [ ] GitHub Pages deployment workflow succeeds on the release candidate commit.
- [ ] CodeQL analysis succeeds on the release candidate commit.
- [ ] OpenSSF Scorecard workflow succeeds on the release candidate commit.
- [ ] Any Vercel checks required by the deployment setup succeed, or their build-rate-limit issue is resolved and the final state is confirmed.
- [ ] The latest run links and commit SHA are recorded in the Phase 14 report or release notes.

## 👀 Manual browser and accessibility sign-off

- [ ] Visual review at 390 px, 768 px, and desktop widths.
- [ ] Light and dark theme review, including focus, disabled, error, selected, and empty states.
- [ ] Keyboard-only review of representative form controls, menus, dialogs, data views, editors, media controls, and motion components.
- [ ] Screen-reader review of names, roles, values, state changes, status announcements, dialog focus, tab/panel relationships, and dynamic content.
- [ ] Reduced-motion review with the preference enabled before load and changed while the page is open.
- [ ] Touch/coarse-pointer review for swipe, drag, scroll conflicts, and target sizing.
- [ ] Performance review of the full gallery with all 83 demos mounted, including frame scheduling, canvas backing sizes, and observer/listener cleanup.
- [ ] Browser console review for uncaught exceptions, failed asset requests, and unexpected media errors.

## 🔐 Repository and release governance

- [ ] Confirm branch protection/rulesets for `main`, including required checks and restricted force-push/deletion behavior.
- [ ] Confirm secret-scanning and push-protection settings, where available for the repository.
- [ ] Confirm Dependabot alerts and security updates are enabled and actionable.
- [ ] Review workflow permissions and third-party action versions before the release candidate is frozen.
- [ ] Confirm the intended version/changelog/release notes, if a versioned release is being prepared.
- [ ] Obtain final release approval only after all mandatory automated and manual gates above are complete.

## Current release decision

**Not approved for release yet.** The source/inventory/registry/gallery checks above have been audited and the validator has been strengthened to enforce them. The actual GitHub Actions execution results and manual browser/accessibility sign-off remain outstanding. Do not treat static parsing or workflow configuration as proof that the end-to-end release gates passed.

No release tag, GitHub Release, npm publication, or deployment promotion is performed by this checklist.
