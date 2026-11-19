# Changelog

Not yet published. This file records the project-level development history for future versioned releases.

## Unreleased

- Completed the 14-stage implementation roadmap across 82 Web Component types.
- Consolidated the phase implementation records into the project reference and removed the 15 phase-specific report files.
- Added the central component index, architecture reference, accessibility guide and quality/release evidence.
- Fixed Color Palette and Markdown Editor collection-query defects.
- Fixed Marquee and Scroll Reveal native slot-property collisions; Marquee now observes nested light-DOM mutations and cleans up across disconnect/reconnect.
- Added single-activation Enter/Space handling to 3D Flip Card and Confetti Button.
- Corrected Animated Counter regression-test detach/reconnect setup and made Runtime.evaluate failures fail the browser suite loudly.
- Verified all 210 Chromium checks and zero page-side exceptions on merged main commit `acb9c6f392b180ce974d7f8ea60aaf2046472677`.
- Verified Validate, CodeQL, GitHub Pages deployment and OpenSSF Scorecard on the same merged main commit.
- Manual accessibility/visual sign-off and package-consumer verification remain outstanding.
