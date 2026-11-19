import { readdir, readFile, access } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const names = ["button","toggle","slider","checkbox","radio","input","tabs","progress","rating","toast","tooltip","select","textarea","number","search","menu","dialog","file-upload","color-picker","accordion","segmented","otp","tag-input","pagination","alert","drawer","skeleton","badge","avatar","chip","breadcrumb","stepper","calendar","date-picker","command-palette","context-menu","combobox","drag-drop","carousel","timeline","radial-menu","image-cropper","kanban","data-grid","tree-view","signature-pad","before-after","multi-select","time-picker","transfer-list","split-pane","lightbox-gallery","password-field","date-range-picker","notification-center","rich-text-editor","gradient-picker","wizard","guided-tour","stopwatch","emoji-picker","copy-code","bar-chart","donut-chart","sparkline","kpi-card","gauge","heatmap","treemap","drawing-canvas","color-palette","audio-player","video-player","markdown-editor","json-editor","tilt-card","flip-card","particle-field","marquee","scroll-reveal","animated-counter","confetti-button"];
const expected = [
  "index.html","gallery/index.html","README.md","core.js","registry.json","llms.txt","LICENSE",
  "components/toggle/frames.webp","tools/build.mjs","tools/shot.mjs","tools/test.mjs","tools/trace.py",
  ".github/workflows/validate.yml",".github/workflows/deploy-pages.yml",
  ".github/workflows/codeql.yml",".github/workflows/scorecard.yml"
];
const errors = [];
const read = (path) => readFile(join(root, path), "utf8").catch(() => "");

for (const path of expected) {
  try { await access(join(root, path)); }
  catch { errors.push("Missing required repository file: " + path); }
}

const [gallery, home, core, registryText, packageText] = await Promise.all([
  read("gallery/index.html"), read("index.html"), read("core.js"),
  read("registry.json"), read("package.json")
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
  const embedded = js.match(/\/\/ >>> vfx core[^\n]*\n([\s\S]*?)\n\/\/ <<< vfx core/);
  if (!embedded) errors.push("Embedded core markers are missing or out of order in " + name + ".");
  else if (embedded[1].trim() !== core.trim()) errors.push("Embedded shared runtime is stale in " + name + ". Run node tools/build.mjs.");

  if (!/<script\b[^>]*\bsrc=["'](?:\.\/)?index\.js["'][^>]*>/i.test(demo)) {
    errors.push("Standalone demo does not load its component script: " + base + "demo.html");
  }
  if (!/^#\s+\S/m.test(docs) || docs.trim().length < 80) {
    errors.push("Component README is missing a meaningful heading or usage content: " + base + "README.md");
  }
}

if (!home.includes("gallery/")) errors.push("Root page must forward visitors to the gallery.");
if (!core.includes("window.VFXAnimeFX") || !core.includes("--vfx-") || !core.includes("prefers-reduced-motion")) {
  errors.push("Shared core branding or reduced-motion handling is missing.");
}
if (!gallery.includes("--vfx-")) errors.push("Gallery does not use VFX UI Anime theme names.");
if (pkg.name !== "vfx-ui-anime") errors.push("package.json project name does not match the repository.");
if (!pkg.scripts?.check?.includes("tools/build.mjs --check") || !pkg.scripts?.check?.includes("tools/validate.mjs")) {
  errors.push("The check script must validate generated runtime copies and repository structure.");
}
if (!pkg.scripts?.["test:browser"]?.includes("tools/test.mjs")) {
  errors.push("The test:browser script must run the Chromium interaction suite.");
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
console.log("VFX UI Anime release structure passed: " + names.length + " component types, " + galleryIds.length + " unique gallery demos, exact registry/source coverage, standalone demos, and synchronized shared runtime.");
