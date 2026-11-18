# 🚀 Deployment

The project is static. Any host that serves HTML, CSS and JavaScript can deploy it.

## GitHub Pages
1. Open repository Settings.
2. Open Pages.
3. Select **Deploy from a branch**.
4. Choose `main` and `/ (root)`.
5. Save and wait for the Pages deployment workflow.

## Vercel
Import `Brajesh31/vfx-ui-anime` as a new project. Select **Other** as the framework preset, leave the build command empty, and use `./` as the output directory.

## Netlify
Create a new site from the repository. Leave the build command blank and set the publish directory to `.`.

## Local preview
`python3 -m http.server 8000` then open `http://localhost:8000`.

No environment variables or backend services are required for the gallery.
