# Phase 1: Quality acceptance matrix

This matrix converts the Phase 1 design system into repeatable checks for Phase 2 and later. It is a test specification, not a record that all 82 components have already passed every item.

## 1. Universal acceptance matrix

| ID | Area | Required checks | Evidence required |
|---|---|---|---|
| Q-01 | Identity | Palette, outline, surfaces, typography, radius and shadows use VFX tokens | Visual review in light and dark themes |
| Q-02 | Motion purpose | Every transition communicates a real state change or intentional brand moment | Interaction recording or approved visual review |
| Q-03 | Motion sequence | Signature interactions have coherent anticipation/action/impact/recovery where appropriate | State-by-state review |
| Q-04 | Motion interruption | Rapid repeated inputs do not cause stale or conflicting animations | Browser interaction tests |
| Q-05 | Reduced motion | Nonessential motion is removed or replaced while preserving state | prefers-reduced-motion test |
| Q-06 | Runtime lifecycle | Frame callbacks, timers, observers and global listeners are cleaned up | Disconnect/reconnect tests |
| Q-07 | Pause behavior | Shared and component-specific pause behavior is respected | Pause/resume browser test |
| Q-08 | Keyboard | Primary operations can be completed without a pointer | Keyboard-only test |
| Q-09 | Focus | Visible focus, logical focus order, focus containment and focus return are correct | Focus assertions |
| Q-10 | Accessibility | Names, roles, values, state announcements and semantic structure are correct | Accessibility-tree review |
| Q-11 | Pointer/touch | Mouse, pen and touch behavior are correct for the component | Desktop and touch emulation |
| Q-12 | Responsive | No clipped content, page-level horizontal overflow or off-screen popovers | 390px, 768px and desktop checks |
| Q-13 | Themes | Light/dark/custom tokens preserve contrast and state visibility | Theme comparison |
| Q-14 | Form behavior | Value, disabled, required, reset and submission work where relevant | Native form test |
| Q-15 | API consistency | Attributes, properties, methods and events are documented and synchronized | API contract test |
| Q-16 | Data safety | Untrusted values are rendered safely; rich content uses allowlists | Injection and malformed-input tests |
| Q-17 | Empty/error states | Missing data, invalid input, load failure and boundary conditions are handled | Scenario-based browser tests |
| Q-18 | Performance | No unnecessary perpetual loops, unbounded particles or repeated layout thrashing | Runtime profiling |
| Q-19 | Visual finish | Default, hover, focus, active, disabled and result states look intentional | Desktop/mobile visual review |
| Q-20 | Documentation | README covers usage, attributes, properties, events, keyboard, accessibility and limitations | Documentation review |
| Q-21 | Demo | Standalone demo shows real interaction, realistic data and important variants | Demo review |
| Q-22 | Registry/build | Component is present in the registry, build list, gallery and validation list | Structural validation |
| Q-23 | Regression | Existing behavior and public API remain compatible | Existing and new browser tests |

## 2. Component-family checks

| Component family | Additional required checks |
|---|---|
| Buttons and form controls | Disabled, required, reset, keyboard activation, composition/input, value synchronization |
| Menus and overlays | Escape, outside click, focus trap/return, viewport collision and scroll lock |
| Calendar/date controls | Locale, boundaries, min/max, range reversal, keyboard date-grid navigation |
| Drag/resize controls | Keyboard alternative, pointer cancellation, min/max constraints and touch |
| Data grids and trees | Sorting/filtering, empty data, large data, focus model, row/item announcements |
| Charts and dashboards | Accessible value summary, zero/negative data, long labels, dynamic data and non-color-only meaning |
| Editors | Safe rendering, paste, selection retention, invalid input, undo/redo where supported |
| Canvas tools | High-DPI sizing, pointer capture/release, clear/export, undo and non-canvas instructions |
| Media components | Missing source, loading/buffering, playback rejection, seek limits, captions and no autoplay |
| 3D interactions | Touch fallback, keyboard access, focus state and reduced-motion static state |
| Ambient motion | Visibility pause, reduced motion, bounded frame work and no unbounded resource use |

## 3. Viewport and input matrix

| Environment | Minimum verification |
|---|---|
| Desktop pointer | Hover, click, drag, focus, resize and animation interruption |
| Keyboard only | Tab order, visible focus, activation, navigation, Escape and return focus |
| Touch / coarse pointer | Tap, drag, swipe, scroll conflict and target size |
| Mobile narrow | 390px viewport, no horizontal overflow, readable labels and usable controls |
| Tablet | 768px layout, orientation and touch targets |
| Reduced motion | System preference enabled before load and changed while page is open |
| Dark theme | Contrast, surface depth, border visibility and animation contrast |

## 4. Release gates

| Gate | Must be true before |
|---|---|
| G1: Shared specification accepted | Phase 2 implementation starts |
| G2: Original reference controls regression-tested | Reference controls are upgraded |
| G3: Each redesigned component passes family and universal checks | Component is marked redesigned |
| G4: Gallery demos and docs are complete | Component is promoted into the main gallery |
| G5: Entire library regression suite passes | A phase is declared complete |

## 5. Phase 1 completion record

- [x] Repository inventory verified: 82 component folders, 82 standalone demos and 83 gallery examples.
- [x] Original 11 reference controls identified.
- [x] Shared runtime, palette and animation primitives inspected.
- [x] Component-specific focus documented for all 82 components.
- [x] Common visual and motion standards written.
- [x] Universal and family-specific acceptance criteria defined.
- [x] Scope preserved: no component implementation changes in Phase 1.

## 6. Explicit exclusions

Phase 1 does not claim that all 82 components are visually polished, fully accessible or production-ready. It establishes the audit baseline and the rules by which those claims will be tested. Component redesign, new effects, architecture changes, media enhancements and gallery redesign belong to later phases.
