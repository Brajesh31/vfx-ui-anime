import { readFile, access } from "node:fs/promises";
import { join } from "node:path";
const root=process.cwd();
const required=[
  "README.md","LICENSE","core.js","styles.css","index.html","llms.txt","registry.json",
  "docs/COMPONENTS.md","docs/ARCHITECTURE.md","docs/ACCESSIBILITY.md","docs/INSTALLATION.md",
  "components/button.js","components/toggle.js","components/slider.js","components/checkbox.js",
  "components/radio.js","components/input.js","components/tabs.js","components/progress.js",
  "components/rating.js","components/toast.js","components/tooltip.js"
];
const errors=[];
for(const file of required){try{await access(join(root,file));}catch{errors.push(`Missing required file: ${file}`);}}
const html=await readFile(join(root,"index.html"),"utf8");
const core=await readFile(join(root,"core.js"),"utf8");
const registry=JSON.parse(await readFile(join(root,"registry.json"),"utf8"));
if(!html.includes("<main")||!html.includes("vfx-button"))errors.push("Gallery markup is incomplete.");
if(!core.includes("prefers-reduced-motion"))errors.push("Core must respect prefers-reduced-motion.");
if(registry.components?.length!==11)errors.push("Registry must describe all 11 components.");
for(const name of ["button","toggle","slider","checkbox","radio","input","tabs","progress","rating","toast","tooltip"]){
  const file=`components/${name}.js`;
  const source=await readFile(join(root,file),"utf8").catch(()=>"");
  if(!source.includes(`customElements.define("vfx-${name}"`))errors.push(`Component registration missing: vfx-${name}`);
  if(!html.includes(`src="${file}"`))errors.push(`Gallery does not load ${file}`);
}
if(errors.length){console.error("Validation failed:\n- "+errors.join("\n- "));process.exit(1);}
console.log(`Validation passed: ${required.length} required paths, registry metadata and 11 gallery component registrations.`);
console.log("Static validation only. Run manual/browser QA before claiming runtime or accessibility certification.");
