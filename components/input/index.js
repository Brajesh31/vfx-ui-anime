(() => {
  if(customElements.get("vfx-input"))return;
  class VFXInput extends HTMLElement {
    static formAssociated=true;
    static get observedAttributes(){return ["type","placeholder","value","required","disabled","autocomplete","label"];}
    constructor(){super();this.attachShadow({mode:"open"});this.internals=this.attachInternals?.();this.shadowRoot.innerHTML=`<style>:host{display:block;width:100%;max-width:280px}input{width:100%;border:2px solid #d9d5eb;border-radius:10px;padding:.7rem .85rem;font:inherit;color:var(--vfx-ink);background:#fff;outline:none;transition:border .18s,box-shadow .18s}input:focus{border-color:var(--vfx-violet);box-shadow:0 0 0 3px #aaa5ff55}</style><input type="text">`;this.input=this.shadowRoot.querySelector("input");this.input.addEventListener("input",()=>{this.sync();this.dispatchEvent(new Event("input",{bubbles:true,composed:true}));});this.input.addEventListener("change",()=>this.dispatchEvent(new Event("change",{bubbles:true,composed:true})));}
    connectedCallback(){for(const a of ["type","placeholder","value","required","disabled","autocomplete"])if(this.hasAttribute(a))this.input.setAttribute(a,this.getAttribute(a));this.defaultValue=this.input.value;this.sync();}
    attributeChangedCallback(name,_old,value){if(!this.input)return;if(value===null)this.input.removeAttribute(name);else this.input.setAttribute(name,value);this.sync();}
    get value(){return this.input.value;}
    set value(v){this.input.value=v;this.sync();}
    sync(){this.input.setAttribute("aria-label",this.getAttribute("label")||this.getAttribute("placeholder")||"Text input");this.internals?.setFormValue(this.input.disabled?null:this.value);}
    formDisabledCallback(disabled){this.input.disabled=disabled;this.sync();}
    formResetCallback(){this.value=this.defaultValue??"";}
  }
  customElements.define("vfx-input",VFXInput);
})();