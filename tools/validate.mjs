import { readdir, readFile, access } from "node:fs/promises";
import { join } from "node:path";
import { Script } from "node:vm";

const root = process.cwd();
const names = ["button","toggle","slider","checkbox","radio","input","tabs","progress","rating","toast","tooltip","select","textarea","number","search","menu","dialog","file-upload","color-picker","accordion","segmented","otp","tag-input","pagination","alert","drawer","skeleton","badge","avatar","chip","breadcrumb","stepper","calendar","date-picker","command-palette","context-menu","combobox","drag-drop","carousel","timeline","radial-menu","image-cropper","kanban","data-grid","tree-view","signature-pad","before-after","multi-select","time-picker","transfer-list","split-pane","lightbox-gallery","password-field","date-range-picker","notification-center","rich-text-editor","gradient-picker","wizard","guided-tour","stopwatch","emoji-picker","copy-code","bar-chart","donut-chart","sparkline","kpi-card","gauge","heatmap","treemap","drawing-canvas","color-palette","audio-player","video-player","markdown-editor","json-editor","tilt-card","flip-card","particle-field","marquee","scroll-reveal","animated-counter","confetti-button"];
const expected = [
  "index.html","gallery/index.html","README.md","core.js","registry.json","llms.txt","LICENSE",
  "components/toggle/frames.webp","tools/build.mjs","tools/shot.mjs","tools/test.mjs","tools/trace.py",
  ".github/workflows/validate.yml",".github/workflows/deploy-pages.yml",
  ".github/workflows/codeql.yml",".github/workflows/scorecard.yml",".github/workflows/publish.yml",
  ".github/workflows/release.yml",
  "index.js","docs/PACKAGE.md","tools/package-smoke.mjs"
];
const errors = [];
const read = (path) => readFile(join(root, path), "utf8").catch(() => "");

const isHtmlSpace = (character) => character === " " || character === "\t" || character === "\n" || character === "\r" || character === "\f";
const isTagNameCharacter = (character) => {
  const code = character.charCodeAt(0);
  return (code >= 65 && code <= 90) || (code >= 97 && code <= 122) ||
    (code >= 48 && code <= 57) || character === "-" || character === ":";
};

function findHtmlTagEnd(markup, start) {
  let quote = "";
  for (let index = start + 1; index < markup.length; index++) {
    const character = markup[index];
    if (quote) {
      if (character === quote) quote = "";
    } else if (character === '"' || character === "'") {
      quote = character;
    } else if (character === ">") {
      return index;
    }
  }
  return -1;
}

function readHtmlTag(markup, start) {
  let index = start + 1;
  const closing = markup[index] === "/";
  if (closing) index++;
  const nameStart = index;
  while (index < markup.length && isTagNameCharacter(markup[index])) index++;
  if (index === nameStart) return null;
  return { name: markup.slice(nameStart, index).toLowerCase(), closing, afterName: index };
}

function readHtmlAttributes(markup, start, end) {
  const attributes = new Map();
  let index = start;
  while (index < end) {
    while (index < end && (isHtmlSpace(markup[index]) || markup[index] === "/")) index++;
    if (index >= end) break;

    const nameStart = index;
    while (index < end && !isHtmlSpace(markup[index]) &&
      markup[index] !== "=" && markup[index] !== "/" && markup[index] !== ">") index++;
    if (index === nameStart) {
      index++;
      continue;
    }

    const name = markup.slice(nameStart, index).toLowerCase();
    while (index < end && isHtmlSpace(markup[index])) index++;
    let value = "";
    if (markup[index] === "=") {
      index++;
      while (index < end && isHtmlSpace(markup[index])) index++;
      const quote = markup[index] === '"' || markup[index] === "'" ? markup[index++] : "";
      const valueStart = index;
      if (quote) {
        while (index < end && markup[index] !== quote) index++;
        value = markup.slice(valueStart, index);
        if (markup[index] === quote) index++;
      } else {
        while (index < end && !isHtmlSpace(markup[index]) && markup[index] !== ">") index++;
        value = markup.slice(valueStart, index);
      }
    }
    if (!attributes.has(name)) attributes.set(name, value);
  }
  return attributes;
}

