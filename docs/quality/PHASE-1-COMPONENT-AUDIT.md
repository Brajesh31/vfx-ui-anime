# Phase 1: Component audit and quality baseline

**Status:** Complete  
**Audit snapshot:** 19 November 2026  
**Repository baseline:** eadd0d6c958886e4b62250aa79075bc0bf26877f  
**Scope:** Existing 82 component types only. No component implementation was redesigned in Phase 1.

## 1. Inventory and audit coverage

The main branch contains:

| Item | Verified count |
|---|---:|
| Component folders | 82 |
| Standalone component entry points | 82 |
| Standalone component demos | 82 |
| Live gallery examples | 83 |
| Additional gallery example | 1 secondary Button variant |

All 82 component entry points were inventoried. The audit compared the shared runtime, source architecture, component-specific behavior, accessibility signals, animation/lifecycle patterns, standalone demos, registry/build lists and current documentation. The per-component table below records the current implementation profile and the exact focus for the next redesign pass.

This is a design and source audit, not a claim that every component has already passed a complete visual, accessibility or cross-browser QA cycle. Phase 2 and later phases must prove those requirements in the browser.

## 2. Executive findings

### F-01. The original controls are the correct motion benchmark

The original Button, Toggle, Slider, Checkbox, Radio, Input, Tabs, Progress, Rating, Toast and Tooltip were designed around distinct anime-inspired feedback. Their source comments and implementation describe component-specific movement, effects and timing rather than relying only on hover transitions.

Button is the best reference for a complete interaction sequence. Toggle and Slider are important references for illustrated/painted animation and spring-driven movement. These should be protected as the visual benchmark, not flattened into a generic animation preset.

### F-02. The newer components do not yet meet one shared motion standard

A number of later components are useful functional controls, but their motion is often a simple CSS transition, a one-time SVG render, a basic state change, or a single burst. That is not equivalent to the multi-stage choreography of the original Button.

The charts, dashboard tiles, editors, media wrappers, 3D cards and ambient effects need component-specific motion design. Adding the same particles to every item would make the library repetitive, not premium.

### F-03. The standalone build duplicates the shared runtime

core.js is approximately 40,430 bytes. tools/build.mjs stamps a copy into each of the 82 standalone component files so that each component can run independently.

That keeps each component self-contained, but it also duplicates the runtime in every file. Across all 82 files, the repeated raw core source represents approximately 3.3 MB before transfer compression, even though the runtime guard prevents the core from initializing more than once on a page.

**Decision:** retain the standalone-file requirement for now, but Phase 2/architecture work must measure actual gallery network cost and evaluate a shared-runtime distribution alongside standalone builds. Do not remove standalone support without a tested replacement.

### F-04. Toggle has a distinct asset-size trade-off

Toggle embeds a 43-frame WebP sprite sheet as a data URI in its JavaScript file. Its current index.js is approximately 505 KB, with roughly 461 KB occupied by the embedded frame payload.

This creates a distinctive painted animation, but it is a major outlier in component payload size.

**Decision:** preserve the animation quality. Evaluate asset loading, compression, caching and standalone packaging separately. A smaller file must not mean a visibly worse animation.

### F-05. The shared runtime is a strong foundation, but component adoption is uneven

The current core provides a Spring class, a shared frame scheduler, a page-level effects canvas, a timer queue, Base lifecycle handling, event emission, drawing primitives and a prefers-reduced-motion signal.

The Base class removes its frame callback when disconnected. Components that add their own requestAnimationFrame loops, window/document listeners, observers or media handlers must also clean them up explicitly.

**Decision:** future components should use the shared runtime where suitable. Custom loops are allowed only when their ownership, pause behavior and cleanup are explicit.

### F-06. Theme tokens exist, but hard-coded styling has spread into newer components

The core already defines a distinctive palette and surface variables. Several newer components still declare literal colors, borders, shadows and radii inside component CSS.

This makes local designs harder to theme consistently and creates drift between components.

**Decision:** define semantic tokens for surfaces, borders, focus, status colors, shadows, typography and motion. Decorative illustration colors may remain component-specific, but interactive states and base surfaces must use shared tokens.

### F-07. Reduced motion must be treated as a component-level requirement

The core detects prefers-reduced-motion and exposes a calm state. Some components also include CSS reduced-motion rules, but that does not automatically cover every custom transition, frame animation, scroll reveal, media visualizer or pointer-driven effect.

