# 🔐 VFX Password Field

A standalone password control with a visibility toggle, live strength guidance, configurable minimum length, and native form-associated validation.

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
  <button type="submit">Continue</button>
</form>
```

## Public API

| API | Description |
|---|---|
| `value` | Read or set the password string |
| `strength` | Heuristic score from 0 to 4 |
| `toggleVisibility()` | Toggle password visibility, returns the new visibility state |
| `name` | Standard form-associated name attribute |
| `label` | Accessible visible field label |
| `placeholder` | Input placeholder |
| `minlength` | Minimum accepted character count, defaults to 8 |
| `required` | Requires a non-empty password |
| `autocomplete` | Passed through to the native password input |
| `disabled` | Disables input and reveal action |

The label, placeholder, minimum length, autocomplete, required, value and disabled attributes synchronize after the element is connected. Form reset restores the value attribute.

## Events

- `input`: dispatched while the value changes. Detail includes `value`, `strength`, `minimumLength` and a copy of the rule results.
- `change`: dispatched when the native input commits a value change.

## Strength guidance

The meter checks the configured minimum length, an uppercase letter, a number and a symbol. It is an educational heuristic, not a password-strength audit and not a substitute for server-side password policy, breached-password checks, rate limiting or secure hashing.

## Accessibility and security

The reveal button exposes its state through `aria-pressed` and changes its accessible label between Show and Hide. The meter has a text alternative. Do not log password values or send them to analytics. Always validate on the server and store passwords using a suitable password-hashing algorithm.
