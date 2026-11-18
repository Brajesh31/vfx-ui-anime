# 🧭 VFX Multi-step Wizard

A step flow with slotted panels, progress state, back/next navigation, per-step native validity checks, and a completion event.

```html
<script src="/components/wizard/index.js"></script>
<vfx-wizard>
  <section data-step data-title="Profile"><h3>Your profile</h3><input required placeholder="Name"></section>
  <section data-step data-title="Preferences"><h3>Preferences</h3></section>
  <section data-step data-title="Finish"><h3>Ready to go</h3></section>
</vfx-wizard>
```

## API
- `activeIndex`, `totalSteps`, and `complete` read current state.
- `goTo(index)`, `next()`, and `previous()` control navigation.
- Add direct child panels with `data-step`; optional `data-title` sets the heading.

## Events
- `change`: new index and step title.
- `invalid`: blocked step and invalid field name.
- `complete`: emitted after final step validation.

Native form controls inside a step are checked before advancing. The component does not submit a form or persist data automatically.