**Decision:** every animated component must have an intentional reduced-motion mode. It must preserve state and usability while suppressing nonessential movement, particles, shake, parallax and auto-motion.

### F-08. Accessibility needs a behavior-based audit, not an ARIA-count target

The codebase includes native controls, form-associated components, ARIA roles, live regions and keyboard handlers. Coverage differs by component. A low number of ARIA attributes is not automatically a defect, and a high number does not prove accessible behavior.

**Decision:** Phase 2 must verify names, roles, values, focus, keyboard interaction, announcements, error states, native form behavior and touch alternatives for each component. Decorative canvases and SVGs must not be the only source of meaningful information.

### F-09. Component update contracts are inconsistent

Some components expose useful properties and methods, while others mainly read attributes at initialization. The library needs a clear rule for how attributes, JavaScript properties, internal state, form values and emitted events stay synchronized.

**Decision:** establish a documented API contract before individual components are upgraded. No silent behavior changes to existing public properties or events.

### F-10. The current demos do not always demonstrate the real component capability

Some examples show the component shell without the data or media source required for a full demonstration. For example, media player demos without a playable source cannot demonstrate playback, seeking or visual feedback. Several new component READMEs are also much shorter than the original component documentation.

**Decision:** each component must have a complete, meaningful demo with realistic data, all important states, responsive layout and API examples. A visually attractive empty shell is not a complete demo.

## 3. Current design tokens captured from core.js

These are the existing brand values and must remain the starting point for the shared design system.

| Token | Current value | Intended role |
|---|---|---|
| Ink | #1d1a4a | Primary outlines and text |
| Paper / card | #ffffff / #fff | Main component surface |
| Shade | #b8b3ff | Shadow and dimensional color |
| Line | #5a4fd8 | Illustration and effect outlines |
| Accent | #ff5fa8 | Primary anime accent |
| Primary | #8f8df7 | Primary control fill |
| Muted text | #8580b0 | Secondary text |
| Track | #c9cbe0 | Control tracks |
| Radius | 15px | Current base corner radius |
| Border width | 3.2px | Current primary control outline |
| Shadow | 6px 7px 0 var(--vfx-soft) | Current offset shadow |

The expanded semantic token system, dark theme values and motion tokens are specified in ANIMATION-DESIGN-SYSTEM.md. They are targets for later implementation, not claims about tokens that already exist.

## 4. Component-by-component audit

The profile describes what the current component is for. The redesign focus describes what must be evaluated and improved next. It does not imply that every listed behavior is currently broken.

### A. Original signature controls: 11 components

These are the reference family. Preserve their visual personality and existing public behavior while improving consistency, accessibility and performance.

| Component | Current profile | Next redesign focus |
|---|---|---|
| Button | Signature impact sequence with squash, inversion, burst, shards, smoke, lettering and completion feedback | Preserve the full choreography; standardize variants, disabled/loading/success/error states, keyboard activation and reduced-motion behavior |
| Toggle | Painted 43-frame sprite animation with an illustrated transition | Preserve frame quality; measure payload, ensure form/reset/disabled states, synchronize checked state and reduced-motion behavior |
| Slider | Spring-driven thumb and value bubble with cloud, speed-line and release effects | Preserve tactile drag motion; verify touch, keyboard, min/max/step, disabled state, focus and form semantics |
| Checkbox | Animated tick, crescents, shards and confirmation lettering | Preserve tick choreography; verify indeterminate, disabled, form reset, label hit area and keyboard state |
| Radio | Springing selected dot with impact effects | Preserve selection feedback; verify group semantics, roving focus, arrow-key navigation and required state |
| Input | Focus and caret feedback with small dust/impact effects | Preserve subtle feedback; verify labels, input types, validation, composition/IME, autocomplete and error states |
| Tabs | Sliding active plate with spring movement and directional feedback | Preserve sliding indicator; verify tab/tabpanel relationships, arrow/Home/End keys, focus and overflow |
| Progress | Animated leading cloud and movement as progress advances | Preserve cloud identity; verify determinate/indeterminate modes, numeric announcement, zero/complete and reduced motion |
| Rating | Sequential star activation with additional full-score feedback | Preserve sequential pop; verify keyboard radio behavior, clear state, fractional values if supported and accessible value text |
| Toast | Fast impact entrance and shrinking/exit feedback | Preserve entrance personality; define queueing, duration, pause-on-hover/focus, dismissal, live-region behavior and reduced motion |
| Tooltip | Springing speech-bubble reveal with supporting effects | Preserve speech-bubble reveal; verify hover/focus parity, Escape, touch alternative, delay and accessible description relationship |

