# ♿ Accessibility guide

VFX UI Anime uses browser-native custom elements and aims to keep the underlying interaction understandable without depending on decorative animation. This guide explains the accessibility behavior built into the components and the verification still required before a release.

## Core principles

- Use native HTML controls where they match the component's purpose.
- Expose accessible names, roles, values and state for interactive controls.
- Keep keyboard operation available for primary actions.
- Keep focus visible and restore focus after dismissing modal or popover workflows where appropriate.
- Treat reduced-motion preferences as a functional mode, not only a CSS preference.
- Keep user-provided text and editor input out of executable HTML.
- Preserve reading order and form semantics.
- Clean up listeners, observers, timers and animation work when components disconnect.

The shared visual and interaction requirements are detailed in [the animation design system](quality/ANIMATION-DESIGN-SYSTEM.md). Exact attributes, methods, event details and known limitations belong to each component's local README.

## Keyboard behavior

The component library includes these keyboard patterns where relevant:

| Pattern | Expected behavior |
|---|---|
| Native buttons and toggles | Enter and Space activate once |
| Selectable groups | Arrow keys move/choose according to the component's documented interaction model |
| Tabs and view switchers | Arrow Left/Right, Home and End move between tabs where supported |
| Menus and command controls | Escape dismisses; arrow keys move through actions; Enter commits a choice |
| Dialogs and drawers | Focus moves into the modal surface and returns to the invoking control on dismissal |
| Data/tree controls | Arrow keys navigate visible rows/nodes; Home/End move to boundaries where supported |
| Sliders and split panes | Arrow keys adjust values in documented increments; Home/End apply bounds where supported |
| Editors | Native text editing remains available; toolbar/view tabs expose their documented keyboard controls |

Not every component has every pattern. Check the component's own README instead of assuming a global shortcut contract.

## Focus and semantics

Review:
- Accessible names on icon-only or visually abbreviated controls.
- `aria-pressed`, `aria-expanded`, `aria-selected`, `aria-current`, `aria-invalid`, `aria-disabled` and value text where applicable.
- Correct tab-to-panel relationships.
- Logical focus order and no keyboard trap outside expected modal behavior.
- Focus restoration after closing dialogs, drawers, lightboxes and guided workflows.
- Inactive content hidden from the accessibility tree when it should not be read or operated.
- Duplicate marquee content kept inert and hidden from assistive technology.

## Forms and validation

Where a component participates in a form, review:
- Name/value serialization.
- Required and invalid state.
- Native or ElementInternals validity.
- Disabled and disabled-fieldset behavior.
- Reset to the configured default value.
- No stale value after dynamic attribute/property updates.

Not every visual control is a form control. The component README documents its actual form behavior and limitations.

## Motion and visual presentation

All nonessential animation should respect `prefers-reduced-motion: reduce`. The final state and information must remain available without waiting for a transition to finish. Review both initial reduced-motion preference and a preference change while the page is running.

Visual QA should include:
- Default, hover, focus-visible, active, selected and disabled states.
- Invalid, empty, loading and success states where relevant.
- Light and dark/custom theme configurations supported by the component.
- 390 px, 768 px and desktop widths.
- Text zoom and high-contrast settings where available.
- Focus indicator contrast against both the control and surrounding surface.

## Safe content

- Markdown preview creates DOM elements and text nodes rather than interpreting raw HTML.
- JSON and code display render source as text; they do not execute user-entered content.
- Rich Text Editor sanitizes HTML to its documented allowlist.
- Marquee clones remove duplicate IDs and keep cloned interactive descendants inert.
- Labels and data values should be written as text, not passed to unsafe HTML sinks.

## Running automated browser checks

From the repository root:

```bash
npm test
npm run check
python3 -m http.server 8000
```

In a second terminal:

```bash
npm run test:browser
```

The browser test runner uses Chromium through the Chrome DevTools Protocol, emulates a narrow touch viewport, tests keyboard and form interactions, and checks the 390 px horizontal-overflow guard. It throws on page-side Runtime.evaluate exceptions rather than silently converting them to undefined values.

## Manual release review checklist

Automated tests do not replace a human accessibility review. Before a public release, test:

- [ ] Keyboard-only use in a real desktop browser.
- [ ] Screen-reader announcements and accessible tree in at least one desktop screen reader.
- [ ] Focus entry, movement, containment and restoration for overlays.
- [ ] Form error and success announcements.
- [ ] Reduced-motion behavior before load and after runtime preference changes.
- [ ] Contrast, focus indicators, text zoom and narrow viewports.
- [ ] Touch gestures without scroll hijacking or inaccessible drag-only workflows.
- [ ] Current Chromium, Firefox and Safari behavior.

## Current evidence and limitations

The integrated Chromium suite passed on candidate commit `dd4be3b0f716172aa0a3a48157c83cd1d91ae380`, including the current component regressions and mobile-width overflow guard. See [QUALITY-AND-RELEASE.md](QUALITY-AND-RELEASE.md) for the exact workflow links and remaining gates.

No claim of manual screen-reader certification or full WCAG conformance is made. Those reviews must be performed and recorded separately.
