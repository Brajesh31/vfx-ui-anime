# ♿ Accessibility and compatibility

## Implemented
- Native button, checkbox, range and text input elements are used internally where practical.
- Focusable controls retain browser keyboard behavior.
- Switch state is exposed with `role="switch"` and `aria-checked`.
- Progress exposes current and min/max values.
- Tooltip can appear through keyboard focus.
- Toast uses a polite live status region.
- Canvas is marked `aria-hidden="true"` and does not capture pointer input.
- Canvas particles are disabled when `prefers-reduced-motion: reduce` is active.

## Known gaps
- Custom form-associated controls use ElementInternals opportunistically, but reset, disabled-state propagation, validity and fallback behavior are not complete.
- The radio wrapper does not currently implement the full arrow-key behavior of a native radio group.
- Tabs do not yet implement linked tabpanels, roving keyboard navigation or full ARIA relationships.
- Tooltip placement does not account for viewport edges.
- The fixed canvas can overlap dialogs and sticky UI visually.
- No formal screen-reader audit has been completed.
- Cross-browser and real-device testing has not yet been completed.

## Release QA checklist
- [ ] Keyboard-only navigation.
- [ ] NVDA + Firefox and Chrome.
- [ ] VoiceOver + Safari on macOS and iOS.
- [ ] TalkBack + Chrome on Android.
- [ ] Reduced-motion enabled and disabled.
- [ ] 200% zoom and narrow viewport.
- [ ] Form submit, reset, disabled and required states.
- [ ] Dialog, popover and sticky-header stacking behavior.

Do not describe the project as fully accessible until these checks are completed and gaps are addressed.
