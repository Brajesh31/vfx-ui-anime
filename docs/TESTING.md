# 🧪 Testing strategy

## Automated checks

Run `npm test` or `npm run check`. The current validation script performs static checks:
- Required repository paths and all eleven custom-element registrations.
- Gallery script registration and the shared reduced-motion hook.
- Required implementation hooks for tab keyboard navigation and linked tabpanels, radio group state/form integration, and tooltip accessible description/viewport behavior.

The script also asks Node to syntax-parse the runtime JavaScript files. The feature assertions inspect source text. These checks do not instantiate the components, simulate keyboard input, submit forms, run a browser, or validate accessibility-tree output. A passing static check is not a browser interaction test.

## Automated Chromium interaction tests

Run `npm run test:browser`. This starts a small local HTTP server using Node's built-in modules, launches an installed Chromium executable in headless mode, and reads a structured test report from the page. No browser automation package or runtime dependency is added to the project.

The browser suite exercises:
- Tabs: generated tab/tabpanel IDs, reciprocal `aria-controls` and `aria-labelledby` references, named-slot assignment, active/inactive visibility, click activation, horizontal and vertical keyboard navigation, focus movement, programmatic selection and per-instance ID uniqueness.
- Radio groups: native input configuration, required validity, selected form values in `FormData`, form reset, disabled state and independent groups.
- Tooltips: `aria-describedby`, keyboard focus visibility, Escape dismissal, reopening, live text updates, automatic placement and horizontal viewport bounds.

The GitHub validation workflow runs the same nine interaction checks in Chromium, Firefox and WebKit. The Firefox and WebKit runner uses a temporary Playwright installation in CI only; it is not a project runtime or saved development dependency. WebKit is an engine-level compatibility signal, not proof of parity with shipping Safari on macOS or iOS. These tests do not prove screen-reader interoperability or full WCAG conformance.

## Firefox and WebKit compatibility suite\n\nAfter installing the temporary test-only tooling and browser binaries, run `npm run test:cross-browser`. The runner launches Firefox and WebKit headlessly and executes the same component interaction page used by Chromium.\n\nFor local execution, install the test tool without changing project manifests: `npm install --no-save --no-package-lock playwright`, then run `npx playwright install firefox webkit`, followed by `npm run test:cross-browser`. This is optional QA tooling, not a production dependency.\n\nThe WebKit result must not be described as a completed Safari macOS/iOS test. Safari still requires real Safari runs on Apple platforms, including VoiceOver checks.\n\n## Manual smoke test

1. Serve the repository root over HTTP.
2. Open the gallery in a current Chromium-based browser.
3. Activate each button and confirm the component remains interactive.
4. Toggle state and verify the checked attribute.
5. Drag the slider and verify its output.
6. Submit and reset a sample host form when testing form-associated controls.
7. For horizontal tabs, use Left/Right Arrow keys, Home and End. Confirm focus and selected state stay synchronized. Check each tab `aria-controls` against a panel ID in the same shadow root, and each panel `aria-labelledby` against its tab ID.
8. For vertical tabs, use Up/Down Arrow keys, Home and End. Confirm the active panel is visible and every inactive panel is hidden. Tab from the selected tab into the panel and verify its named-slot content is available.
9. For radio groups, test Tab entry, arrow-key selection, Space activation, independent groups and the configured `name`.
10. Test radio `required` and `disabled` attributes and properties, reset, restored state and disabled-fieldset behavior inside a form.
11. Focus a tooltip trigger and confirm its `aria-describedby` ID resolves to the tooltip element in the same shadow root.
12. Press Escape to dismiss a focused/hovered tooltip, then move the pointer away and refocus to confirm it can appear again.
13. Test automatic top/bottom placement near viewport edges and horizontal clamping near both screen edges; resize and scroll while it is visible.
14. Change the tooltip `text` attribute after connection and verify the description updates.
15. Enable the operating system's reduced-motion setting and confirm particle effects are suppressed.
16. Test at 320px, 768px and desktop widths.
17. Check the browser console for errors.

## Browser matrix

| Browser | Automated interaction suite | Manual / assistive-technology audit |
|---|---|---|
| Chromium | 9 headless interaction checks in GitHub Actions | Not formally certified |
| Firefox | 9 headless interaction checks in GitHub Actions | Not formally certified |
| WebKit engine | 9 headless interaction checks in GitHub Actions | Not equivalent to Safari certification |\n| Safari macOS | Not tested | Not tested |
| Safari iOS | Not tested | Not tested |
| Chrome Android | Not tested | Not tested |
| Screen readers | Not automated | Not audited |

Keep these statuses honest. A passing Chromium suite is not a substitute for manual keyboard review, browser compatibility checks or testing with NVDA, VoiceOver and TalkBack.
