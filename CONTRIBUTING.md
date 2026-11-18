# 🤝 Contributing

Thanks for helping improve VFX UI Anime.

## Before opening a PR
- Search existing issues and pull requests.
- Keep changes focused and explain the user-facing impact.
- Update documentation when public behavior changes.
- Do not add dependencies without explaining why they are necessary.
- Do not add generated or third-party assets unless their licenses are clear.

## Local checks
```bash
npm test
npm run check
python3 -m http.server 8000
```

## Pull request expectations
Include:
- Summary and motivation.
- Screenshots or a short recording for visual changes.
- Browser and viewport tested.
- Keyboard and reduced-motion test notes.
- Any accessibility limitations that remain.

## Code style
Use readable modern JavaScript, descriptive names, native browser APIs and small focused functions. Avoid global side effects beyond custom element registration and the documented shared engine.
