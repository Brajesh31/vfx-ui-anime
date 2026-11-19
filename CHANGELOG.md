# Changelog

Not yet published. This file records the project-level development history for future versioned releases.

## Unreleased

- Completed the 14-stage implementation roadmap across 82 Web Component types.
- Consolidated the phase implementation records into the project reference.
- Added a central component index and current quality/release status.
- Fixed Color Palette and Markdown Editor collection-query defects.
- Fixed Marquee and Scroll Reveal native slot-property collisions; Marquee now observes nested light-DOM mutations and cleans up across disconnect/reconnect.
- Added single-activation Enter/Space handling to 3D Flip Card and Confetti Button.
- Corrected Animated Counter regression-test detach/reconnect setup and made Runtime.evaluate failures fail the browser suite loudly.
- Verified the complete Chromium suite and CodeQL on candidate commit `dd4be3b0f716172aa0a3a48157c83cd1d91ae380`.
- Added a consolidated accessibility testing guide and updated release evidence. Manual review and npm package validation remain outstanding.
