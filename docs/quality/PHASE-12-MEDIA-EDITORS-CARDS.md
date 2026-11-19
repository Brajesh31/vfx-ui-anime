# 🎬 Phase 12: Media, Editors, and 3D Cards

**Scope:** Video Player, Markdown Editor, JSON Editor, 3D Tilt Card, and 3D Flip Card.  
**Target branch:** `main`  
**Pull requests:** None. All changes were committed directly to `main`.

## 🎯 Upgrade summary

| Component | Changes |
|---|---|
| Video Player | Split native `loadedmetadata` and `durationchange` into distinct custom events, reflected `loop` and normalized `preload` properties, kept the muted attribute synchronized with the media element, added seek `aria-valuetext`, track-specific label updates, fullscreen pressed-state semantics, and reconnect-safe document fullscreen listener cleanup. |
| Markdown Editor | Added explicit tab/panel relationships, active panel labelling, hidden preview accessibility state, and same-valued property assignment handling so applications can restore text even after the editor content changes. Existing DOM-node rendering and protocol checks remain in place. |
| JSON Editor | Added an accessible, focusable preview region and action names. Fixed the same-valued `value` property reset edge case. Invalid JSON remains visible as source text and is never rendered as executable markup. |
| 3D Tilt Card | Reworked the compact component implementation for maintainability, added dynamic `title` and `description` synchronization, safe text assignment, neutral reset behavior, pointer bounds checks, touch guard, and reduced-motion handling. |
| 3D Flip Card | Added live front/back content properties, reflected `flipped` state, accessible pressed state and next-face action name, hidden inactive face, keyboard-native button activation, and reduced-motion transition support. |

## 🧱 Behavior and safety details

- Video media lifecycle events now mirror their respective native event types. A duration change is not reported as a second metadata-loaded event.
- Video mute actions update both the native media element and the host's reflected `muted` attribute. Reconnection therefore does not unexpectedly restore stale mute state.
- Fullscreen state is observed at the document level only while the player is connected. The listener is removed on disconnect and restored on reconnect. Fullscreen events are emitted only when this player's own fullscreen state changes.
- Markdown preview continues to construct headings, lists, paragraphs, code, blockquotes, and links using DOM nodes and text nodes. Raw HTML remains inert text. Unsupported link protocols are not made clickable; external web links retain `noopener noreferrer`.
- Markdown view tabs expose `aria-selected`, `aria-controls`, a labelled tab panel, roving tab focus, and Arrow/Home/End keyboard navigation.
- JSON values are parsed with `JSON.parse` and previewed with `textContent`. Formatting/minifying invalid source is rejected without discarding the user's text.
- JSON's `required` setting validates blank editor content, but the component remains intentionally non-form-associated.
- Tilt transforms are based on clamped pointer coordinates. Touch pointer movement is ignored, zero-sized elements are guarded, and reduced-motion preferences suppress pointer-driven tilt.
- Flip Card uses a native button. The inactive face is hidden from the accessibility tree, while the button exposes a pressed state and a name describing the face that will be shown next.

## 📚 Supporting repository changes

- Expanded the API, behavior, event, accessibility, and limitation references for all five components.
- Replaced all five minimal demos with responsive, working examples.
- The Video Player demo records a short canvas animation locally through `MediaRecorder`. It does not depend on an externally hosted video file. Browser support for canvas capture and WebM recording is required.
- The Markdown Editor demo demonstrates writing and preview modes, supported Markdown syntax, and safe rendering.
- The JSON Editor demo demonstrates live parsing, formatted preview, pretty-printing, and minification.
- The Tilt Card demo demonstrates pointer-driven motion and dynamic text updates.
- The Flip Card demo demonstrates click/keyboard activation and programmatic face selection.
- Updated gallery examples/descriptions, component registry descriptions, and `llms.txt`.
- Updated the root README phase record and progress counters.
- Added dedicated Phase 12 Chromium browser regression coverage in `tools/test.mjs`.
- No dependencies, package metadata, shared core implementation, or unrelated component folders were changed.

