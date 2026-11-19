# Changelog

This project has not received a versioned release yet. Changes are recorded under **Unreleased** until the public API, distribution model and release gates are approved.

## Unreleased

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
- Verified the current `main` head `0197589d1186ae2d8dc6dd366cbe3f6ab09cdf18`: Validate, CodeQL, GitHub Pages and OpenSSF Scorecard workflows passed. The Chromium suite recorded 210 successful checks with zero failures and zero page-side exceptions.
- Deployed the static gallery through GitHub Pages: https://brajesh31.github.io/vfx-ui-anime/.

## Release gates still open

- Manual visual, keyboard-only, screen-reader, reduced-motion, touch and cross-browser QA.
- Inspect the npm tarball, define the package contents and entry-point contract, and test installation in a clean consumer project.
- Select and publish a version only after the release gates are signed off.
