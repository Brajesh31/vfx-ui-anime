# VFX UI Anime: visual and animation design system

**Status:** Phase 1 specification  
**Applies to:** All 82 existing components and every future component  
**Reference implementations:** Button, Toggle and Slider

This document defines the shared visual and motion language. It is a target standard for subsequent implementation. Existing values and behavior are identified separately from proposed standards.

## 1. Product principles

1. **Animation is part of the interaction, not decoration.** Movement must explain a state change, acknowledge an action or create a deliberate visual moment.
2. **Every component gets its own motion identity.** A chart, menu, checkbox, media player and celebration button must not all use the same burst.
3. **The original controls are the benchmark.** Preserve their personality and choreographed response.
4. **Function comes before spectacle.** Animation must never delay input, block navigation, obscure content or make a control harder to understand.
5. **Motion must be interruptible and accessible.** Reduced-motion users receive the same state and information without nonessential movement.
6. **The library must feel like one product.** Color, outlines, surfaces, focus, spacing and event behavior must be consistent.
7. **The standalone promise remains important.** Any shared-runtime optimization must preserve an independently usable component distribution or provide a tested equivalent.

## 2. Existing brand foundation

The shared runtime currently defines the following core palette and surface values.

| Token | Existing value | Use |
|---|---|---|
| --vfx-ink | #1d1a4a | Primary text and outlines |
| --vfx-card | #fff | Main surface |
| --vfx-soft | #b8b3ff | Offset shadow / soft depth |
| --vfx-pri | #8f8df7 | Primary control color |
| --vfx-pri-ink | #1d1a4a | Text on primary |
| --vfx-acc | #ff5fa8 | Anime accent |
| --vfx-dim | #8580b0 | Muted text |
| --vfx-track | #c9cbe0 | Tracks and background rails |
| --vfx-r | 15px | Current base radius |
| --vfx-bw | 3.2px | Current base outline |
| --vfx-sh | 6px 7px 0 var(--vfx-soft) | Current offset shadow |

The effect renderer also uses white fill, lavender shade, purple line, pink accent and dark ink. These are the identity anchors. Do not casually replace them with unrelated component palettes.

## 3. Semantic token expansion target

The following semantic tokens should be introduced or mapped consistently during implementation. They are not all present in core.js today.

| Token family | Required tokens | Rule |
|---|---|---|
| Surfaces | surface, surface-raised, surface-muted, surface-inverted | Components use surfaces rather than independent white/black literals |
| Text | text, text-muted, text-inverted, text-disabled | Maintain readable contrast in every theme |
| Borders | border, border-strong, border-subtle | Controls share outline hierarchy |
| Focus | focus-ring, focus-offset | Visible keyboard focus must not be removed |
| Status | success, warning, danger, info | Status is not communicated by color alone |
| Effects | effect-ink, effect-fill, effect-accent, effect-shadow | FX canvas and component surfaces stay coordinated |
| Shadows | shadow-offset, shadow-overlay, shadow-floating | Distinguish playful offset depth from modal elevation |
| Motion | duration-micro, duration-control, duration-impact, duration-showcase | Components use named timing bands |
| Easing | ease-standard, ease-enter, ease-exit, ease-spring | Avoid arbitrary timing functions in each component |

Theme values must be overrideable from the page. Components should consume semantic variables with safe fallbacks rather than baking an entire theme into their CSS.

## 4. Visual rules

### 4.1 Shape and outline

- Keep the recognizable ink-outline and offset-shadow language.
- Use the existing 15px radius and 3.2px outline as the current reference, not an inflexible value for every shape.
- Small chips, badges and indicators may use tighter radii.
- Modal, panel and card outlines must be visually related, not independently invented.
- Avoid combining multiple heavy shadows that make a control look visually muddy.

### 4.2 Typography

- Use the existing rounded/system typography direction.
- Establish a consistent scale for control labels, helper text, values, captions and headings.
- Numeric values should use tabular numerals where alignment matters.
- Long labels and translations must wrap or truncate deliberately. They must not break a layout.

### 4.3 Color and contrast

- Use accent color to reinforce hierarchy, not to color every surface.
- Disabled, hover, selected, pressed, invalid and success states must remain distinguishable.
- Do not rely on color alone for status, chart values, selection or error feedback.
- Decorative SVG/canvas colors can be expressive, but labels and meaningful controls must remain readable.

### 4.4 Density and spacing

- Use a shared spacing scale and consistent internal padding.
- Avoid component-specific unexplained offsets that only work at one demo width.
- Controls must retain clear hit areas on touch devices.
- Dense tools may use compact controls, but the primary action and focus target must remain easy to operate.

