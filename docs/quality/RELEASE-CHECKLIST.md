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

- [x] Current main commit `cb1421b26f99a6188ddea31f62531e1fdac508aa` passed Validate run `44680747787`.
- [x] Current main CodeQL run `44680748109` passed, and alert-inventory run `44680747893` exported `[]` (zero open alerts).
- [x] Structural validation and generated-build checks passed on release candidate commit `72748136c9eddf1cf160d1d41f92841e59d1f557`.
- [x] Full Chromium interaction and regression suite passed on the exact release candidate.
- [x] npm tarball allowlist and contents inspection are covered by `npm run test:package`.
- [x] Clean offline consumer install and all 82 package export resolutions are covered.
- [x] Aggregate and isolated component browser imports are covered.
- [x] Main-branch Validate runs retain the verified `vfx-ui-anime-0.1.0.tgz` as a 30-day GitHub Actions artifact.
- [x] CodeQL passed on the release candidate.
- [x] Confirm the first-publication workflow completed successfully, including source checks, Chromium tests, clean-consumer package tests, npm publication and GitHub release creation.
- [x] Latest main Validate run `44655153867` passed source checks, full Chromium interactions, package tarball/consumer smoke tests and uploaded the 30-day npm archive artifact.
- [x] Latest main CodeQL run `44680748109` passed on `cb1421b26f99a6188ddea31f62531e1fdac508aa`.
- [x] Latest main OpenSSF Scorecard run `44680747961` passed.

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
- [x] First-publish bootstrap workflow ran successfully using the protected `NPM_TOKEN` secret.
- [x] npm version `vfx-ui-anime@0.1.0` is publicly available.
- [x] npm `latest` dist-tag resolves to `0.1.0`.
- [x] Stable GitHub Release `v0.1.0` exists with `vfx-ui-anime-0.1.0.tgz` attached.
- [ ] Complete manual QA.
- [ ] Create and verify the npm Trusted Publisher connection for `brajesh31/vfx-ui-anime`, workflow filename `publish.yml`, no environment name.
- [ ] Remove the no-longer-needed repository `NPM_TOKEN` secret and revoke the temporary granular token. The one-time bootstrap workflow has already been removed.
- [ ] Use the next planned package version to verify OIDC staging, provenance and 2FA approval.

## GitHub Packages registry

- [x] Keep the existing npmjs package name `vfx-ui-anime` unchanged.
- [x] Add the lowercase scoped GitHub Packages target `@brajesh31/vfx-ui-anime` using a temporary package-manifest copy.
- [x] Add `.npmrc` scope mapping and environment-based token substitution, with no credential committed.
- [x] Add `.github/workflows/publish-github-package.yml` using `GITHUB_TOKEN` and `packages: write`.
- [x] Document GitHub Packages authentication, scoped installation and first-publish visibility behavior.
- [ ] Run **Publish GitHub Package** manually from `main` for the first `0.1.0` publication.
- [ ] Review package association and set visibility to Public if public GitHub Packages access is intended.
- [ ] Verify package installation and the repository Packages panel.

## Deployment

- [x] Static gallery deployment uses GitHub Pages.
- [x] Vercel deployment integration is not part of the active deployment path.
- [x] Confirm the current main-branch Pages deployment workflow completes successfully on commit `cb1421b26f99a6188ddea31f62531e1fdac508aa` (run `44680747792`).

## Go/no-go

**Current status: v0.1.0 is published on npm and GitHub. The latest main Validate, CodeQL, Scorecard and GitHub Pages checks passed, and the CodeQL alert inventory returned zero open alerts. The scoped GitHub Packages workflow is configured but its first publication has not yet been run. npm Trusted Publisher setup/credential cleanup and manual QA remain open. Do not call the package production-certified until human QA is complete.**
