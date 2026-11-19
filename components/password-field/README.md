# 🔐 VFX UI Anime Password Field

A dependency-free password control with a show/hide toggle, configurable minimum length, live heuristic strength feedback, native required/min-length validation, and form association.

## Quick start

```html
<script src="/components/password-field/index.js"></script>

<form>
  <vfx-password-field
    name="password"
    label="Account password"
    placeholder="Create a password"
    minlength="12"
    required
    autocomplete="new-password"
  ></vfx-password-field>
  <button type="submit">Create account</button>
</form>
```

## API

| Member | Type | Description |
|---|---|---|
| `value` | string | Read or set the password. |
| `strength` | number | Heuristic score from 0 to 4. |
| `toggleVisibility()` | method | Toggles between masked and visible text. Returns the new visibility state. |

### Attributes

| Attribute | Default | Description |
|---|---|---|
| `name` | empty | Form field name. |
| `label` | `Password` | Visible and accessible field label. |
| `placeholder` | `Create a password` | Input placeholder. |
| `minlength` | `8` | Minimum length used by native validation and the rule indicator. |
| `required` | false | Makes the password mandatory. |
| `autocomplete` | `new-password` | Native autocomplete hint. |
| `value` | empty | Initial and form-reset value. |
| `disabled` | false | Disables the input and visibility control. |

### Events

- `input`: emitted as the value changes. Detail includes `value`, `strength`, `minimumLength`, and the individual rule results.
- `change`: emitted when the input is committed. Detail includes `value` and `strength`.

Both events bubble and cross the shadow boundary.

## Validation and accessibility

- The control uses native input semantics and native `required` / `minlength` constraints.
- The reveal button has a changing accessible name and `aria-pressed` state.
- Password strength is announced as descriptive text, not color alone.
- Disabled fieldsets are respected through form-associated custom-element callbacks.
- The input remains keyboard-operable. The reveal button is a normal button.

## Security limits

The strength meter is a simple client-side heuristic, not a breach check or security audit. Do not log, persist, expose, or send password values to analytics. Always validate server-side and store passwords using a dedicated, secure password-hashing algorithm. Never treat the meter as a substitute for authentication security.

## Standalone behavior

The component file embeds the shared VFX runtime and does not require a framework or package dependency. See the project gallery for the integrated preview.
