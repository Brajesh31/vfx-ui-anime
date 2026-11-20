# Changelog

VFX UI Anime `v0.1.0` was published to the public npm registry and released on GitHub on 20 November 2026. Manual accessibility, real-device and cross-browser QA remains open; those checks are not implied by the automated release tests.

## v0.1.0 - 2026-11-20

- Restored the browser-only `vfx-ui-anime@0.1.0` package manifest, aggregate entry point, and component subpath exports.
- Added npm tarball inspection, clean offline consumer installation, all 82 component export-resolution checks, and aggregate/single-component Chromium import smoke tests.
- Published `vfx-ui-anime@0.1.0` to npm. The registry reports 170 package files and the `latest` dist-tag resolves to `0.1.0`.
- Published stable GitHub Release `v0.1.0` with `vfx-ui-anime-0.1.0.tgz` attached.
- Added an OIDC/staged-publishing workflow for future releases; the npm Trusted Publisher connection still needs to be verified in account settings.
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

The first-publication workflow completed successfully on commit `eda39329832fe722cfbd4073a5472fd515df2629`. Source validation, repository checks, the complete Chromium interaction suite, the clean-consumer package smoke test, tarball creation, npm publication and GitHub release creation all completed successfully. See [GitHub Actions](https://github.com/Brajesh31/vfx-ui-anime/actions) for the run history.

The gallery is hosted through [GitHub Pages](https://brajesh31.github.io/vfx-ui-anime/). The existing source-only pre-release remains [v0.1.0-rc.1](https://github.com/Brajesh31/vfx-ui-anime/releases/tag/v0.1.0-rc.1).

## Follow-up work

- Complete and record manual visual, keyboard-only, screen-reader, reduced-motion, real-device touch, contrast/focus and Firefox/Safari QA.
- Verify npm Trusted Publisher setup for `Brajesh31/vfx-ui-anime` and workflow `publish.yml`; remove the no-longer-needed repository `NPM_TOKEN` secret and revoke the temporary granular token. The one-time bootstrap workflow has been removed.
- Verify an OIDC-backed staged publication on the next planned package version. Do not create a throwaway version solely to test publishing.
- Correct the publication-status text embedded in the already-published npm README in the next legitimate package release. The GitHub README and release documentation have been corrected on `main`.
