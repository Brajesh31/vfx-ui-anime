# Phase 6: workflow, data and creative controls

**Status:** Implementation and regression coverage added on `main`; automated workflow verification is pending  
**Scope:** Kanban, Data Grid, Tree View, Signature Pad and Before & After  
**Baseline:** Phase 1 component audit, animation design system and acceptance matrix  
**Compatibility:** Existing custom-element tags and established public methods/events are retained

## 1. Goals

Improve reliability when workflow data changes after construction, keep complex controls operable without a pointer, and ensure media/canvas interactions degrade safely. Preserve the existing VFX UI Anime visual language and dependency-free custom-element architecture.

## 2. Component work

| Component | Phase 6 focus |
|---|---|
| Kanban | Rebuild lane/card views on live attribute updates, normalize lane/card data, guard duplicate ids, preserve lane counts, and render useful empty states |
| Data Grid | Rebuild column headers on live column changes, synchronize row/page-size attributes, prune stale selections, and keep paging/select-all state consistent |
| Tree View | Normalize duplicate/missing/cyclic hierarchy data, keep focus on visible nodes, repair Right Arrow child focus, and cover empty/property replacement |
| Signature Pad | Add keyboard pen drawing and visible instructions, coordinate pointer strokes safely, and make undo/clear/export state predictable |
| Before & After | Synchronize sources and labels, report load/error outcomes, restore placeholders when sources are removed or fail, and clamp programmatic split values |

## 3. Browser regression coverage

The browser suite adds checks for:
- Kanban move/add events, duplicate-id rejection, lane/card replacement and empty states.
- Data Grid page navigation, selection events, dynamic header rebuilding, row replacement, stale selection pruning and empty data.
- Tree View Right Arrow first-child focus, keyboard selection, empty data and object-property replacement.
- Signature Pad keyboard drawing, PNG export, undo and clear behavior.
- Before & After value/label synchronization, asynchronous local image loading and placeholder restoration.

The existing full-gallery interaction suite and the 390 px horizontal-overflow check remain enabled.

## 4. Verification and sign-off

Automated workflow verification is pending. The phase will be marked automated-verification complete only after Node/build validation, the full Chromium suite, GitHub Pages deployment, CodeQL and OSSF Scorecard finish successfully on the final Phase 6 commit.

Manual visual review at desktop and mobile widths, keyboard-only review with a real browser, and screen-reader/assistive-technology review remain separate sign-off tasks.

## 5. Boundaries

No new component types, dependencies, publishing settings, hosting providers or shared-runtime architecture are introduced. Existing public component tags remain unchanged. GitHub Pages remains the deployment target.