function findHtmlClosingTag(lowerMarkup, name, start) {
  const marker = "</" + name;
  let index = lowerMarkup.indexOf(marker, start);
  while (index !== -1) {
    const boundary = lowerMarkup[index + marker.length];
    if (boundary === ">" || boundary === "/" || isHtmlSpace(boundary || "")) return index;
    index = lowerMarkup.indexOf(marker, index + marker.length);
  }
  return -1;
}

function extractHtmlScripts(markup) {
  const source = String(markup);
  const lower = source.toLowerCase();
  const scripts = [];
  const rawTextElements = new Set(["style", "textarea", "title", "xmp", "iframe", "noembed", "noframes", "plaintext"]);
  let cursor = 0;

  while (cursor < source.length) {
    const opening = source.indexOf("<", cursor);
    if (opening === -1) break;

    if (source.startsWith("<!--", opening)) {
      const commentEnd = source.indexOf("-->", opening + 4);
      if (commentEnd === -1) break;
      cursor = commentEnd + 3;
      continue;
    }

    if (source.startsWith("<!", opening) || source.startsWith("<?", opening)) {
      const declarationEnd = findHtmlTagEnd(source, opening);
      if (declarationEnd === -1) break;
      cursor = declarationEnd + 1;
      continue;
    }

    const tag = readHtmlTag(source, opening);
    if (!tag) {
      cursor = opening + 1;
      continue;
    }

    const tagEnd = findHtmlTagEnd(source, opening);
    if (tagEnd === -1) break;
    if (tag.closing) {
      cursor = tagEnd + 1;
      continue;
    }

    if (tag.name === "script") {
      const attributes = readHtmlAttributes(source, tag.afterName, tagEnd);
      const contentStart = tagEnd + 1;
      const closingStart = findHtmlClosingTag(lower, "script", contentStart);
      if (closingStart === -1) {
        scripts.push({ attributes, content: source.slice(contentStart), closed: false });
        break;
      }
      const closingEnd = findHtmlTagEnd(source, closingStart);
      scripts.push({
        attributes,
        content: source.slice(contentStart, closingStart),
        closed: closingEnd !== -1
      });
      if (closingEnd === -1) break;
      cursor = closingEnd + 1;
      continue;
    }

    if (rawTextElements.has(tag.name)) {
      if (tag.name === "plaintext") break;
      const closingStart = findHtmlClosingTag(lower, tag.name, tagEnd + 1);
      if (closingStart === -1) break;
      const closingEnd = findHtmlTagEnd(source, closingStart);
      if (closingEnd === -1) break;
      cursor = closingEnd + 1;
      continue;
    }

    cursor = tagEnd + 1;
  }
  return scripts;
}


for (const path of expected) {
  try { await access(join(root, path)); }
  catch { errors.push("Missing required repository file: " + path); }
}

const [gallery, home, core, registryText, packageText, buildSource, validateWorkflow, pagesWorkflow, codeqlWorkflow, scorecardWorkflow, publishWorkflow, packageIndex, packageDocs, packageSmoke, readmeText, llmsText, releaseWorkflow] = await Promise.all([
  read("gallery/index.html"), read("index.html"), read("core.js"),
  read("registry.json"), read("package.json"), read("tools/build.mjs"),
  read(".github/workflows/validate.yml"), read(".github/workflows/deploy-pages.yml"),
  read(".github/workflows/codeql.yml"), read(".github/workflows/scorecard.yml"),
  read(".github/workflows/publish.yml"), read("index.js"), read("docs/PACKAGE.md"), read("tools/package-smoke.mjs"), read("README.md"), read("llms.txt"), read(".github/workflows/release.yml")
]);
let registry;
let pkg;
try { registry = JSON.parse(registryText); }
catch (error) { errors.push("registry.json is not valid JSON: " + error.message); registry = { items: [] }; }
try { pkg = JSON.parse(packageText); }
catch (error) { errors.push("package.json is not valid JSON: " + error.message); pkg = { scripts: {} }; }

