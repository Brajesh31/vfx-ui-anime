# 🧪 Testing strategy

## Automated checks
Run `npm test`. The current validation script checks the presence of core project files, verifies all eleven custom-element registrations and confirms the reduced-motion hook exists.

## Manual smoke test
1. Serve the root directory over HTTP.
2. Open the gallery in a current Chromium-based browser.
3. Activate each button and confirm the component remains interactive.
4. Toggle state and verify the checked attribute.
5. Drag the slider and verify its output.
6. Submit and reset a sample host form when testing form-associated controls.
7. Navigate using keyboard only.
8. Enable the operating system's reduced-motion setting and confirm particle effects are suppressed.
9. Test at 320px, 768px and desktop widths.
10. Check the browser console for errors.

## Browser matrix

| Browser | Status |
|---|---|
| Chromium | Not yet formally certified |
| Firefox | Not tested |
| Safari macOS | Not tested |
| Safari iOS | Not tested |
| Chrome Android | Not tested |
| Screen readers | Not audited |

Do not convert this table to a passing matrix until the checks have actually been performed.

## Future automation
Add Playwright-based browser tests when a browser automation dependency and CI browser installation are intentionally introduced. The current project has no such dependency.
