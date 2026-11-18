(() => {
 if(customElements.get("vfx-accordion"))return;let instance=0;
 class VFXAccordion extends HTMLElement{
  static get observedAttributes(){return ["open","label","disabled"]}
  constructor(){super();this.key=++instance;this.attachShadow({mode:"open"});this.shadowRoot.innerHTML=`<style>
   :host{display:block;width:100%;max-width:420px;border:1.5px solid var(--vfx-line,#ded9ef);border-radius:15px;background:var(--vfx-surface,#fff);overflow:hidden}
   button{width:100%;display:flex;align-items:center;justify-content:space-between;gap:1rem;padding:.9rem 1rem;border:0;background:transparent;color:var(--vfx-ink,#211b43);font:750 .95rem/1.35 inherit;text-align:left;cursor:pointer}
   button:focus-visible{outline:3px solid var(--vfx-violet,#6557d9);outline-offset:-4px}button:disabled{opacity:.55;cursor:not-allowed}
   .chevron{width:1rem;height:1rem;transition:transform .24s cubic-bezier(.2,.8,.2,1);flex:none}:host([open]) .chevron{transform:rotate(180deg)}
   .panel{height:0;overflow:hidden;transition:height .28s cubic-bezier(.2,.8,.2,1)}.inner{padding:0 1rem 1rem;color:var(--vfx-muted,#77718e);font-size:.9rem;line-height:1.65}
   @media(prefers-reduced-motion:reduce){.panel,.chevron{transition:none}}
  </style><button type="button" aria-expanded="false"><span></span><svg class="chevron" viewBox="0 0 20 20" aria-hidden="true"><path d="m4 7 6 6 6-6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></button><div class="panel" hidden><div class="inner"><slot></slot></div></div>`;
   this.button=this.shadowRoot.querySelector("button");this.panel=this.shadowRoot.querySelector(".panel");this.inner=this.shadowRoot.querySelector(".inner");this.labelNode=this.shadowRoot.querySelector("button span");this.panel.id="vfx-accordion-panel-"+this.key;this.button.setAttribute("aria-controls",this.panel.id);
   this.button.addEventListener("click",()=>{if(!this.hasAttribute("disabled"))this.open=!this.open});
  }
  connectedCallback(){this.sync(false);if(typeof ResizeObserver!=="undefined"){this.ro=new ResizeObserver(()=>this.syncHeight());this.ro.observe(this.inner)}}
  disconnectedCallback(){this.ro?.disconnect()}attributeChangedCallback(){this.sync?.(true)}
  get open(){return this.hasAttribute("open")}set open(v){this.toggleAttribute("open",!!v)}
  sync(animate=true){if(!this.button)return;this.labelNode.textContent=this.getAttribute("label")||"More details";this.button.disabled=this.hasAttribute("disabled");this.button.setAttribute("aria-expanded",String(this.open));this.panel.hidden=!this.open;this.syncHeight();if(animate&&this.open)window.VFXAnime?.impact(this,"spark",.45);this.dispatchEvent(new CustomEvent("change",{detail:{open:this.open},bubbles:true,composed:true}))}
  syncHeight(){if(this.panel)this.panel.style.height=this.open?this.inner.scrollHeight+"px":"0px"}
 }
 customElements.define("vfx-accordion",VFXAccordion);
})();