import { access, readFile } from "node:fs/promises";
import { join } from "node:path";
const root=process.cwd();
const names=["button","toggle","slider","checkbox","radio","input","tabs","progress","rating","toast","tooltip","like","accordion","segmented","notification"];
const required=["index.html","styles.css","core.js","showcase.js","README.md","LICENSE","registry.json","llms.txt","docs/COMPONENTS.md","docs/COMPONENT_API_REFERENCE.md","tests/browser.html","tests/browser-interactions.js"];
const errors=[];
for(const path of required){try{await access(join(root,path));}catch{errors.push("Missing required file: "+path);}}
const html=await readFile(join(root,"index.html"),"utf8");
const css=await readFile(join(root,"styles.css"),"utf8");
const core=await readFile(join(root,"core.js"),"utf8");
const registry=JSON.parse(await readFile(join(root,"registry.json"),"utf8"));
for(const name of names){for(const file of ["index.js","demo.html","README.md"]){const path="components/"+name+"/"+file;try{await access(join(root,path));}catch{errors.push("Missing component file: "+path);}}if(!html.includes('src="components/'+name+'/index.js"'))errors.push("Homepage missing component script: "+name);if(!html.includes('href="components/'+name+'/demo.html"'))errors.push("Homepage missing detail page: "+name);const source=await readFile(join(root,"components",name,"index.js"),"utf8").catch(()=>"");if(!source.includes('customElements.define("vfx-'+name+'"'))errors.push("Custom element registration missing for "+name);}
if(registry.components?.length!==15)errors.push("Registry must list 15 components.");
if(!core.includes("prefers-reduced-motion"))errors.push("Motion engine must respect reduced-motion preferences.");
if(!css.includes(".component-grid")||!css.includes(".filter-chip"))errors.push("Gallery design styles are incomplete.");
if(!html.includes('id="component-search"')||!html.includes('id="component-grid"'))errors.push("Searchable gallery markup is missing.");
if(html.toLowerCase().includes("sakuga")||html.includes("sakuga-vfx"))errors.push("Homepage contains retired third-party branding.");
if(errors.length){console.error(errors.join("\n"));process.exit(1);}
console.log("Repository validation passed: 15 components, 15 dedicated folders, searchable gallery.");
