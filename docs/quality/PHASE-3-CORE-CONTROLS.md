# Phase 3: core interface and feedback controls

**Status:** Implementation changes committed to the Phase 3 branch; automated validation and visual review are pending  
**Scope:** 18 core interface, form, selection, status and feedback components  
**Baseline:** Phase 1 component audit and acceptance matrix  
**Branch:** `phase-3/core-interface-controls`

## 1. Scope

Phase 3 addresses the following 18 existing components:

Select, Textarea, Number, Search, File Upload, Color Picker, Accordion, Segmented Control, OTP Input, Tag Input, Pagination, Alert, Skeleton, Badge, Avatar, Chip, Breadcrumb and Stepper.

The heavier navigation and overlay components, including Menu, Dialog, Drawer, Calendar, Date Picker, Command Palette, Context Menu and Combobox, remain outside this phase.

No new component types are introduced. Existing public tags and core interaction patterns are retained.

## 2. Implementation work

| Component | Phase 3 refinement |
|---|---|
| Select | Observe external value and disabled changes; keep displayed selection and form value synchronized |
| Textarea | Observe value, placeholder, rows, length, required and disabled attributes; synchronize form value and native validity |
| Number | Observe bounds, step, value, required and disabled changes; clamp values and expose validity through ElementInternals |
| Search | Observe value, disabled, label, placeholder and suggestion changes; refresh its combobox state |
| File Upload | Validate dropped and selected files against accept patterns and maximum size; observe accept, multiple and disabled changes |
| Color Picker | Observe value, disabled and label changes; keep native input, swatch and form value synchronized |
| Accordion | Enforce single-open behavior when the single attribute is enabled dynamically |
| Segmented Control | Observe value and disabled changes; clean up ResizeObserver on disconnect and reconnect it safely |
| OTP Input | Emit completion once for each completed code value instead of repeatedly on subsequent updates |
| Tag Input | Observe external value and presentation attributes; synchronize the entry field's disabled state |
| Pagination | Keep current page within updated page bounds and expose correct previous/next disabled state |
| Alert | Update tone semantics, live-region priority, title and dismiss control when attributes change |
| Skeleton | Expose loading state through aria-busy |
| Badge | Keep the visible status label synchronized when label changes |
| Avatar | Ignore stale image-error callbacks after the image source has been replaced |
| Chip | Keep the remove label and selected/disabled state synchronized with host attributes |
| Breadcrumb | Allow the navigation landmark label to be configured and updated |
| Stepper | Synchronize disabled form values, form reset and form-disabled callbacks |

## 3. Regression coverage

The browser suite now includes Phase 3 checks for:

- External value updates on Select, Segmented Control, Color Picker and Tag Input.
- Textarea required/value attribute synchronization.
- Number bound changes and clamping.
- File type rejection for unsupported dropped files.
- OTP completion de-duplication.
- Stepper disabled state.
- Pagination page-bound updates.
- Search suggestion updates.
- Badge label updates.
- Chip disabled state.
- Alert tone semantics and dynamic dismissal.
- Skeleton loading state.
- Breadcrumb landmark label updates.

The existing full-library browser suite remains in place.

## 4. Verification status

The source changes and browser regression assertions are committed on the Phase 3 branch. This report does not claim that the tests have passed.

The following are required before Phase 3 can be marked complete:

- [ ] Build check and generated standalone component consistency.
- [ ] Full Node validation suite.
- [ ] Headless Chromium browser suite, including new Phase 3 checks.
- [ ] GitHub Actions validation, deployment, CodeQL and OSSF Scorecard.
- [ ] Review and fix all failures before merge.
- [ ] Manual visual review at mobile and desktop widths.
- [ ] Keyboard and assistive-technology review.

## 5. Boundaries

This phase prioritizes state synchronization, form correctness, lifecycle cleanup and interaction reliability. It is not a claim that every one of these 18 components has received a complete visual redesign. Component-specific animation choreography and broader visual polish must be evaluated against the Phase 1 acceptance matrix without adding repetitive effects.

**Phase 3 remains in progress until automated workflows pass and the outstanding review items are completed.**
