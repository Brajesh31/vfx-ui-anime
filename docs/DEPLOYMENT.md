# 🚀 Deployment

VFX UI Anime is a static website. It can be hosted by any service that serves HTML, CSS and JavaScript. No backend, environment variables or production build step are required.

## 🌐 GitHub Pages (primary)

The repository includes an automated workflow at `.github/workflows/deploy-pages.yml`. It runs the repository's static validation, packages the root directory and deploys it whenever changes are pushed to `main`.

### Current deployment status

GitHub Pages is enabled and the site has been deployed successfully.

- **Published URL:** [https://brajesh31.github.io/vfx-ui-anime/](https://brajesh31.github.io/vfx-ui-anime/)
- **Latest verified deployment:** [Deploy to GitHub Pages, run 44233606857](https://github.com/Brajesh31/vfx-ui-anime/actions/runs/44233606857)
- **Result:** successful. Source validation, Pages configuration, artifact upload, and deployment steps all completed successfully.

### Repository settings

The publishing source is configured to use GitHub Actions. Repository administrators can review this at [Settings → Pages](https://github.com/Brajesh31/vfx-ui-anime/settings/pages).

The workflow deploys automatically on every push to `main`. It can also be started manually from the Actions tab using **Run workflow**.

### Workflow permissions

The workflow requests only the permissions needed to read repository contents and publish a Pages artifact: `contents: read`, `pages: write`, and `id-token: write`. The deployment environment is `github-pages`.

### Troubleshooting

- Check the [Actions tab](https://github.com/Brajesh31/vfx-ui-anime/actions) and open the newest **Deploy to GitHub Pages** run before investigating a public-site issue.
- If a future run fails at `configure-pages`, confirm **Settings → Pages → Source** is set to **GitHub Actions**.
- If deployment fails with a permission error, check the repository's Actions permissions and confirm Pages is available for this public repository.
- After changing static assets, wait for the latest deployment run to finish before testing the public URL.
- The site uses relative asset paths and is designed to work under the project subpath `/vfx-ui-anime/`.

## Vercel (optional alternative)

Import `Brajesh31/vfx-ui-anime` as a new project. Select **Other** as the framework preset, leave the build command empty, and use `./` as the output directory.

## Netlify (optional alternative)

Create a new site from the repository. Leave the build command blank and set the publish directory to `.`.

## Local preview

Run `python3 -m http.server 8000` then open `http://localhost:8000`.