### B. Core interface and feedback controls: 26 components

These components should feel like members of the same library, but animation intensity must match the task. A form field should not behave like a celebration effect.

| Component | Current profile | Next redesign focus |
|---|---|---|
| Select | Dropdown/listbox with spring and selection feedback | Polish open/close, selected-row movement, option hover, empty/loading/error states, keyboard and form semantics |
| Textarea | Form-associated text area with animated feedback | Add polished focus/resize/limit feedback; verify label, validation, composition, form reset and responsive sizing |
| Number Stepper | Numeric input with increment/decrement controls | Add directional press and value-change feedback; verify bounds, step, keyboard, repeat behavior and form value |
| Search | Search input with interactive suggestions and keyboard-oriented behavior | Polish suggestion entrance, active-result tracking, query clearing and empty/loading/error states |
| Menu | Triggered menu with animated opening and selection | Verify focus transfer, arrow keys, Home/End, Escape, outside click and nested menu behavior |
| Dialog | Native dialog wrapper with impact entrance and close feedback | Refine modal choreography; verify focus trap/return, Escape, backdrop, scroll lock and reduced motion |
| File Upload | File selection and upload feedback | Add staged drop/accept/reject/progress/success/error states; verify keyboard picker, multiple files and accessible status |
| Color Picker | Color selection with effect feedback | Standardize swatch and hue interaction, keyboard access, text input formats, copy feedback and contrast |
| Accordion | Spring-loaded disclosure panels and moving marker | Polish single/multiple open states, content reveal and icon motion; verify heading/button semantics |
| Segmented Control | Spring underline/indicator on selection | Standardize active-pill motion; verify radiogroup/tablist semantics, keyboard and narrow layouts |
| OTP Input | Digit entry with spring landing feedback | Polish focus transfer and invalid states; verify paste, autofill, backspace, numeric input and screen-reader labels |
| Tag Input | Token insertion/removal with motion | Add consistent chip entrance/exit and overflow; verify delimiters, paste, duplicate rejection and keyboard deletion |
| Pagination | Active-page indicator with spring plate | Add animated range changes and loading state; verify previous/next boundaries, labels and large-page behavior |
| Alert | Notification panel with snap/impact entry and dismiss | Distinguish info/success/warning/error; verify live-region priority, persistent/dismissible modes and reduced motion |
| Drawer | Native dialog side sheet | Verify side-specific slide/recovery, focus handling, backdrop, Escape, scroll behavior and mobile viewport constraints |
| Skeleton | Loading placeholders with shimmer | Define restrained shimmer and variants; honor reduced motion and provide clear loading semantics |
| Badge | Compact status marker with spring pop/pulse | Add meaningful status variants and state transitions; keep decorative pulse subtle and avoid color-only meaning |
| Avatar | Image/initial fallback with entrance and presence indicator | Polish image loading/fallback/stack behavior; verify alt text, presence labels and status semantics |
| Chip | Selectable/dismissible token with press feedback | Standardize selectable, removable and disabled states; verify button semantics and keyboard activation |
| Breadcrumb | Semantic navigation with directional trail feedback | Polish responsive collapsing and current-location state; verify navigation landmark and separators |
| Stepper | Bounded quantity control with directional feedback | Clarify semantics against Number Stepper; standardize API naming, repeat/hold behavior and keyboard bounds |
| Calendar | Month grid with page-turn and date feedback | Polish month transitions and selected/today/range states; verify grid keyboard navigation, locale and disabled dates |
| Date Picker | Animated date popover | Harmonize with Calendar; verify parsing, date constraints, keyboard grid, outside click, focus return and locale |
| Command Palette | Keyboard-first overlay with filtering | Polish search-result motion and selection; verify shortcut behavior, focus, empty results, grouping and Escape |
| Context Menu | Pointer-anchored menu with snap-open feedback | Polish positioning near edges, nested actions and item states; verify keyboard invocation and dismissal |
| Combobox | Editable option picker with filter and spring commit | Verify active descendant, keyboard navigation, async/no-result states, selection model and form synchronization |

### C. Advanced interaction, data and workflow components: 25 components

These components have more complex state and user journeys. Their priority is reliable interaction first, then motion that makes state easier to understand.

