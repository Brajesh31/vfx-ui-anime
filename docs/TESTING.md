# 🧪 Testing strategy

## Static validation

Run `npm run check` or `npm test`. The repository validation script checks:

- Required repository paths and the fifteen component folders.
- Presence of an implementation, demo, and README in every component folder.
- Gallery script references and custom-element registration.
- Registry count, runtime references, and third-party branding removal from the public gallery.
- Required reduced-motion support markers and gallery links.

A successful static check does not prove visual fidelity, browser compatibility, keyboard usability, form submission, or assistive-technology support.

## Automated Chromium interaction tests

Run `npm run test:browser`. This starts a small local HTTP server, launches an installed Chromium executable in headless mode, and reads the structured test report from the test page. The runner uses Node's built-in modules and does not add a browser automation dependency to the production runtime.

The current browser page checks:

- Registration of all fifteen `vfx-*` custom elements.
- Tabs: Right Arrow moves to the next option and updates the selected index and value.
- Segmented: selecting an option emits a `change` event containing its value.
- Like: activation toggles its pressed state and updates `aria-pressed`.
- Accordion: the disclosure trigger and region have linked accessible IDs, and opening updates `aria-expanded`.
- Notification: activation clears the unread count and hides its badge.

These checks cover only the assertions listed above. They do not exercise every animation frame, every component API, real form submission for all controls, screen-reader announcements, or all keyboard paths.

## Manual smoke test

1. Serve the repository root over HTTP with `python3 -m http.server 8000`.
2. Open the gallery at `http://localhost:8000/`.
3. Try both Button variants. Confirm the press squash, impact frame, burst, smoke, lettering, and success check.
4. Flip Toggle on and off. Confirm the full painted transition plays in both directions.
5. Drag Slider at different speeds and test its release effect.
6. Check and uncheck Checkbox. Confirm its tick animation and off-state puff.
7. Select each Radio option and confirm the selected value.
8. Focus Input, type several characters, and confirm caret-relative effects appear.
9. Change Tabs by click and keyboard. Remember that the component does not create or manage the content panels.
10. Let Progress run, then connect it to a real task using `.set()`. Verify the `vfx:done` event.
11. Select Rating values, show and dismiss Toast, and test Tooltip using mouse, keyboard focus, touch, and Escape.
12. Test Like, Accordion, Segmented, and Notification. These four controls require `core.js`.
13. Enable the operating system's reduced-motion setting and confirm decorative effects are suppressed or reduced.
14. Test at 320px, 768px, and desktop widths.
15. Check the browser console for runtime errors.

## Cross-browser workflow and browser matrix

The GitHub Actions validation workflow is configured to run the same interaction fixture in Chromium, Firefox, and WebKit. It installs Playwright and the Firefox/WebKit browser binaries temporarily in CI; these are test-only tools, not production dependencies. Check the latest workflow run before reporting a pass. WebKit is an engine-level signal, not proof of parity with Safari on macOS or iOS.

| Browser | Automation configuration | Manual / assistive-technology audit |
|---|---|---|
| Chromium | Headless interaction suite via `npm run test:browser` | Must be run and recorded separately |
| Firefox | Headless interaction suite via `npm run test:cross-browser` in CI | Not verified |
| WebKit engine | Headless interaction suite via `npm run test:cross-browser` in CI | Not equivalent to Safari certification |
| Safari macOS / iOS | Not included in the automated workflow | Not tested |
| Chrome Android | Not tested | Not tested |
| Screen readers | Not automated | Not audited |

Do not claim full browser compatibility, screen-reader interoperability, or WCAG conformance based only on automated assertions. Record actual workflow results and manual test environments before making those claims.
