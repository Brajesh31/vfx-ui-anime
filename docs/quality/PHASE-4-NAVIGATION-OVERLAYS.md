# Phase 4: navigation and overlays

**Status:** In progress on `main`  
**Scope:** Menu, Dialog, Drawer, Calendar, Date Picker, Command Palette, Context Menu and Combobox  
**Deployment target:** GitHub Pages

## 1. Goals

Improve navigation and overlay reliability without changing the existing custom-element tags, component APIs, visual identity or shared animation runtime.

The primary quality targets are predictable keyboard interaction, correct focus movement and restoration, dynamic attribute synchronization, constrained selection, disabled-state enforcement and safe overlay dismissal.

## 2. Implementation and regression work

| Component | Current Phase 4 focus |
|---|---|
| Menu | Rebuild dynamic actions and labels; move focus into the menu when it opens; close on Escape and restore focus |
| Dialog | Synchronize dynamic title and confirm text; retain native modal behavior and confirmation/dismissal events |
| Drawer | Synchronize title, placement, confirmation controls and disabled state; preserve native modal dialog and trigger focus restoration |
| Calendar | Enforce min/max and disabled constraints for both rendered and programmatic date selection |
| Date Picker | Synchronize value, label, placeholder, constraints and disabled state; prevent opening while disabled |
| Command Palette | Refresh state from attributes and refuse to open when disabled |
| Context Menu | Refresh actions and its accessible menu label when configuration changes |
| Combobox | Reflect external value changes in its visible input and keep native selection state synchronized |

## 3. Browser regression coverage

The browser suite includes Phase 4 assertions for:

- Dynamic Menu action and label updates, keyboard dismissal and expanded-state reset.
- Dynamic Dialog title and confirm label updates.
- Drawer opening, placement updates, closing and focus restoration on the specific test instance.
- Disabled Command Palette and Date Picker behavior.
- Context Menu action and accessible-label updates.
- Combobox external value synchronization.
- Calendar date-bound enforcement.

Additional coverage is being added for Phase 3 code-review follow-ups discovered after the merge.

## 4. Verification status

- [x] Node validation and component build checks on the current mainline.
- [x] Full Chromium browser suite, including Menu Escape, Drawer focus restoration and the new Phase 3/4 regression assertions.
- [x] GitHub Pages deployment after the Phase 4 changes.
- [x] CodeQL and OSSF Scorecard after the Phase 4 changes.
- [ ] Manual visual review at mobile and desktop widths.
- [ ] Keyboard and assistive-technology review.

**Latest automated verification:** commit `ac65a6bffaf5cbb4420efadcca800bbe160e8935` on `main`. The Validate, GitHub Pages, CodeQL and OSSF Scorecard workflows all completed successfully. The full Chromium browser test step passed, including the corrected Menu Escape assertion and Drawer fixture/focus tests.

## 5. Boundaries

No new component types, dependencies, build tools or hosting providers are introduced. GitHub Pages remains the production hosting target. Visual and interaction changes stay within the existing component implementations and regression suite.

**Phase 4 automated implementation and CI gates are passing. Final sign-off remains pending manual visual review and keyboard/assistive-technology review.**