## 🧪 Automated regression coverage added

**Video Player**
- Creates a short local WebM clip inside the browser test using canvas capture and `MediaRecorder`.
- Verifies the accessible label, default and normalized preload state, loop, metadata/duration events, and enabled seek control.
- Checks seek clamping, poster/label updates, preload/loop reflection, mute attribute synchronization and custom volume event detail.
- Exercises disabled play/seek behavior, source removal, and fullscreen listener teardown/reconnect.

**Markdown Editor**
- Verifies text-only rendering of markup-like input and rejects a JavaScript URL as a clickable link.
- Checks external-link protections and DOM node output.
- Verifies same-valued property assignment restores editor content and preview.
- Checks input/change event details, tab/panel relationships, mode switching, keyboard tab navigation, read-only and disabled states.

**JSON Editor**
- Checks initial valid/required state, formatting, minification, invalid-source feedback and `aria-invalid`.
- Verifies same-valued property reset behavior and that HTML-like JSON string values stay inert text.
- Checks required whitespace, read-only behavior, and disabled editor/action controls.

**3D Tilt Card**
- Checks initial and dynamic text, safe text rendering, pointer-driven tilt, neutral reset, touch guard, and reduced-motion suppression.

**3D Flip Card**
- Checks click and keyboard activation, reflected pressed state, next-face accessible name, inactive-face hiding, live front/back content, property/attribute state, duplicate-event prevention, and reduced-motion behavior.

## ✅ Static verification performed

The following source-level checks were performed against the committed repository contents:

- All five modified component source files parse as JavaScript.
- Each component's embedded shared-runtime block matches the current `core.js` source.
- The Phase 12 async browser-regression block parses as JavaScript.
- All five standalone demo inline scripts parse as JavaScript.
- `registry.json` parses as valid JSON and retains 82 component entries, including all five Phase 12 components.

These checks verify syntax, generated-runtime consistency for the modified components, and registry structure. They do **not** execute DOM interactions, decode/play media, or establish a passing Chromium run.

## ⚠️ CI verification status

The repository's push workflows are configured to run repository validation/Chromium tests, GitHub Pages deployment, CodeQL, and OpenSSF Scorecard. The connected GitHub interface available during this implementation did not expose the push-triggered workflow run records or job output, so I cannot verify the result of those four workflows.

The combined commit-status endpoint has historically returned two Vercel integration failures linking to Vercel's `build-rate-limit` page. Those Vercel statuses are separate from GitHub Actions and do not prove either a pass or a failure for the repository's validation, Pages, CodeQL, or Scorecard workflows.

**CI sign-off remains unverified.** Review the latest push on the [GitHub Actions page](https://github.com/Brajesh31/vfx-ui-anime/actions) before treating this phase as release-verified. The committed tests and static syntax checks must not be interpreted as a completed browser test run.

## ⚠️ Manual sign-off still required

Manual visual review across desktop and mobile viewports, keyboard-only testing with a human tester, and screen-reader testing remain outstanding. Particular review areas include video fullscreen behavior on supported and restricted browsers, screen-reader tab/panel announcements, long/invalid JSON feedback, and the 3D face announcement in more than one screen reader.

## Known limits

- Video codec availability, remote media access, autoplay policy, and fullscreen support are controlled by the browser and hosting environment. The component has no playlist, volume slider, playback-rate control, or built-in caption-track management.
- The Markdown renderer is intentionally a safe subset, not full CommonMark. Tables, images, raw HTML, task-list semantics, and nested-list edge cases are not implemented.
- JSON validation checks JSON syntax and the optional non-empty rule. It does not validate a domain schema or make the component form-associated.
- Tilt Card is a decorative pointer effect, not an interactive control. It has no keyboard tilt mode or motion telemetry API.
- Flip Card is text-based and does not provide arbitrary front/back slots, deck management, or persistence.
