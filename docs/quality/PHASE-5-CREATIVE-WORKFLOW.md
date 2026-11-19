# Phase 5: creative-workflow controls

**Status:** Implementation and regression coverage added on \`main\`; automated workflow verification is pending  
**Scope:** Drag and Drop, Carousel, Timeline, Radial Menu and Image Cropper  
**Baseline:** Phase 1 component audit, animation design system and acceptance matrix  
**Compatibility:** Existing custom-element tags and established properties, methods and events are retained

## 1. Goals

Make the creative-workflow controls reliable when application data changes after construction, when users operate them without a pointer, and when components are repeatedly mounted and removed. Keep motion tied to committed actions and avoid adding dependencies or changing the shared animation runtime.

## 2. Component work

| Component | Phase 5 focus |
|---|---|
| Drag and Drop | Synchronize the \`items\` attribute and property, render a useful empty state, preserve keyboard focus after arrow-based reorder, and report committed order changes |
| Carousel | Rebuild on slide changes, clamp the active index, prevent invalid navigation for zero/one slide, add Home/End navigation, and keep inactive slides out of the focus order |
| Timeline | Synchronize milestone data, support object or pipe-delimited items, add roving keyboard focus and Home/End navigation, and safely handle empty data |
| Radial Menu | Synchronize action data, constrain focus to open actions, focus the first item on open, restore focus on dismissal, and support Home/End navigation |
| Image Cropper | Correct crop coordinate mapping, export the selected region from the loaded source at source-appropriate resolution, add keyboard movement/resizing, reject stale asynchronous loads, release object URLs and observers, and reconnect its resize observer |

## 3. Regression coverage

The browser suite adds Phase 5 checks for:

- Reorder events, dynamic list replacement, keyboard reorder and focus retention.
- Carousel index changes, dynamic slides, one-slide and empty states.
- Timeline programmatic selection, dynamic item replacement and empty state.
- Radial-menu focus entry/return, menu keyboard navigation and dynamic empty state.
- Local image decoding, keyboard crop movement/resizing, PNG dimensions and observer reconnect.

The existing whole-gallery checks remain enabled. The component registry and number of component types are unchanged.

## 4. Verification and sign-off

Automated checks are being run against the commit containing this report. The phase will be described as automated-verification complete only after the full Node/build checks, Chromium browser suite, GitHub Pages deployment, CodeQL and OSSF Scorecard finish successfully.

Manual visual review at mobile and desktop widths, keyboard-only review with a real browser, and screen-reader/assistive-technology review remain separate sign-off tasks. Automated assertions do not replace those reviews.

## 5. Boundaries

No new component types, dependencies, npm publishing settings, hosting providers or shared-runtime architecture are introduced. Existing public tags and event names remain unchanged. GitHub Pages remains the deployment target.
