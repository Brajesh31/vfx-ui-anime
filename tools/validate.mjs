import { readFile, access } from "node:fs/promises";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { join } from "node:path";

const execFileAsync = promisify(execFile);

const root = process.cwd();
const required = [
  "README.md", "LICENSE", "core.js", "styles.css", "index.html", "llms.txt", "registry.json",
  "docs/COMPONENTS.md", "docs/COMPONENT_API_REFERENCE.md", "docs/ARCHITECTURE.md",
  "docs/ACCESSIBILITY.md", "docs/INSTALLATION.md", "docs/TESTING.md",
  "components/button.js", "components/toggle.js", "components/slider.js", "components/checkbox.js",
  "components/radio.js", "components/input.js", "components/tabs.js", "components/progress.js",
  "components/rating.js", "components/toast.js", "components/tooltip.js"
];

const errors = [];

for (const file of required) {
  try {
    await access(join(root, file));
  } catch {
    errors.push(`Missing required file: ${file}`);
  }
}

const read = (path) => readFile(join(root, path), "utf8");
const html = await read("index.html");
const core = await read("core.js");
const registry = JSON.parse(await read("registry.json"));

if (!html.includes("<main") || !html.includes("vfx-button")) {
  errors.push("Gallery markup is incomplete.");
}
if (!core.includes("prefers-reduced-motion")) {
  errors.push("Core must respect prefers-reduced-motion.");
}
if (registry.components?.length !== 11) {
  errors.push("Registry must describe all 11 components.");
}

for (const name of ["button", "toggle", "slider", "checkbox", "radio", "input", "tabs", "progress", "rating", "toast", "tooltip"]) {
  const file = `components/${name}.js`;
  const source = await read(file).catch(() => "");
  if (!source.includes(`customElements.define("vfx-${name}"`)) {
    errors.push(`Component registration missing: vfx-${name}`);
  }
  if (!html.includes(`src="${file}"`)) {
    errors.push(`Gallery does not load ${file}`);
  }
}

const tabs = await read("components/tabs.js");
for (const hook of [
  "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End",
  "aria-orientation", 'button.tabIndex = isSelected ? 0 : -1',
  'this.setAttribute("value", nextValue)',
  'button.setAttribute("aria-controls", panelId)',
  'panel.setAttribute("role", "tabpanel")',
  'panel.setAttribute("aria-labelledby", tabId)',
  'panel.hidden = !isSelected',
  'panel.tabIndex = 0',
  'panelSlot.name = item',
  'this.panels.replaceChildren()'
]) {
  if (!tabs.includes(hook)) errors.push(`Tabs keyboard/navigation/panel hook missing: ${hook}`);
}

const radio = await read("components/radio.js");
for (const hook of [
  "input.name = name", "input.disabled = this.disabled", "input.required = this.required",
  "this.required ? \"\" :", 'this.setAttribute("value", input.value)',
  "aria-required", "aria-disabled", "setFormValue", "formResetCallback",
  "formDisabledCallback", "formStateRestoreCallback"
]) {
  if (!radio.includes(hook)) errors.push(`Radio accessibility/form hook missing: ${hook}`);
}

const tooltip = await read("components/tooltip.js");
for (const hook of [
  '["text", "placement"]',
  'setAttribute("aria-describedby", this.tip.id)',
  'role="tooltip"',
  'this.matches(":hover")',
  'event.key !== "Escape"',
  'window.addEventListener("resize"',
  'window.addEventListener("scroll"',
  'setAttribute("data-placement", placement)',
  'this.tip.style.setProperty("--vfx-tooltip-arrow-left"',
  'prefers-reduced-motion: reduce',
  '<slot></slot>'
]) {
  if (!tooltip.includes(hook)) errors.push(`Tooltip accessibility/positioning hook missing: ${hook}`);
}

const api = await read("docs/COMPONENT_API_REFERENCE.md");
if (!api.includes("orientation=\"vertical\"") || !api.includes("Up/Down Arrow keys")) {
  errors.push("Component API reference does not document vertical tabs keyboard navigation.");
}
if (!api.includes("aria-controls") || !api.includes("aria-labelledby") || !api.includes('slot="Overview"')) {
  errors.push("Component API reference does not document linked tabpanels and named content slots.");
}
if (!api.includes("form reset") || !api.includes("required validity")) {
  errors.push("Component API reference does not document radio form behavior.");
}
if (!api.includes("aria-describedby") || !api.includes("horizontal") && !api.includes("horizontally clamped")) {
  errors.push("Component API reference does not document tooltip accessibility and viewport behavior.");
}

if (errors.length) {
  console.error("Validation failed:\n- " + errors.join("\n- "));
  process.exit(1);
}

console.log(`Validation passed: ${required.length} required paths, 11 registrations, gallery script loading, reduced-motion support, and tabs/panel/radio/tooltip regression hooks.`);
console.log("Static validation only. Run manual/browser QA before claiming runtime or accessibility certification.");
