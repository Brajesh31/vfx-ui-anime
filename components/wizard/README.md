# 🧭 VFX UI Anime Multi-step Wizard

A dependency-free multi-step workflow with slotted panels, progress navigation, sequential validation, focus management, reset support, and lifecycle events.

## Quick start

```html
<script src="/components/wizard/index.js"></script>

<form>
  <vfx-wizard>
    <section data-step data-title="Profile">
      <h3>Your profile</h3>
      <label>Name <input name="name" required></label>
    </section>
    <section data-step data-title="Preferences">
      <h3>Preferences</h3>
      <label>Workspace <input name="workspace" required></label>
    </section>
    <section data-step data-title="Finish">
      <h3>Ready to go</h3>
      <p>Review and finish setup.</p>
    </section>
  </vfx-wizard>
</form>
```

## API

| Member | Type | Description |
|---|---|---|
| `activeIndex` | number | Read the current zero-based step index. Setting it calls `goTo(index)`. |
| `totalSteps` | number | Count of direct child panels carrying `data-step`. |
| `complete` | boolean | Whether the final step has been completed. |
| `disabled` | boolean | Whether navigation is disabled. |
| `goTo(index)` | method | Navigates to a step. Forward jumps validate every intervening step. |
| `next()` / `previous()` | methods | Validate and advance, or return to the preceding step. |
| `reset()` | method | Returns to the first step and clears completion. |

### Attributes

- `data-step` on each direct child panel identifies it as a step.
- `data-title` on a panel sets its displayed name.
- `disabled` on the wizard disables navigation.
- A form reset event resets the wizard position and completion state.

Panels can be added, removed, or retitled after initialization. The active panel is retained when possible.

## Validation and events

Native `input`, `select`, and `textarea` constraints are checked before advancing or jumping forward. If a later step is invalid during a forward jump, the wizard reveals that step, focuses its invalid field, and stops the jump.

- `change`: detail includes `index`, `previousIndex`, and `step`. Validation-driven navigation includes `reason: "validation"`.
- `invalid`: detail includes the invalid step index, field identifier, and validation message.
- `complete`: emitted once when the last step is completed.
- `reset`: emitted when the wizard is reset.

Events bubble and cross the shadow boundary.

## Accessibility and integration

The progress track exposes its current value. Step navigation uses native buttons with accessible labels and current-step state. The active panel receives focus after navigation. Keyboard users can use the visible Back and Continue controls and the step navigation buttons.

The wizard validates native controls but does not submit forms, serialize application state, persist progress, or provide a backend workflow. Handle form submission and data storage in the host application.

## Standalone behavior

The component is a single custom element with no framework or package dependency.
