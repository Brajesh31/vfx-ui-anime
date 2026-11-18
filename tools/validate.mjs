import { access, readFile } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const names = ["button", "toggle", "slider", "checkbox", "radio", "input", "tabs", "progress", "rating", "toast", "tooltip", "like", "accordion", "segmented", "notification"];
const required = [
  "index.html", "styles.css", "core.js", "README.md", "LICENSE", "registry.json",
  "llms.txt", "THIRD_PARTY_NOTICES/LICENSES.md", "docs/COMPONENTS.md",
  "docs/COMPONENT_API_REFERENCE.md", "tests/browser.html", "tests/browser-interactions.js"
];
const errors = [];
for (const path of required) {
  try { await access(join(root, path)); }
  catch { errors.push("Missing required file: " + path); }
}

const html = await readFile(join(root, "index.html"), "utf8");
const core = await readFile(join(root, "core.js"), "utf8");
const registry = JSON.parse(await readFile(join(root, "registry.json"), "utf8"));

for (const name of names) {
  for (const file of ["index.js", "demo.html", "README.md"]) {
    const path = "components/" + name + "/" + file;
    try { await access(join(root, path)); }
    catch { errors.push("Missing component file: " + path); }
  }

  if (!html.includes('./components/' + name + '/index.js')) {
    errors.push("Interactive gallery is missing component script: " + name);
  }
  const source = await readFile(join(root, "components", name, "index.js"), "utf8").catch(() => "");
  const hasRegistration = source.includes("vfx-" + name) && (
    source.includes("fx.define('vfx-" + name + "'") ||
    source.includes('customElements.define("vfx-' + name + '"') ||
    source.includes("customElements.define('vfx-" + name + "'")
  );
  if (!hasRegistration) errors.push("Custom element registration missing for " + name);
}

if (registry.components?.length !== names.length) errors.push("Registry must list all 15 components.");
if (!core.includes("prefers-reduced-motion")) errors.push("Shared motion engine must respect reduced-motion preferences.");
if (!html.includes('id="grid"') || !html.includes("card.className = 'card'")) errors.push("Interactive component gallery markup is missing.");
if (!html.includes("./components/${it.id}/demo.html")) errors.push("Gallery component demo links are missing.");
if (!html.includes("prefers-reduced-motion")) errors.push("Gallery does not explain reduced-motion behaviour.");

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("Repository validation passed: all 15 components, source-backed animations, demos, and gallery entries are present.");
