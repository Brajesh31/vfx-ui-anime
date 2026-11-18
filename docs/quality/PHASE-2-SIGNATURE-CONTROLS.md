# Phase 2: original signature controls upgraded

**Status:** Implementation batch complete, pending CI verification  
**Scope:** The original 11 signature component types  
**Base commit:** \`98f00bea8aa26922863b34020ba9bdb32740fbb2\`  
**Phase 2 implementation commits:** \`baf3ecb6347cb0691b972faea236925e8381ea12\` plus the follow-up batch containing the remaining refinements and tests.

## 1. Scope

Phase 2 improves the original Button, Toggle, Slider, Checkbox, Radio, Input, Tabs, Progress, Rating, Toast and Tooltip. The original custom effects and visual identities remain the reference. No new component types were added. The shared \`core.js\` runtime was not changed, so the duplicated core blocks in the other 71 component files were not rewritten as part of this phase.

## 2. Changes made

| Component | Phase 2 work |
|---|---|
| Button | Guarded the primary impact method against disabled/secondary use; strengthened focus treatment; springs settle under reduced motion |
| Toggle | Added form reset, disabled-fieldset and state-restore callbacks; emits input and change; reduced motion completes the painted frame sequence immediately |
| Slider | Added form reset/disabled synchronization, required forwarding and accessible value text; reduced motion snaps the thumb and value bubble to the current value |
| Checkbox | Added form reset and disabled-fieldset synchronization; reduced-motion spring settlement |
| Radio | Added required-state exposure and form validity, reset and disabled-fieldset handling; label updates; reduced-motion spring settlement |
| Input | Added dynamic forwarding of common native validation/input attributes, ElementInternals validity synchronization, form reset/disabled/state restoration and a visible invalid state |
| Tabs | Added horizontal overflow support, stored ResizeObserver lifecycle with reconnect behavior and a resize fallback; reduced-motion indicator snapping |
| Progress | Added aria-valuetext, reduced-motion snapping, suppressed decorative canvas drawing and demo autoplay in reduced-motion mode |
| Rating | Added sequence tokens to ignore stale delayed star callbacks, form reset/disabled handling and reduced-motion state settlement |
| Toast | Added success/info/warning/error types, alert semantics for errors, show/hide events, sticky duration zero and inert/aria-hidden handling while hidden |
| Tooltip | Separated hover/focus/pinned states, corrected touch toggle behavior, added below-placement and scroll/resize repositioning, cleaned up global listeners and honored reduced motion |

## 3. API additions

All additions are backward-compatible with the existing documented methods and attributes.

### Toast

\`\`\`js
toast.show('Saved successfully', { type: 'success', duration: 2.6 });
toast.show('Network unavailable', { type: 'error', duration: 0 });
toast.hide();
\`\`\`

Supported types are \`success\`, \`info\`, \`warning\` and \`error\`. The \`type\` attribute supplies the default. Passing \`0\` for duration keeps the message open until explicitly hidden.

Events:

- \`show\`: \`event.detail\` includes \`message\` and \`type\`.
- \`hide\`: \`event.detail\` includes \`type\`.

### Input

The custom input forwards \`required\`, \`readonly\`, \`minlength\`, \`maxlength\` and \`pattern\`, and dynamically synchronizes \`type\`, \`autocomplete\`, \`placeholder\`, \`label\` and \`value\`.

It exposes \`validity\`, \`validationMessage\`, \`checkValidity()\`, \`reportValidity()\` and \`setCustomValidity(message)\`.

### Radio

The required state is exposed on the radiogroup and through form-associated validity. \`checkValidity()\` and \`reportValidity()\` delegate to \`ElementInternals\`.

### Toggle and form controls

The form-associated signature controls now reset to their initial attribute state and respond to form-disabled callbacks. Toggle also emits both \`input\` and \`change\` on a user flip.

## 4. Regression tests added

The browser test runner now includes additional checks for:

- Form reset across Checkbox, Toggle, Slider, Rating, Input and Radio.
- Required/email validation on Input.
- Required-state announcement on Radio.
- Slider input-event propagation.
- Rating stale-animation cancellation after a fast new selection.
- Tabs ResizeObserver cleanup and reconnection.
- Toast error semantics, lifecycle events and hidden-state inertness.
- Tooltip touch toggling while the trigger remains focused.
- Protection against invoking the primary Button impact sequence on the secondary variant.

The existing end-to-end checks for all 82 registered component tags, mobile touch, keyboard interaction, form serialization and gallery overflow remain in the test runner.

## 5. Verification status and boundaries

The implementation has been committed to \`main\`. The repository's Validate workflow is the source of truth for the browser regression suite, Pages deploy and CodeQL/Scorecard workflows. The phase should only be marked fully verified once those runs complete successfully.

This pass includes headless Chromium automation, not a human visual review or manual assistive-technology certification. Safari, Firefox and real screen-reader testing remain outstanding. Those limitations should not be hidden behind a passing Chromium test.

## 6. Phase 2 exit criteria

- [x] All 11 original signature components updated.
- [x] Original Button/Toggle/Slider/Checkbox/Radio/Progress/Rating/Toast/Tooltip motion identities retained.
- [x] Form reset and disabled lifecycle improved where applicable.
- [x] Reduced-motion handling extended to every signature component.
- [x] Animation race and observer cleanup fixes added.
- [x] Toast and Input APIs documented.
- [x] Browser regression tests added.
- [x] README and llms.txt updated.
- [ ] Validate workflow, including browser tests, completes successfully.
- [ ] Visual review at desktop/mobile widths and manual screen-reader testing.

**Phase 2 implementation is complete. Final verification is pending the workflow result. Phase 3 has not started.**
