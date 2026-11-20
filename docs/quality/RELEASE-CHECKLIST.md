# 🚦 Release checklist

Use this checklist as the final go/no-go record. A completed source audit or green automated run does not replace human sign-off.

## Source and repository structure

- [x] Inventory contains 82 component folders.
- [x] Build and validator lists cover the same 82 component names.
- [x] Each component includes source and its API README.
- [x] Generated runtime copies match the shared source.
- [x] Registry and gallery examples are consistent.
- [x] The 14-stage component implementation roadmap is complete in scope.
- [x] Component regressions discovered during the integrated audit are corrected.
- [x] Application component implementations, APIs and runtime remain unchanged by the package-only release work.

## Automated checks

- [x] Structural validation and generated-build checks passed on release candidate commit `72748136c9eddf1cf160d1d41f92841e59d1f557`.
- [x] Full Chromium interaction and regression suite passed on the exact release candidate.
- [x] npm tarball allowlist and contents inspection are covered by `npm run test:package`.
- [x] Clean offline consumer install and all 82 package export resolutions are covered.
- [x] Aggregate and isolated component browser imports are covered.
- [x] Main-branch Validate runs retain the verified `vfx-ui-anime-0.1.0.tgz` as a 30-day GitHub Actions artifact.
- [x] CodeQL passed on the release candidate.
- [ ] Confirm all newly triggered main-branch workflows are complete and green on the current `main` commit.

## Manual QA

- [ ] Visual review at mobile, tablet and desktop widths.
- [ ] Keyboard-only review with focus entry, movement, dismissal and restoration.
- [ ] Screen-reader review for accessible names, roles, values, status updates and dynamic content.
- [ ] Reduced-motion review, including runtime preference changes.
- [ ] Real-device touch and coarse-pointer review.
- [ ] Contrast and focus-indicator review.
- [ ] Browser console and failed network request review.
- [ ] Current Chromium, Firefox and Safari spot checks.
- [ ] Record tester, browser/device, date, findings and remediation.

## npm and GitHub release

- [x] Browser-only package manifest and aggregate entry point committed to `main`.
- [x] Individual import subpaths defined for all 82 custom elements.
- [x] Browser-only behavior and SSR limitations documented.
- [x] Restricted npm tarball allowlist defined.
- [x] Tarball, clean consumer and browser smoke test added to CI.
- [x] First-publish bootstrap workflow requires manual dispatch and protected `NPM_TOKEN`.
- [x] Later publish workflow uses npm Trusted Publisher OIDC and staged publication with provenance.
- [ ] Complete manual QA.
- [ ] Add a short-lived npm granular token as protected repository Actions secret `NPM_TOKEN`.
- [ ] Dispatch the bootstrap workflow from `main` for version `0.1.0`.
- [ ] Verify npm registry installation and package metadata.
- [ ] Configure npm Trusted Publisher for workflow `publish.yml`.
- [ ] Revoke/remove the bootstrap token and retire the bootstrap workflow after trusted publishing is verified.
- [ ] Confirm stable GitHub Release `v0.1.0` and attached npm `.tgz` asset exist after successful publication.

## Deployment

- [x] Static gallery deployment uses GitHub Pages.
- [x] Vercel deployment integration is not part of the active deployment path.
- [ ] Confirm the current main-branch Pages deployment workflow completes successfully.

## Go/no-go

**Current status: package implementation and automated smoke-test coverage are complete. Stable public release remains gated by manual QA and first-publish npm authorization. Do not mark this checklist fully complete until every required item above is verified.**
