# Changelog

This project is released as a source-only GitHub pre-release, `v0.1.0-rc.1`. The browser-only npm package contract for `0.1.0` is prepared on `main`; the first registry publication is pending npm account authorization and explicit manual QA.

## Unreleased

- Restored the browser-only `vfx-ui-anime@0.1.0` package manifest, aggregate entry point, and component subpath exports.
- Added npm tarball inspection, clean offline consumer installation, all 82 component export-resolution checks, and aggregate/single-component Chromium import smoke tests.
- Added a one-time protected-token npm bootstrap workflow and OIDC/provenance workflow for later stable releases.
- Kept the first stable GitHub Release and npm tarball asset gated on a successful, authorized npm publication.
- Removed obsolete Vercel deployment integration references; GitHub Pages is the static gallery deployment target.

- Completed the 14-stage implementation roadmap across all 82 Web Component types.
- Consolidated the former phase reports into the project reference and removed the 15 phase-specific report files.
- Added the central component index, architecture reference, accessibility guide and quality/release evidence.
- Fixed Color Palette and Markdown Editor collection-query defects.
- Fixed Marquee and Scroll Reveal native slot-property collisions. Marquee now observes nested light-DOM mutations and cleans up across disconnect/reconnect.
- Added single-activation Enter/Space handling to 3D Flip Card and Confetti Button.
- Corrected Animated Counter detach/reconnect regression-test setup and made page-side Runtime.evaluate exceptions fail the browser suite.
- Hardened Chromium startup diagnostics without weakening or skipping assertions.
- Split GitHub Pages artifact build/upload and deployment into dependent jobs.
- Improved Color Palette roving tabindex, keyboard selection, focus preservation, dynamic swatch updates and single event delivery.
- Replaced Audio Player's fixed metadata delay with a bounded event-based wait and media diagnostics.

## Verification

The latest tested package branch commit passed Validate and CodeQL before being fast-forwarded to `main`. New main-branch workflows are running against the exact updated main head. See [GitHub Actions](https://github.com/Brajesh31/vfx-ui-anime/actions) for their live result.

The gallery is hosted through [GitHub Pages](https://brajesh31.github.io/vfx-ui-anime/). The existing source-only pre-release remains [v0.1.0-rc.1](https://github.com/Brajesh31/vfx-ui-anime/releases/tag/v0.1.0-rc.1).

## Release gates still open

- Complete and record manual visual, keyboard-only, screen-reader, reduced-motion, real-device touch, contrast/focus and Firefox/Safari QA.
- Add a protected npm granular access token as the repository Actions secret `NPM_TOKEN`, then manually run the first-publication workflow from `main`.
- Configure npm Trusted Publisher for `Brajesh31/vfx-ui-anime` and `publish.yml` after the package exists, then revoke the bootstrap token and retire the one-time bootstrap workflow.
- Verify the registry installation and publish the stable GitHub Release with the generated `.tgz` asset after npm accepts the first publication.
