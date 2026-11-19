# 🗺️ VFX UI Anime Guided Tour

A selector-based onboarding overlay with spotlight framing, target validation, keyboard navigation, focus trapping, focus restoration, and responsive repositioning.

## Quick start

```html
<script src="/components/guided-tour/index.js"></script>

<button id="main-navigation">Open navigation</button>
<button id="project-area">View projects</button>

<vfx-guided-tour
  id="onboarding"
  steps="#main-navigation::Navigation::Explore the main sections.|#project-area::Projects::Your projects appear here."
></vfx-guided-tour>

<button type="button" onclick="document.querySelector('#onboarding').start()">
  Start tour
</button>
```

## API

| Member | Type | Description |
|---|---|---|
| `active` | boolean | Whether the overlay is currently open. |
| `currentIndex` | number | Current zero-based step index. |
| `steps` | array | Read a copy or replace steps with objects containing `selector`, `title`, and `description`. |
| `start()` | method | Starts at the first valid target. Returns false if disabled, already active, or no target can be resolved. |
| `next()` / `previous()` | methods | Navigate to the next or previous valid target. |
| `goTo(index)` | method | Navigate directly to a step with a valid target. |
| `finish(reason)` | method | Closes the tour and restores focus to the element active before it started. |

### Step formats

The compact attribute format remains supported:

`selector::title::description|selector2::title2::description2`

A JSON array of objects is also accepted by the `steps` attribute or `steps` property.

Missing or invalid selectors are skipped and reported through `target-missing`. If no target can be resolved, the tour does not open.

### Attributes

- `steps`: compact pipe-delimited steps or a JSON array.
- `disabled`: prevents the tour from starting. Applying it during an active tour closes the tour.

## Events and keyboard behavior

- `start`: includes the total step count and starting index.
- `change`: includes current and previous indexes and the step title.
- `target-missing`: identifies an unresolved selector and step index.
- `finish`: reports the finish reason and last active index.

Escape finishes the tour. Left/Right Arrow moves between steps. Tab and Shift+Tab stay inside the tour card. Focus returns to the previously focused element after the tour closes.

## Accessibility, motion, and limitations

The overlay exposes dialog semantics, a title and description, visible keyboard focus, and named controls. It repositions on scroll and resize and observes target/card size changes. Scrolling uses an immediate behavior when reduced motion is requested.

The overlay is not a security boundary and does not disable application APIs. Choose stable, visible selectors and ensure the surrounding page remains understandable when a tour is skipped or unavailable. The component does not persist tour completion.
