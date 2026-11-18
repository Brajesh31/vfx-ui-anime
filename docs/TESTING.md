# 🧪 Testing strategy

## Automated checks

Run `npm test` or `npm run check`. The current validation script performs static checks:
- Required repository paths and all eleven custom-element registrations.
- Gallery script registration and the shared reduced-motion hook.
- Required implementation hooks for tab keyboard navigation and radio group state/form integration.

The script also asks Node to syntax-parse the runtime JavaScript files. The feature assertions inspect source text. These checks do not instantiate the components, simulate keyboard input, submit forms, run a browser, or validate accessibility-tree output. A passing static check is not a browser interaction test.

## Manual smoke test

1. Serve the repository root over HTTP.
2. Open the gallery in a current Chromium-based browser.
3. Activate each button and confirm the component remains interactive.
4. Toggle state and verify the checked attribute.
5. Drag the slider and verify its output.
6. Submit and reset a sample host form when testing form-associated controls.
7. For horizontal tabs, use Left/Right Arrow keys, Home and End. Confirm focus and selected state stay synchronized.
8. For vertical tabs, use Up/Down Arrow keys, Home and End.
9. For radio groups, test Tab entry, arrow-key selection, Space activation, independent groups and the configured `name`.
10. Test radio `required` and `disabled` attributes and properties, reset, restored state and disabled-fieldset behavior inside a form.
11. Enable the operating system's reduced-motion setting and confirm particle effects are suppressed.
12. Test at 320px, 768px and desktop widths.
13. Check the browser console for errors.

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

Add browser-based interaction tests when a browser automation dependency and CI browser installation are intentionally introduced. The current project has no such dependency. Do not add a test dependency merely to create a passing badge; browser installation, repeatability and CI maintenance must be part of the decision.
