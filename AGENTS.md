# 🤖 Agent instructions

## Project identity
VFX UI Anime is an independent, dependency-free Web Components library. Keep its visual identity, APIs, and directory structure consistent.

## Source of truth
- Public behavior: `docs/COMPONENTS.md`.
- Detailed API inventory: `docs/COMPONENT_API_REFERENCE.md`.
- Component implementation and demos: `components/<name>/`.

## Repository rules
- Keep every component in its own folder with `index.js`, `demo.html`, and `README.md`.
- Prefer native semantics and accessible keyboard interactions.
- Preserve reduced-motion support.
- Do not add runtime dependencies without a concrete need.
- Do not claim tests pass unless they were run.
- Keep docs aligned with actual code.
