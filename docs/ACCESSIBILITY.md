# ♿ Accessibility and compatibility

## Implemented in the current source

- Native button, checkbox, radio, range and text input elements are used internally where practical.
- Focusable controls retain native browser keyboard behavior where native elements are used.
- Switch state is exposed with `role="switch"` and `aria-checked`.
- Progress exposes current and min/max values.
- `<vfx-tabs>` exposes a named tablist, tabs and linked tabpanels. Each tab has `aria-controls`, and its panel points back with `aria-labelledby`.
- Inactive tabpanels are hidden. The active panel is keyboard-focusable, and panel content is supplied through named slots that match tab labels.
- Horizontal tabs support Left/Right Arrow keys. Vertical tabs support Up/Down Arrow keys. Both orientations support Home and End.
- `<vfx-radio>` uses native radio inputs with a per-instance group name when no name is supplied. Browser-native radio keyboard behavior is retained within the group.
- `<vfx-tooltip>` connects its focusable trigger to the tooltip description with `aria-describedby`.
- Tooltip can appear through keyboard focus and can be dismissed with Escape.
- Toast uses a polite live status region.
- Canvas is marked `aria-hidden="true"` and does not capture pointer input.
- Canvas particles are disabled when `prefers-reduced-motion: reduce` is active.

The automated Chromium interaction suite exercises the tab, radio and tooltip behaviors listed above. These implementation details and passing browser assertions are not a claim of formal WCAG conformance or completed assistive-technology testing.

## Known gaps and constraints

- `<vfx-tabs>` creates the tabpanel wrappers and relationships, but the host must provide meaningful panel content using child elements whose `slot` name exactly matches a tab label. A tab without matching content has an empty panel.
- Radio labels are supplied as comma-separated options, so commas cannot appear inside an option label.
- Custom form-associated controls depend on `ElementInternals` support. Form submission, required validity, reset and disabled-fieldset behavior must be tested in target browsers.
- `<vfx-input>` does not proxy the complete native constraint-validation API.
- Tooltip placement responds to viewport space, clamps horizontally and recalculates after resize/scroll. Explicit `top` or `bottom` placement is available.
- The fixed canvas can overlap dialogs and sticky UI visually.
- No formal screen-reader audit has been completed.
- Cross-browser and real-device testing has not yet been completed.

## Release QA checklist

- [ ] Keyboard-only navigation through all controls.
- [ ] Tabs: Left/Right Arrow keys in horizontal orientation.
- [ ] Tabs: Up/Down Arrow keys in vertical orientation.
- [ ] Tabs: Home and End keys, selection event, `aria-controls`/`aria-labelledby` references, and active/inactive panel visibility.
- [ ] Tabs: confirm each named slot matches its label and that focus can move from the tablist into the active panel.
- [ ] Radio groups: Tab entry, arrow-key selection, Space activation and independent groups.
- [ ] Radio groups: configured name, required state, disabled state and form reset.
- [ ] Tooltips: verify `aria-describedby` announces the hint on focus.
- [ ] Tooltips: verify Escape dismissal and reappearance after pointer leave/refocus.
- [ ] Tooltips: test auto-flip near the top/bottom edges, horizontal clamping near both sides, resize and scroll.
- [ ] NVDA + Firefox and Chrome.
- [ ] VoiceOver + Safari on macOS and iOS.
- [ ] TalkBack + Chrome on Android.
- [ ] Reduced-motion enabled and disabled.
- [ ] 200% zoom and narrow viewport.
- [ ] Form submit, reset, disabled fieldset and required states.
- [ ] Dialog, popover and sticky-header stacking behavior.

Do not describe the project as fully accessible until these checks are completed and gaps are addressed.
