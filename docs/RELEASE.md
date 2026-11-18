# 📦 Release checklist

Before creating a public release:

- [ ] Review the open roadmap items and known limitations.
- [ ] Run `npm test` and `npm run check`.
- [ ] Test the gallery in current Chromium, Firefox and Safari.
- [ ] Test keyboard, screen-reader and reduced-motion behavior.
- [ ] Verify all links, component names and examples.
- [ ] Confirm `registry.json` matches actual component files.
- [ ] Update `CHANGELOG.md` and `package.json` version.
- [ ] Create a Git tag matching the package version.
- [ ] Attach release notes and known issues.
- [ ] Confirm the deployed gallery serves the same commit.

Do not publish a release with unverified test badges or claims.
