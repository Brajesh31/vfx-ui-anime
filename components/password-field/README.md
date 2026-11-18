# 🔐 VFX Password Field

A password input with reveal control, live strength meter, rule hints, and form association.

```html
<script src="/components/password-field/index.js"></script>
<vfx-password-field name="password" label="Account password" minlength="10" autocomplete="new-password"></vfx-password-field>
```

## API
- `value`: read or set the password string.
- `strength`: score from 0 to 4.
- Attributes: `name`, `label`, `placeholder`, `minlength`, `required`, and `autocomplete`.

## Events
- `input`: value and strength score.
- `change`: committed value and strength score.

## Security notes
This component only provides client-side input and visual guidance. Its strength meter is a heuristic, not a security audit. Never log password values or send them to analytics. Always validate and securely hash passwords on your server.