## 5. Motion grammar

A signature VFX interaction may use the following sequence. Not every component needs every phase.

| Phase | Purpose | Example motion |
|---|---|---|
| 1. Anticipation | Prepare the user for the response | Slight compression, lean, focus pull or short preload |
| 2. Action | Express the actual state change | Slide, fill, reveal, rotate, draw, move or morph |
| 3. Impact | Emphasize the committed moment | Ink tick, burst, shard, ripple, snap or brief inversion |
| 4. Recovery | Return to a stable usable state | Spring settle, overshoot correction or fade |
| 5. Echo | Optional small finishing detail | Glint, dust, ring, count update or secondary ripple |

**Rule:** effects must be causally connected to the action. Do not add smoke or particles to an unrelated state just to make it look animated.

### 5.1 Motion intensity bands

These are target bands for implementation and visual review, not existing measured timings.

| Band | Target duration | Use |
|---|---:|---|
| Micro | 80–140 ms | Hover, focus, pressed and small icon feedback |
| Control | 140–260 ms | Selection, chip add/remove, toggle state and small panel movement |
| Impact | 240–420 ms | Main press/release, menu selection, chart selection and success feedback |
| Showcase | 420–750 ms | Full signature sequence, large reveal, 3D flip and celebration |
| Ambient | Continuous, low intensity | Background particles, gentle marquee and idle visualizers |

Avoid making every event long. Inputs and menus should feel immediate. Full impact sequences should be reserved for actions that deserve attention.

### 5.2 Spring and easing

- Prefer the shared Spring implementation for physical movement and settle.
- Use CSS easing for opacity, color, masks and simple transitions.
- Use one motion owner per animated property. Do not let a CSS transition and a JavaScript spring continuously fight over the same transform.
- Provide deterministic end states so animations do not accumulate transform offsets.
- Animation may be interrupted by another input without corrupting component state.

### 5.3 Component-specific motion families

| Family | Suitable motion | Avoid |
|---|---|---|
| Form controls | Tactile press, selection, fill, check draw, value settle | Repeated full-screen bursts for normal typing |
| Navigation | Indicator travel, panel reveal, directional transition | Excessive bounce that delays navigation |
| Menus and overlays | Scale/slide, backdrop fade, focus arrival | Motion that obscures the selected action |
| Charts | Staggered data entry, path draw, point highlight, tooltip | Replaying a long intro on every hover |
| Editors | Selection highlight, toolbar confirmation, cursor/format feedback | Animations that move the writing surface unexpectedly |
| Media | Waveform/spectrum response, seek preview, buffering | Auto-playing sound or constant distracting motion |
| 3D | Perspective, depth, tilt, flip, lighting | Pointer-only interactions or motion on reduced-motion devices |
| Canvas / particles | Trails, attraction, brush response and subtle ambient movement | Unbounded particles or permanent high-cost animation |
| Utility controls | Small, purposeful state transitions | Overdesigning every utility with comic impact effects |

## 6. Motion implementation architecture

### 6.1 Shared runtime first

The current core exposes:

- Spring and interpolation helpers.
- A shared animation frame scheduler.
- A timer queue.
- A page-level effects canvas.
- Canvas drawing/effect primitives such as puff, burst, shards, ring, splash, slash, lines, ticks, wob, kira and dotted lettering.
- Base lifecycle registration and cleanup.
- A bubbling, composed custom-event helper.
- A prefers-reduced-motion signal.

Future components should use these facilities when they fit. Do not create a new global canvas, timer engine or animation scheduler per component without a documented reason.

### 6.2 Lifecycle ownership

- Register frame work only while the component is connected.
- Remove frame work on disconnect.
- Cancel every manually owned requestAnimationFrame on completion and disconnect.
- Clear timers and remove document/window listeners on disconnect.
- Disconnect observers and release pointer capture where relevant.
- Stop media visualizers and expensive work when hidden or no longer needed.
- Respect the global pause state and the component's own paused state.

### 6.3 Deterministic state

- Internal state is the source of truth.
- The final visual state must match the committed component value.
- Multiple quick inputs must not create stale animation completions.
- A new animation must safely replace or interrupt an old one.
- Reset, disable, close and disconnect must leave no active visual artifacts.

## 7. Reduced motion, sound and user control

### 7.1 Reduced motion

When prefers-reduced-motion is enabled:

- Remove nonessential travel, spring overshoot, parallax and shake.
- Skip or drastically shorten long reveal sequences.
- Stop ambient auto-motion unless it is essential to understanding current data.
- Do not use flashes or rapidly alternating high-contrast frames.
- Keep the same value, state, selection and feedback information.
- Avoid starting long auto-play animations before the user can interact.