| Component | Current profile | Next redesign focus |
|---|---|---|
| Drag & Drop | Drag/drop interaction and item feedback | Add lift, drag shadow, target magnetism, insertion marker and return animation; provide keyboard and non-drag alternatives |
| Carousel | Multi-item navigation | Add spring track motion, active-card emphasis and swipe feedback; verify focus, autoplay controls and reduced motion |
| Timeline | Sequential event visualization | Add staged reveal and active milestone movement; verify dense content, responsive stacking and semantic reading order |
| Radial Menu | Circular action layout | Polish radial expansion and item orbit; verify pointer origin, keyboard navigation, collision boundaries and touch interaction |
| Image Cropper | Image manipulation with crop controls | Add transform/handle feedback and zoom; verify keyboard-resizable handles, export quality, orientation and mobile gestures |
| Kanban | Multi-column board and card movement | Add card lift, lane highlight, insertion feedback and drop settle; provide keyboard alternatives and state announcements |
| Data Grid | Sort/filter/select/pagination behavior | Add row selection/column feedback and loading transitions; verify table semantics, keyboard, empty states and large data handling |
| Tree View | Hierarchical expandable items | Polish branch reveal and active-row movement; verify tree roles, arrow-key navigation, collapsed visibility and selection model |
| Signature Pad | Pointer-driven drawing surface | Add smooth stroke rendering and pen feedback; verify touch, high-DPI export, undo/clear, keyboard alternative and accessible instructions |
| Before & After | Split-image comparison | Add animated reveal and handle feedback; verify keyboard adjustment, labels, image loading and responsive aspect ratio |
| Multi Select | Searchable option selection with chips | Polish chip insertion/removal, selected-count feedback and dropdown; verify keyboard, form serialization and large option sets |
| Time Picker | Time input with presets/step controls | Add clock/value transitions and invalid-state feedback; verify locale, 12/24-hour display, bounds and form behavior |
| Transfer List | Dual-list movement and search | Add item travel animation, selection and bulk-move feedback; verify keyboard alternatives, list announcements and stable ordering |
| Split Pane | Pointer/keyboard resizable panels | Add spring settle and divider feedback; verify min/max bounds, touch, keyboard increments and narrow-screen stacking |
| Lightbox Gallery | Thumbnail grid and modal viewer | Add image-to-viewer transition, next/previous feedback and loading state; verify focus, captions, missing images and keyboard navigation |
| Password Field | Reveal/hide and strength guidance | Add eye-toggle feedback and rule progress; verify password manager behavior, form serialization and non-misleading strength messaging |
| Date Range Picker | Start/end selection and quick presets | Add range sweep and endpoint feedback; verify reversed/partial ranges, constraints, keyboard navigation and form serialization |
| Notification Center | Read/unread state and bulk actions | Add unread count transitions, grouped list and dismissal feedback; verify live regions, persistence contract and keyboard behavior |
| Rich Text Editor | Toolbar and formatted content editing | Polish toolbar state, selection feedback and editing focus; verify sanitization, paste handling, keyboard shortcuts and accessible toolbar |
| Gradient Picker | Two-color stop editing and gradient preview | Add animated stop selection, draggable handles and preview transition; verify keyboard stop editing and CSS output |
| Multi-step Wizard | Slotted workflow steps and validation | Add step transition, progress choreography and invalid-field feedback; verify focus on errors, back navigation and completion state |
| Guided Tour | Selector-based spotlight overlay | Polish spotlight movement and card placement; verify target loss, focus management, scroll/resize, Escape and reduced motion |
| Stopwatch | Start/stop/lap/reset timing | Add start impact, lap marker and stop settle; verify timer accuracy, tab background behavior and cleanup |
| Emoji Picker | Searchable curated emoji selection | Add category transitions, focused-item feedback and recent/favorites model; verify keyboard grid and screen-reader names |
| Copy Code Block | Line-numbered code view and copy | Add copy confirmation, selection and syntax treatment; verify long-line overflow, focus and clipboard failure behavior |

### D. Charts, creative, media, 3D and motion components: 20 components

This is the most visibly uneven group and the highest-priority redesign target after the original reference controls. Several current implementations are deliberately lightweight prototypes. They need a real interaction and visual-design pass, not just extra particles.

