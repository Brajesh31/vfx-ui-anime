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
- Verified all 210 Chromium checks and zero page-side exceptions on merged main commit `e3e5a46a900dbb88930417acc854a6d96992bce7`.
- Split GitHub Pages artifact build/upload and deployment into dependent jobs, so deployment retries do not upload a second same-named artifact.
- Hardened Chromium startup for slower hosted runners without weakening browser assertions.
- Verified Validate, CodeQL, GitHub Pages deployment and OpenSSF Scorecard on main commit `e3e5a46a900dbb88930417acc854a6d96992bce7`.
- Manual accessibility/visual sign-off and package-consumer verification remain outstanding.

- Corrected Color Palette keyboard and focus management: roving `tabindex`, in-place selection updates, preserved focus, and explicit Enter/Space activation with single event delivery.
- Expanded Color Palette browser regressions for Arrow/Home/End, Enter/Space, one Tab stop, dynamic list replacement and focus retention.
- Made the Audio Player browser test wait for actual media metadata instead of a fixed delay, with useful media diagnostics on failure.
- Verified the final merged `main` commit `bb7bd2928bd4605e15528d9d3550b2a718bc6ab9`: Validate, CodeQL, GitHub Pages and OpenSSF Scorecard passed; the full Chromium suite recorded 210 checks with zero failures and zero page-side exceptions.
