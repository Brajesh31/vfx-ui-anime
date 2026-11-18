(() => {
 if(customElements.get("vfx-like"))return;
 class VFXLike extends HTMLElement{
  static get observedAttributes(){return ["pressed","label","liked-label","disabled"];}
  constructor(){super();this.attachShadow({mode:"open"});this.shadowRoot.innerHTML=`<style>
   :host{display:inline-block}button{display:inline-flex;align-items:center;gap:.55rem;border:1.5px solid var(--vfx-line,#ded9ef);border-radius:999px;padding:.65rem .95rem;background:var(--vfx-surface,#fff);color:var(--vfx-ink,#211b43);font:700 .9rem/1.2 inherit;cursor:pointer;transition:transform .18s,border-color .18s,background .18s}
   button:hover{transform:translateY(-2px);border-color:var(--vfx-pink,#ff5f9e)}button:active{transform:scale(.94)}button:focus-visible{outline:3px solid var(--vfx-violet,#6557d9);outline-offset:3px}
   svg{width:1.2rem;height:1.2rem;transition:transform .28s cubic-bezier(.2,1.5,.4,1)}:host([pressed]) button{background:#fff0f5;border-color:#ffc4da;color:#d92f75}:host([pressed]) svg{transform:scale(1.18)}:host([pressed]) path{fill:currentColor}
   .pop{animation:pop .36s cubic-bezier(.2,1.6,.4,1)}@keyframes pop{50%{transform:scale(1.45) rotate(-8deg)}}@media(prefers-reduced-motion:reduce){button,svg{transition:none}.pop{animation:none}}
  </style><button type="button" aria-pressed="false"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 4.8a5.4 5.4 0 0 0-7.6 0L12 6l-1.2-1.2a5.4 5.4 0 0 0-7.6 7.6l1.2 1.2L12 21l7.6-7.4 1.2-1.2a5.4 5.4 0 0 0 0-7.6Z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/></svg><span></span></button>`;
   this.button=this.shadowRoot.querySelector("button");this.icon=this.shadowRoot.querySelector("svg");this.labelNode=this.shadowRoot.querySelector("span");
   this.button.addEventListener("click",()=>{if(this.hasAttribute("disabled"))return;this.pressed=!this.pressed;this.icon.classList.remove("pop");void this.icon.offsetWidth;this.icon.classList.add("pop");window.VFXAnime?.impact(this,this.pressed?"burst":"spark",.65);this.dispatchEvent(new CustomEvent("change",{detail:{pressed:this.pressed},bubbles:true,composed:true}));});
  }
  connectedCallback(){this.sync()}attributeChangedCallback(){this.sync?.()}
  get pressed(){return this.hasAttribute("pressed")}set pressed(v){this.toggleAttribute("pressed",!!v)}
  sync(){if(!this.button)return;this.button.disabled=this.hasAttribute("disabled");this.button.setAttribute("aria-pressed",String(this.pressed));this.labelNode.textContent=this.getAttribute(this.pressed?"liked-label":"label")||(this.pressed?"Liked":"Like")}
 }
 customElements.define("vfx-like",VFXLike);
})();