const folders = (await readdir(join(root, "components"), { withFileTypes: true }))
  .filter((entry) => entry.isDirectory()).map((entry) => entry.name).sort();
const expectedFolders = names.slice().sort();
if (JSON.stringify(folders) !== JSON.stringify(expectedFolders)) {
  errors.push("components/ must contain exactly the eighty-two VFX UI Anime component folders.");
}

const buildList = buildSource.match(/export const NAMES = \[([\s\S]*?)\];/);
const buildNames = buildList ? [...buildList[1].matchAll(/["']([^"']+)["']/g)].map((match) => match[1]) : [];
if (JSON.stringify(buildNames) !== JSON.stringify(names)) {
  errors.push("tools/build.mjs and tools/validate.mjs must list the exact same component names in the same order.");
}
if (new Set(names).size !== names.length) errors.push("The validator component list contains duplicate names.");

if (!Array.isArray(registry.items) || registry.items.length !== names.length) {
  errors.push("Registry must contain all eighty-two component types.");
}
const registryItems = Array.isArray(registry.items) ? registry.items : [];
const registryNames = registryItems.map((item) => item?.name).filter(Boolean);
const registryDuplicates = registryNames.filter((name, index) => registryNames.indexOf(name) !== index);
if (registryDuplicates.length) errors.push("Registry has duplicate component names: " + [...new Set(registryDuplicates)].join(", "));
for (const name of names) {
  const matches = registryItems.filter((item) => item?.name === name);
  if (matches.length !== 1) {
    errors.push("Registry must contain exactly one entry for " + name + ".");
    continue;
  }
  const item = matches[0];
  const paths = Array.isArray(item.files) ? item.files.map((file) => file?.path) : [];
  if (paths.length !== 1 || paths[0] !== "components/" + name + "/index.js") {
    errors.push("Registry source path does not exactly match components/" + name + "/index.js.");
  }
  if (typeof item.docs !== "string" || !item.docs.includes("components/" + name + "/README.md")) {
    errors.push("Registry documentation reference is missing for " + name + ".");
  }
}
for (const name of registryNames) {
  if (!names.includes(name)) errors.push("Registry contains unknown component name: " + name);
}

