(() => {
 if(customElements.get("vfx-segmented"))return;
 class VFXSegmented extends HTMLElement{
  static formAssociated=true;static get observedAttributes(){return ["value","label","disabled","options","name"]}
  constructor(){super();this.attachShadow({mode:"open"});this.internals=this.attachInternals?.();this.shadowRoot.innerHTML=`<style>
   :host{display:inline-block;max-width:100%}[role=radiogroup]{display:inline-flex;gap:3px;padding:4px;border:1.5px solid var(--vfx-line,#ded9ef);border-radius:13px;background:var(--vfx-soft,#f5f2ff);max-width:100%;overflow-x:auto}
   button{border:0;border-radius:9px;background:transparent;padding:.58rem .85rem;color:var(--vfx-muted,#77718e);font:700 .86rem/1.2 inherit;white-space:nowrap;cursor:pointer;transition:background .18s,color .18s,transform .18s}
   button[aria-checked=true]{background:var(--vfx-surface,#fff);color:var(--vfx-violet,#6557d9);box-shadow:0 2px 9px #211b4317}button:active{transform:scale(.94)}button:focus-visible{outline:2px solid var(--vfx-pink,#ff5f9e);outline-offset:2px}button:disabled{opacity:.5;cursor:not-allowed}
   @media(prefers-reduced-motion:reduce){button{transition:none}}
  </style><div role="radiogroup"></div>`;this.group=this.shadowRoot.querySelector("[role=radiogroup]")}
  connectedCallback(){this.defaultValue=this.value;this.render()}attributeChangedCallback(){if(this.isConnected)this.render()}
  get options(){const nodes=[...this.querySelectorAll(":scope > option")];if(nodes.length)return nodes.map(n=>({label:n.textContent.trim(),value:n.value||n.textContent.trim(),disabled:n.disabled}));return(this.getAttribute("options")||"Day,Week,Month").split(",").map(s=>({label:s.trim(),value:s.trim(),disabled:false})).filter(x=>x.label)}
  get value(){return this.getAttribute("value")||""}set value(v){this.setAttribute("value",String(v??""))}
  get disabled(){return this.hasAttribute("disabled")}
  render(){const opts=this.options;const value=opts.some(o=>o.value===this.value)?this.value:(opts[0]?.value||"");if(value!==this.value)this.setAttribute("value",value);this.group.setAttribute("aria-label",this.getAttribute("label")||"Choose an option");this.group.replaceChildren();opts.forEach(opt=>{const b=document.createElement("button");b.type="button";b.textContent=opt.label;b.disabled=this.disabled||opt.disabled;b.setAttribute("role","radio");b.setAttribute("aria-checked",String(opt.value===value));b.tabIndex=opt.value===value?0:-1;b.addEventListener("click",()=>this.select(opt.value));b.addEventListener("keydown",e=>{if(!["ArrowRight","ArrowLeft","Home","End"].includes(e.key))return;e.preventDefault();const enabled=opts.filter(x=>!x.disabled);let i=enabled.findIndex(x=>x.value===opt.value);i=e.key==="Home"?0:e.key==="End"?enabled.length-1:e.key==="ArrowRight"?(i+1)%enabled.length:(i-1+enabled.length)%enabled.length;this.select(enabled[i]?.value,true)});this.group.append(b)});this.internals?.setFormValue(this.disabled?null:value)}
  select(value,focus=false){if(!this.options.some(o=>o.value===value))return;this.setAttribute("value",value);this.render();if(focus)this.group.querySelector('[aria-checked="true"]')?.focus();window.VFXAnime?.impact(this,"spark",.5);this.dispatchEvent(new CustomEvent("change",{detail:{value},bubbles:true,composed:true}))}
  formResetCallback(){this.value=this.defaultValue||this.options[0]?.value||""}formDisabledCallback(disabled){this.toggleAttribute("disabled",disabled)}
 }
 customElements.define("vfx-segmented",VFXSegmented);
})();