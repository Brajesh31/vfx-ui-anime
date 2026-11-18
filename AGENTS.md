# 🤖 Agent instructions

## Project identity
VFX UI Anime is an independent, dependency-free Web Components library. It is not the original Sakuga VFX project and must not claim affiliation with it.

## Source of truth
- Public component behavior: `docs/COMPONENTS.md`.
- Runtime architecture: `docs/ARCHITECTURE.md`.
- Known accessibility gaps: `docs/ACCESSIBILITY.md`.
- Installation and framework guidance: `docs/INSTALLATION.md`.
- Automated static checks: `tools/validate.mjs`.

## Non-negotiable rules
1. Preserve native browser semantics wherever practical.
2. Keep the project dependency-free unless the user explicitly approves a dependency.
3. Load the shared `core.js` before component scripts.
4. Respect `prefers-reduced-motion`.
5. Do not invent APIs, tests, browser support or passing results.
6. Update the component API docs and gallery whenever a public component API changes.
7. Do not copy proprietary artwork, logos or source files from reference projects.
8. Keep all generated effects decorative and hidden from assistive technology.
9. Be explicit about incomplete form behavior and accessibility limitations.
10. Run `npm test`, `npm run check` and `npm run test:browser`. Manually test the affected interaction where a browser session is available before reporting completion.

## Change completion report
State files changed, public API changes, checks actually run, checks not run and remaining limitations.