const listStart = gallery.indexOf("const ITEMS = [");
const listEnd = listStart >= 0 ? gallery.indexOf("\n];", listStart) : -1;
const itemsSource = listStart >= 0 && listEnd > listStart ? gallery.slice(listStart, listEnd) : "";
const galleryIds = [...itemsSource.matchAll(/\bid:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
const galleryTags = [...itemsSource.matchAll(/\btag:\s*['"]([^'"]+)['"]/g)].map((match) => match[1]);
if (!itemsSource) errors.push("Gallery component manifest could not be located.");
if (galleryIds.length !== 83 || (gallery.match(/tag:\s*['"]vfx-/g) || []).length !== 83) {
  errors.push("Gallery must contain exactly eighty-three live demonstrations.");
}
const duplicateIds = galleryIds.filter((id, index) => galleryIds.indexOf(id) !== index);
if (duplicateIds.length) errors.push("Gallery has duplicate demo IDs: " + [...new Set(duplicateIds)].join(", "));
for (const name of names) {
  if (!galleryTags.includes("vfx-" + name)) errors.push("Gallery manifest is missing the vfx-" + name + " component tag.");
  if (!gallery.includes("../components/" + name + "/index.js")) errors.push("Gallery does not load " + name);
}
if (new Set(galleryTags).size !== names.length) errors.push("Gallery tags must cover all eighty-two component types.");

for (const name of names) {
  const base = "components/" + name + "/";
  for (const file of ["index.js", "demo.html", "README.md"]) {
    try { await access(join(root, base + file)); }
    catch { errors.push("Missing component file: " + base + file); }
  }

  const [js, demo, docs] = await Promise.all([
    read(base + "index.js"), read(base + "demo.html"), read(base + "README.md")
  ]);
  if (!js.includes("vfx-" + name)) errors.push("Component tag missing: vfx-" + name);
  try { new Script(js, { filename: base + "index.js" }); }
  catch (error) { errors.push("Component JavaScript syntax error in " + base + "index.js: " + error.message); }
  const embedded = js.match(/\/\/ >>> vfx core[^\n]*\n([\s\S]*?)\n\/\/ <<< vfx core/);
  if (!embedded) errors.push("Embedded core markers are missing or out of order in " + name + ".");
  else if (embedded[1].trim() !== core.trim()) errors.push("Embedded shared runtime is stale in " + name + ". Run node tools/build.mjs.");

  const scripts = extractHtmlScripts(demo);
  if (!scripts.some((script) => {
    const src = (script.attributes.get("src") || "").trim();
    return src === "index.js" || src === "./index.js";
  })) {
    errors.push("Standalone demo does not load its component script: " + base + "demo.html");
  }
  for (let index = 0; index < scripts.length; index++) {
    const script = scripts[index];
    const scriptType = (script.attributes.get("type") || "").trim().toLowerCase();
    const source = script.content.trim();
    if (script.attributes.has("src") || !source ||
      (scriptType && !["text/javascript", "application/javascript"].includes(scriptType))) continue;
    if (!script.closed) {
      errors.push("Inline demo script element is not closed in " + base + "demo.html.");
      continue;
    }
    try { new Script(source, { filename: base + "demo.html#inline-script-" + (index + 1) }); }
    catch (error) { errors.push("Inline demo JavaScript syntax error in " + base + "demo.html: " + error.message); }
  }
  if (!/^#\s+\S/m.test(docs) || docs.trim().length < 80) {
    errors.push("Component README is missing a meaningful heading or usage content: " + base + "README.md");
  }
}

if (!home.includes("gallery/")) errors.push("Root page must forward visitors to the gallery.");
if (!core.includes("window.VFXAnimeFX") || !core.includes("--vfx-") || !core.includes("prefers-reduced-motion")) {
  errors.push("Shared core branding or reduced-motion handling is missing.");
}

const [toggleSource, frameAsset] = await Promise.all([
  read("components/toggle/index.js"),
  readFile(join(root, "components/toggle/frames.webp")).catch(() => null)
]);
const embeddedSheet = toggleSource.match(/const SHEET = 'data:image\/webp;base64,([^']+)'/);
if (!frameAsset || !embeddedSheet || embeddedSheet[1] !== frameAsset.toString("base64")) {
  errors.push("The toggle's embedded WebP data URI does not match components/toggle/frames.webp.");
}
if (!gallery.includes("--vfx-")) errors.push("Gallery does not use VFX UI Anime theme names.");
if (pkg.name !== "vfx-ui-anime") errors.push("package.json project name does not match the repository.");
if (pkg.private === true) errors.push("package.json must not be private when preparing the npm distribution.");
if (pkg.version !== "0.1.0") errors.push("package.json version must match the initial v0.1.0 package release.");
if (pkg.main !== "./index.js" || pkg.module !== "./index.js" || pkg.browser !== "./index.js") errors.push("The package browser entry points must resolve to index.js.");
if (pkg.exports?.["."] !== "./index.js" || pkg.exports?.["./*"] !== "./components/*/index.js" || pkg.exports?.["./components/*"] !== "./components/*/index.js") errors.push("The package exports map must expose aggregate and component subpaths.");
if (pkg.sideEffects !== true) errors.push("The package must preserve side-effect custom-element registration imports.");
if (pkg.repository?.url !== "git+https://github.com/Brajesh31/vfx-ui-anime.git") errors.push("package.json repository URL must match GitHub for npm provenance.");
if (!Array.isArray(pkg.files) || !pkg.files.includes("components/*/index.js") || !pkg.files.includes("components/*/README.md") || !pkg.files.includes("docs/PACKAGE.md")) errors.push("The npm file allowlist must include component scripts, API READMEs and the package guide.");
if (!pkg.scripts?.["test:package"]?.includes("tools/package-smoke.mjs")) errors.push("The package smoke-test script is missing.");
if (!pkg.scripts?.prepublishOnly?.includes("npm run check")) errors.push("prepublishOnly must run repository structural and generated-runtime checks.");
if (!packageIndex.includes("export const componentNames") || !packageIndex.includes("export const componentTags")) errors.push("Aggregate entry must export component name and tag metadata.");
for (const name of names) if (!packageIndex.includes("./components/" + name + "/index.js")) errors.push("Aggregate entry is missing component " + name + ".");
if (!packageDocs.includes("browser-only") || !packageDocs.includes("vfx-ui-anime/button") || !packageDocs.includes("server-side")) errors.push("Package documentation must explain browser-only use, subpaths and SSR limitations.");
if (!packageSmoke.includes("npm pack --dry-run") || !packageSmoke.includes("--offline") || !packageSmoke.includes("Chromium")) errors.push("Package smoke test must inspect the tarball, install in a clean offline consumer, and exercise browser imports.");
if (!pkg.scripts?.check?.includes("tools/build.mjs --check") || !pkg.scripts?.check?.includes("tools/validate.mjs")) {
  errors.push("The check script must validate generated runtime copies and repository structure.");
}
if (!pkg.scripts?.["test:browser"]?.includes("tools/test.mjs")) {
  errors.push("The test:browser script must run the Chromium interaction suite.");
}

if (!validateWorkflow.includes("npm test") || !validateWorkflow.includes("npm run check") || !validateWorkflow.includes("npm run test:browser") || !validateWorkflow.includes("npm run test:package")) {
  errors.push("The Validate workflow must run structural, generated-build, and Chromium browser checks.");
}
if (!pagesWorkflow.includes("npm test") || !pagesWorkflow.includes("npm run check")) {
  errors.push("The Pages workflow must validate the repository before deployment.");
}
if (!publishWorkflow.includes("id-token: write") || !publishWorkflow.includes("npm stage publish") || !publishWorkflow.includes("npm install --global npm@latest") || !publishWorkflow.includes("tags:")) errors.push("npm publishing workflow must stage releases through OIDC, use current npm CLI, and run on version tags.");
if (!readmeText.includes("Public npm package: `vfx-ui-anime@0.1.0`") || !readmeText.includes("npm install vfx-ui-anime")) errors.push("README must describe the published npm v0.1.0 package and its install command.");
if (!llmsText.includes("public npm package `vfx-ui-anime@0.1.0`") || llmsText.includes("package is private and has not been published")) errors.push("llms.txt must describe the public npm package, not the pre-publication state.");
if (releaseWorkflow.includes("not yet published") || releaseWorkflow.includes("protected-token bootstrap workflow")) errors.push("Source pre-release notes must not describe the already-published npm package as unpublished.");
for (const [name, workflow] of [["Validate", validateWorkflow], ["Pages", pagesWorkflow], ["CodeQL", codeqlWorkflow], ["Scorecard", scorecardWorkflow]]) {
  if (!/push:\s*\n\s*branches:\s*\[main\]/.test(workflow)) errors.push(name + " workflow must run on pushes to main.");
}
if (!codeqlWorkflow.includes("security-events: write")) errors.push("CodeQL workflow is missing security-events write permission.");
if (!scorecardWorkflow.includes("persist-credentials: false")) errors.push("Scorecard checkout must disable persisted credentials.");


if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("VFX UI Anime release structure passed: " + names.length + " component types, " + galleryIds.length + " unique gallery demos, exact registry/source coverage, standalone demos, and synchronized shared runtime.");
