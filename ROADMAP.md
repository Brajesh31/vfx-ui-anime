# 🗺️ Roadmap

This roadmap describes intended work, not completed features.

## ✅ Initial foundation
- [x] Shared canvas effects engine.
- [x] Eleven custom elements.
- [x] Static interactive gallery.
- [x] API and architecture documentation.
- [x] Reduced-motion preference support.
- [x] Repository validation workflow baseline.

## ✅ Delivered interaction improvements
- [x] Horizontal and vertical tab navigation with roving focus, arrow keys, Home and End.
- [x] Radio groups using native radio controls and browser-provided keyboard navigation.
- [x] Radio group accessible labels, configured names, required/disabled properties and form lifecycle callbacks.
- [x] Static regression checks and JavaScript syntax parsing for runtime scripts.
- [x] Tooltip trigger-to-description relationship, dynamic text updates and Escape dismissal.
- [x] Tooltip automatic top/bottom placement, horizontal viewport clamping and resize/scroll recalculation.
- [x] Full tabs and tabpanel relationship within the component shadow tree, with named slots for host-authored content.

## 🔧 Next engineering priorities
- [x] Dependency-free headless Chromium interaction tests in GitHub Actions for tabs, radio groups and tooltips.
- [ ] Firefox and Safari compatibility testing.
- [ ] Complete form-associated custom element lifecycle and consistent validity behavior across target browsers.
- [ ] Toast queue and dismissal controls.
- [ ] Canvas lifecycle and overlay stacking configuration.
- [ ] Visual regression screenshots.
- [ ] Screen-reader audit with NVDA, VoiceOver and TalkBack.

## 📦 Distribution
- [ ] Publish an installable registry manifest.
- [ ] Add copy-paste installation recipes for React, Vue and vanilla HTML.
- [ ] Add versioned releases and migration notes.

Prioritize accessibility, predictable browser behavior and reliable APIs before adding more visual effects.
