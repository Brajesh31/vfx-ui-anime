# 🌈 VFX UI Anime Gradient Picker

A responsive linear-gradient editor with two-to-five editable color stops, position controls, angle adjustment, presets, CSS output, and form association. The original `from`, `to`, and `angle` API remains supported.

## Quick start

```html
<script src="/components/gradient-picker/index.js"></script>

<form>
  <vfx-gradient-picker
    name="background"
    from="#ff5fa8"
    to="#8f8df7"
    angle="135"
  ></vfx-gradient-picker>
  <button type="submit">Apply</button>
</form>
```

## API

| Member | Type | Description |
|---|---|---|
| `value` | string | Read or set a supported `linear-gradient(...)` CSS value. |
| `from`, `to` | hex color | Backward-compatible access to the first and last stop colors. |
| `angle` | number | Read or set the gradient direction, clamped to 0–360 degrees. |
| `stops` | array | Read a defensive copy or replace stops with `{ color, position }` objects. |
| `addStop()` | method | Adds a stop between existing stops. Maximum five. |
| `removeStop(index)` | method | Removes a stop when more than two remain. |
| `formResetCallback()` | platform callback | Restores the initial stop list and angle when its form resets. |

### Attributes

| Attribute | Default | Description |
|---|---|---|
| `name` | empty | Form field name. |
| `from`, `to` | VFX brand colors | First and last stop colors as six-digit hex. |
| `angle` | 135 | Direction in degrees. |
| `stops` | none | JSON array of color and position objects. |
| `value` | none | Initial supported two-to-five-stop linear gradient. |
| `disabled` | false | Disables stop editing and controls. |

Stops are normalized, clamped to 0–100%, and sorted by position. Unsupported colors and malformed CSS values are rejected rather than inserted into the preview.

### Events

- `input`: emitted while colors, positions, or angle change.
- `change`: emitted when a change is committed or a preset/stop operation completes.
- `copy-request`: emitted by the Copy CSS action with the CSS value. The host application owns clipboard permissions and actual copying.

Event details include `value`, `stops`, `from`, `to`, and `angle`.

## Accessibility and responsive behavior

Every color and position input has a descriptive accessible name. Stop controls and angle are keyboard-operable native inputs. The stop editor wraps at narrow widths and the preview is exposed as an image with an accessible label.

## Limits

The editor currently supports linear gradients with six-digit hexadecimal colors and two to five stops. It does not parse CSS variables, named colors, alpha colors, radial/conic gradients, or browser-specific color syntax.

## Standalone behavior

The component is dependency-free and continues to work as a single custom-element script.
