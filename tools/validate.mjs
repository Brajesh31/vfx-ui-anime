import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
const root = process.cwd();
const required = [
  "README.md","LICENSE","core.js","styles.css","index.html","llms.txt",
  "docs/COMPONENTS.md","docs/ARCHITECTURE.md","docs/ACCESSIBILITY.md",
  "components/button.js","components/toggle.js","components/slider.js",
  "components/checkbox.js","components/radio.js","components/input.js",
  "components/tabs.js","components/progress.js","components/rating.js",
  "components/toast.js","components/tooltip.js"
];
const errors=[];
for (const file of required) {
  try { await access(join(root,file)); } catch { errors.push(`Missing required file: ${file}`); }
}
const html=await readFile(join(root,"index.html"),"utf8");
const core=await readFile(join(root,"core.js"),"utf8");
if (!html.includes("<main") || !html.includes("vfx-button")) errors.push("Gallery markup is incomplete.");
if (!core.includes("prefers-reduced-motion")) errors.push("Core must respect prefers-reduced-motion.");
for (const name of ["button","toggle","slider","checkbox","radio","input","tabs","progress","rating","toast","tooltip"]) {
  const source=await readFile(join(root,"components",name+".js"),"utf8").catch(()=> "");
  if (!source.includes('customElements.define("vfx-'+name+'"')) errors.push(`Component registration missing: vfx-${name}`);
}
if (errors.length) { console.error("Validation failed:\n- "+errors.join("\n- ")); process.exit(1); }
console.log(`Validation passed: ${required.length} required paths and 11 component registrations.`);
console.log("Note: this is a static validation, not a browser interaction or accessibility test.");
