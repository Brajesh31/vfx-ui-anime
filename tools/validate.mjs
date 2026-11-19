import { readdir, readFile, access } from "node:fs/promises";
import { join } from "node:path";

const root = process.cwd();
const names = ["button","toggle","slider","checkbox","radio","input","tabs","progress","rating","toast","tooltip","select","textarea","number","search","menu","dialog","file-upload","color-picker","accordion","segmented","otp","tag-input","pagination","alert","drawer","skeleton","badge","avatar","chip","breadcrumb","stepper","calendar","date-picker","command-palette","context-menu","combobox","drag-drop","carousel","timeline","radial-menu","image-cropper","kanban","data-grid","tree-view","signature-pad","before-after","multi-select","time-picker","transfer-list","split-pane","lightbox-gallery","password-field","date-range-picker","notification-center","rich-text-editor","gradient-picker","wizard","guided-tour","stopwatch","emoji-picker","copy-code","bar-chart","donut-chart","sparkline","kpi-card","gauge","heatmap","treemap","drawing-canvas","color-palette","audio-player","video-player","markdown-editor","json-editor","tilt-card","flip-card","particle-field","marquee","scroll-reveal","animated-counter","confetti-button"];
const expected = ["index.html","gallery/index.html","README.md","core.js","registry.json","llms.txt","LICENSE","components/toggle/frames.webp","tools/build.mjs","tools/shot.mjs","tools/test.mjs","tools/trace.py"];
const errors = [];
for (const path of expected) { try { await access(join(root,path)); } catch { errors.push("Missing: "+path); } }
const gallery = await readFile(join(root,"gallery/index.html"),"utf8").catch(()=> "");
const home = await readFile(join(root,"index.html"),"utf8").catch(()=> "");
const core = await readFile(join(root,"core.js"),"utf8").catch(()=> "");
const registry = JSON.parse(await readFile(join(root,"registry.json"),"utf8"));
const folders = (await readdir(join(root,"components"),{withFileTypes:true})).filter(x=>x.isDirectory()).map(x=>x.name).sort();
if (JSON.stringify(folders)!==JSON.stringify(names.slice().sort())) errors.push("components/ must contain exactly the eighty-two VFX UI Anime component folders.");
if (registry.items?.length!==names.length) errors.push("Registry must contain all eighty-two component types.");
if (!gallery.includes("const ITEMS = [") || (gallery.match(/tag: .vfx-/g)||[]).length!==83) errors.push("Gallery must contain exactly eighty-three live demonstrations.");
for (const name of names) {
  for (const file of ["index.js","demo.html","README.md"]) { try { await access(join(root,"components",name,file)); } catch { errors.push("Missing component file: components/"+name+"/"+file); } }
  if (!gallery.includes("../components/"+name+"/index.js")) errors.push("Gallery does not load "+name);
  const js = await readFile(join(root,"components",name,"index.js"),"utf8").catch(()=> "");
  if (!js.includes("vfx-"+name)) errors.push("Component tag missing: vfx-"+name);
  if (!js.includes("// >>> vfx core") || !js.includes("// <<< vfx core")) errors.push("Embedded core markers missing in "+name);
}
if (!home.includes("gallery/")) errors.push("Root page must forward visitors to the gallery.");
if (!core.includes("window.VFXAnimeFX") || !core.includes("--vfx-") || !core.includes("prefers-reduced-motion")) errors.push("Shared core branding or reduced-motion handling is missing.");
if (!gallery.includes("--vfx-")) errors.push("Gallery does not use VFX UI Anime theme names.");
if (!registry.items.every(x=>x.files?.[0]?.path?.startsWith("components/"))) errors.push("Registry component paths must point into components/.");
if (errors.length) { console.error(errors.join("\n")); process.exit(1); }
console.log("VFX UI Anime validation passed: 82 component types, 83 gallery demos, generated runtime.");
