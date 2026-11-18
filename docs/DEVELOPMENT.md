# 🛠️ Development guide

## Requirements
- A modern browser with Custom Elements, Shadow DOM, Canvas 2D and optional ElementInternals support.
- Python 3 or another static HTTP server for local preview.
- Node.js 20+ for the repository validation scripts.

## Start locally
```bash
python3 -m http.server 8000
```
Visit `http://localhost:8000`.

## Repository layout
- `core.js`: shared animation and canvas engine.
- `components/`: one custom-element definition per file.
- `styles.css`: gallery layout and theme tokens.
- `index.html`: interactive showcase.
- `docs/`: architecture, API, deployment and QA notes.
- `tools/`: static validation and screenshot helper.
- `skills/vfx-ui-anime/`: workflow for coding agents.

## Change workflow
1. Make a focused change in the relevant component or core.
2. Update `docs/COMPONENTS.md` if public attributes, properties or events change.
3. Add or update a gallery example when behavior changes.
4. Run `npm test` and `npm run check`.
5. Manually test keyboard interaction, reduced motion and narrow viewports.
6. Update `CHANGELOG.md`.

## Coding conventions
- Use native controls for keyboard and baseline accessibility.
- Avoid global styles from component scripts.
- Keep component registration idempotent.
- Dispatch composed custom events for host-app integration.
- Do not add a dependency for a small helper.
- Do not claim browser support without testing it.

## Adding a component
Create `components/<name>.js`, register a uniquely named custom element, add a card to `index.html`, document its public API and include it in the static validation list.