A reduced-motion implementation is not just a shorter duration. Some motion must be replaced with a static state.

### 7.2 Sound effects

- Never play sound automatically on page load.
- Sound must begin only after user activation and must be independently disableable.
- Provide a silent default when there is no prior user gesture or sound preference.
- Sound must never be required to understand a control state.
- Keep sound brief and synchronized to the impact rather than the entire animation.

## 8. Responsive and input behavior

- Design mobile first, then verify tablet and desktop.
- Support mouse, touch and pen where appropriate.
- Use pointer events rather than separate incompatible mouse/touch implementations where possible.
- Give drag handles and primary controls comfortable touch targets.
- Provide keyboard alternatives for drag, resize, selection and canvas actions where the task requires them.
- Avoid hover-only information.
- Keep menus, popovers, tooltips and dialogs inside the viewport.
- Respect safe areas and mobile viewport changes.
- Do not allow particles, shadows or 3D transforms to cause page-level horizontal scrolling.

## 9. Accessibility contract

Every component must be reviewed against its actual semantic purpose.

| Requirement | Acceptance rule |
|---|---|
| Name | Every interactive control has an accessible name |
| Role | Native HTML semantics are preferred; custom roles are accurate |
| Value/state | Checked, selected, expanded, current, invalid and disabled states are exposed |
| Focus | Focus is visible and not obscured by animation |
| Keyboard | Every primary action can be completed without a pointer |
| Overlay behavior | Focus enters, stays within and returns from modal overlays correctly |
| Live updates | Status is announced without excessive repeated announcements |
| Data visuals | Charts expose a concise summary and accessible underlying values |
| Canvas | Provide instructions and a non-canvas alternative for essential operations |
| Motion | Reduced-motion mode preserves functionality |
| Color | State and meaning do not rely on color alone |

## 10. Component API contract

Future component upgrades must document and preserve the following:

- Custom element tag and loading requirement.
- Supported attributes and default values.
- JavaScript properties and methods.
- Attribute-to-property synchronization behavior.
- Form association, submitted value, reset and disabled behavior where relevant.
- Custom events, event detail shape and dispatch timing.
- Keyboard and pointer interactions.
- Error, loading, empty, disabled and success states.
- Theme variables and slots.
- Cleanup behavior and limitations.

Events should be composed and bubble when they are intended for application integration. Do not silently rename or remove existing events or properties.

## 11. Performance budgets and guardrails

- Keep one shared page-level FX canvas.
- Reuse shared runtime scheduling rather than running idle animation loops.
- Pause or stop work when a component is not visible or connected.
- Cap device-pixel-ratio work and avoid rendering at unnecessary resolution.
- Avoid large synchronous DOM rebuilds on every animation frame.
- Batch canvas work and reuse objects where practical.
- Avoid uncontrolled particle growth and repeated allocation inside hot loops.
- Measure the Toggle sprite strategy and duplicated core payload before changing delivery format.
- Do not trade a visibly inferior animation for a smaller bundle without an explicit product decision.
- Avoid autoplaying media or downloading large media assets in a demo that is not actively being used.

## 12. Security and data rendering

- Escape untrusted text before inserting it into HTML.
- Prefer textContent for user-provided code, labels and data.
- Rich text must use a narrow allowlist sanitizer.
- Markdown preview must not execute raw HTML or unsafe links.
- External media URLs must be treated as application-supplied data, not trusted instructions.
- Never execute code entered into Copy Code or JSON Editor components.

## 13. Visual QA rules

Every component redesign must be inspected in:

1. Default state.
2. Hover and focus state.
3. Press/active state.
4. Selected/expanded state.
5. Disabled state.
6. Loading, empty, invalid and success states when applicable.
7. Reduced-motion mode.
8. Light and dark themes.
9. Narrow mobile width.
10. Keyboard-only interaction.

A design is not finished because the default screenshot looks good. The state transitions and edge cases are part of the design.

## 14. Quality gate

A component can be considered ready for the gallery only when:

- Its visual design matches the VFX system.
- Its animation has a clear purpose and component-specific identity.
- It reaches a stable final state and can be interrupted safely.
- It works with pointer, touch and keyboard as applicable.
- It supports reduced motion.
- It has correct accessible name, role, value and focus behavior.
- It handles empty, invalid, disabled and boundary states.
- It cleans up animation work and listeners.
- It has a responsive standalone demo.
- It has complete API, event and limitation documentation.
- Its browser interaction tests pass.
- It has been visually reviewed at desktop and mobile widths.

**No component should be added or marked complete on the basis of a click handler and a basic transition alone.**