| Component | Current profile | Next redesign focus |
|---|---|---|
| Bar Chart | SVG bars and category selection | Staggered bar growth, axis reveal, spring hover, tooltip, active selection and accessible data summary |
| Donut Chart | Static proportional SVG segments and legend | Animated segment drawing, hover expansion, legend synchronization, center-value transition and accessible breakdown |
| Sparkline | Compact SVG trend path | Path draw-in, gradient area, cursor tracking, point tooltip and zero/flat-data handling |
| KPI Card | Static metric tile with value/delta | Odometer/count-up, embedded sparkline, trend direction, status state and subtle interactive elevation |
| Gauge | Semicircular value arc | Animated needle/arc, ticks, thresholds, spring settle and accessible numeric value |
| Heatmap | Seven-column colored intensity grid | Staggered cell entrance, hover/focus highlight, tooltip, legend and non-color-only intensity labels |
| Treemap | Proportional flex tiles | True proportional area layout, animated reflow, category selection and nested/long-label behavior |
| Drawing Canvas | Pointer drawing with clear and PNG export | Brush presets, pressure where supported, undo/redo, eraser, shapes, layers and polished tool feedback |
| Color Palette | Selectable swatches and copy | Color harmony, HEX/RGB/HSL, swatch selection choreography, contrast hints and copy confirmation |
| Audio Player | Native audio element with custom play/seek/volume shell | Waveform/spectrum, seek preview, buffering, speed, playlist, volume/mute and accessible transport |
| Video Player | Native video element with custom play/pause | Full transport bar, timeline, buffering, captions, speed, fullscreen, PiP and accessible controls |
| Markdown Editor | Split text editor and simple preview | Toolbar, complete supported syntax, code blocks, tables, preview states, safe rendering and keyboard shortcuts |
| JSON Editor | Text editor with parse validation and format/minify | Syntax colors, line numbers, error locations, JSON tree view, search, collapse and copy feedback |
| 3D Tilt Card | Pointer-driven perspective transform | Layered parallax, light/reflection response, spring return, touch fallback and reduced-motion static state |
| 3D Flip Card | Front/back CSS flip | Multiple directions, perspective depth, slot content, state-specific face details, keyboard and reduced-motion handling |
| Particle Field | Ambient canvas particles | Pointer attraction, particle connections, trails, density controls, adaptive performance and pause/offscreen handling |
| Marquee | Looping slot-based content track | Seamless measured duplication, directional/speed controls, pause controls, focus pause and reduced-motion fallback |
| Scroll Reveal | IntersectionObserver reveal | Stagger, direction, mask/blur/scale variants, replay/once controls and reduced-motion behavior |
| Animated Counter | requestAnimationFrame number interpolation | Odometer digit motion, decimals, separators, prefixes/suffixes, visibility trigger and cancellation-safe updates |
| Confetti Button | Button with burst and shard trigger | Full Button-quality press/impact/recovery sequence, smoke/ribbon/chips, success feedback and reduced-motion alternative |

## 5. Priority and dependency decisions

| Priority | Work | Why it comes first |
|---|---|---|
| P0 | Shared motion, theme, accessibility and lifecycle contracts | Prevents 82 separate implementations from drifting further |
| P1 | Preserve and formalize the original 11 motion references | Establishes what VFX quality actually means |
| P1 | Upgrade the 20 newest visual/creative/media components | Addresses the most obvious gap between function and premium finish |
| P2 | Upgrade forms, menus, overlays and complex interaction components | These have the greatest keyboard, focus and form-state complexity |
| P2 | Resolve shared-runtime and Toggle payload strategy | Improves delivery cost without sacrificing standalone use or signature motion |
| P3 | Expand the catalogue with additional chart, media, creative and 3D components | New components should follow the accepted standard, not create more redesign debt |

The implementation order should be dependency-aware. The visual tokens, motion primitives, accessibility contract and runtime budget must be settled before copying patterns into dozens of components.

## 6. Phase 1 exit criteria

- [x] Inventory all 82 component folders and standalone demos.
- [x] Confirm the 83 gallery examples and explain the additional Button variant.
- [x] Inspect the shared runtime and capture existing design tokens.
- [x] Identify the original 11 motion-reference components.
- [x] Document the current architecture and key payload/lifecycle risks.
- [x] Record a component-specific redesign focus for all 82 components.
- [x] Define the shared animation, visual, accessibility and performance standards.
- [x] Define the acceptance matrix for later implementation phases.
- [x] Keep Phase 1 documentation-only: no component implementation was changed.

**Phase 1 is complete. Phase 2 has not started.**
