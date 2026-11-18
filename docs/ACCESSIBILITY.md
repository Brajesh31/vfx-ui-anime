# ♿ Accessibility and compatibility

This page describes the accessibility behaviour implemented in the current component source. It is not a claim of WCAG conformance or completed assistive-technology certification.

## Implemented semantics

### Eleven standalone animated controls

- **Button:** renders a native button in Shadow DOM. The text in its default slot provides the visible and accessible label. Native button keyboard activation is retained.
- **Toggle:** renders a button with `role="switch"`, an accessible label, and an `aria-checked` state.
- **Slider:** renders a native `input type="range"` with an accessible label and native range keyboard behaviour.
- **Checkbox:** renders a native checkbox inside a label. The text in the default slot labels the control.
- **Radio:** renders native radio inputs in a labelled `radiogroup`. Child `option` elements provide the choices. Native radio keyboard behaviour is retained.
- **Input:** renders a native text-like input with an `aria-label`, placeholder, and supported autocomplete value.
- **Tabs:** renders a labelled `tablist` containing buttons with `role="tab"`, `aria-selected`, and roving tab index. Left/Right Arrow keys move between tabs. Home and End move to the first/last tab.
- **Progress:** exposes `role="progressbar"`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow`, and an accessible label.
- **Rating:** renders a labelled `radiogroup` with five radio-role buttons, `aria-checked`, accessible star labels, and arrow-key selection.
- **Toast:** exposes the message through a `role="status"` region and provides a labelled close button.
- **Tooltip:** renders a `role="tooltip"` element connected to its trigger by `aria-describedby`. It can open on hover, focus, and tap, and Escape dismisses it.

### Four additional VFX UI Anime controls

- **Like:** uses a native button with `aria-pressed` to expose the pressed state.
- **Accordion:** uses a native button with `aria-expanded` and `aria-controls`. Its panel is a `role="region"` labelled by the trigger.
- **Segmented:** exposes a labelled `radiogroup` containing radio-role buttons with `aria-checked`, roving tab index, arrow-key navigation, and Home/End support.
- **Notification:** uses a native button with an accessible label that includes the unread count. The decorative bell SVG is hidden from assistive technology.

## Decorative effects and motion

- Animation canvases and decorative SVG artwork are marked `aria-hidden="true"`.
- Canvas effects do not receive pointer input.
- The eleven standalone animated controls check `prefers-reduced-motion` in their embedded effect runtime.
- The four additional controls include reduced-motion CSS rules for their transitions and decorative motion.
- The animation layer is supplementary. Do not use it as the only way to communicate success, error, selection, or progress.

## Known gaps and constraints

- **Tabs does not manage panels.** It renders the tab list only. It does not create `tabpanel` elements, set `aria-controls`, or connect external panel content. The host application must show the matching content and provide its own accessible relationships.
- **Radio reads its child `option` elements once when it connects.** Replace the element to change its option list after connection.
- **Input has limited native validation parity.** It does not pass through the complete native constraint-validation API or provide invalid-state styling.
- **Rating is always five whole stars.** It does not support half-stars or a configurable maximum.
- **Tooltip always opens above its trigger.** It does not flip to another side when there is insufficient room.
- **Notification clears the unread count when its button is activated.** It does not provide a full notifications menu or announcement queue.
- **Canvas layers can visually overlap dialogs, sticky headers, and other overlays.**
- **Form behaviour varies by component.** Test actual submission, reset, disabled, and required states in the browsers your application supports.
- No completed screen-reader audit is recorded in this repository.

## Release QA checklist

- [ ] Keyboard-only navigation through all controls.
- [ ] Verify Toggle exposes its current switch state.
- [ ] Verify Checkbox and Radio expose native checked state.
- [ ] Verify Slider can be changed with keyboard and touch.
- [ ] Verify Tabs arrow-key navigation, Home/End, and host-managed panel changes.
- [ ] Provide accessible panel headings and relationships for Tabs in the host application.
- [ ] Verify Rating radio semantics and keyboard selection.
- [ ] Verify Progress value changes are announced appropriately for the product context.
- [ ] Verify Toast status announcements and close-button name.
- [ ] Verify Tooltip description is announced on focus and Escape dismisses it.
- [ ] Verify Accordion expanded state and trigger/panel relationships.
- [ ] Verify Segmented selection and keyboard navigation.
- [ ] Verify Like pressed state and Notification accessible count label.
- [ ] Test reduced-motion enabled and disabled.
- [ ] Test at 200% zoom and narrow viewports.
- [ ] Test form submission, reset, required state, and disabled fieldsets where applicable.
- [ ] Test with NVDA, VoiceOver, and TalkBack on their supported browser/platform combinations.
- [ ] Test dialog, popover, and sticky-header stacking behaviour.

Do not describe the project as fully accessible until these checks are completed and any discovered gaps are addressed.
