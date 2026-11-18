# 🛠️ Development guide

## Requirements
- A modern browser with Custom Elements, Shadow DOM, Canvas 2D and optional ElementInternals support.
- Python 3 or another static HTTP server for local preview.
- Node.js 20+ for the repository validation scripts.

## Start locally

Start the static server from the repository root:

```bash
python3 -m http.server 8000
```

Visit `http://localhost:8000`.

## Useful local pages

- Gallery: `http://localhost:8000/`
- Minimal integration: `http://localhost:8000/examples/basic.html`
- All-component integration cookbook: `http://localhost:8000/examples/integration-cookbook.html`

The cookbook is a runnable example of loading component scripts, handling composed events and connecting component values to host-page state. It is a manual test surface, not an automated browser test.

## Repository layout
- `core.js`: shared animation and canvas engine.
- `components/`: one custom-element definition per file.
- `styles.css`: gallery layout and theme tokens.
- `index.html`: interactive showcase.
- `examples/`: standalone integration examples.
- `docs/`: architecture, API, integration, deployment and QA notes.
- `tools/validate.mjs`: static repository validation.
- `skills/vfx-ui-anime/`: workflow for coding agents.

## Change workflow
1. Make a focused change in the relevant component or core.
2. Update `docs/COMPONENTS.md` and `docs/COMPONENT_API_REFERENCE.md` if public attributes, properties, methods or events change.
3. Add or update a standalone example when integration behavior changes.
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
Create `components/<name>.js`, register a uniquely named custom element, add a card to `index.html`, document its public API, update `registry.json` and include it in the static validation list.
