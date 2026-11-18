(() => {
 if(customElements.get("vfx-notification"))return;
 class VFXNotification extends HTMLElement{
  static get observedAttributes(){return ["count","label","disabled"]}
  constructor(){super();this.attachShadow({mode:"open"});this.shadowRoot.innerHTML=`<style>
   :host{display:inline-block}button{position:relative;display:inline-grid;place-items:center;width:48px;height:48px;border:1.5px solid var(--vfx-line,#ded9ef);border-radius:15px;background:var(--vfx-surface,#fff);color:var(--vfx-ink,#211b43);cursor:pointer;transition:transform .18s,border-color .18s}
   button:hover{transform:translateY(-2px);border-color:var(--vfx-violet,#6557d9)}button:active{transform:scale(.94)}button:focus-visible{outline:3px solid var(--vfx-violet,#6557d9);outline-offset:3px}
   svg{width:22px;height:22px}.count{position:absolute;top:-6px;right:-7px;min-width:20px;height:20px;padding:0 5px;display:grid;place-items:center;border-radius:99px;background:var(--vfx-pink,#ff5f9e);color:#fff;border:2px solid var(--vfx-paper,#fffdfb);font:800 .65rem/1 system-ui}.count[hidden]{display:none}
   .ring{animation:ring .55s ease}@keyframes ring{0%,100%{transform:rotate(0)}20%{transform:rotate(18deg)}40%{transform:rotate(-15deg)}60%{transform:rotate(9deg)}80%{transform:rotate(-5deg)}}
   @media(prefers-reduced-motion:reduce){button{transition:none}.ring{animation:none}}
  </style><button type="button"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/></svg><span class="count" hidden></span></button>`;
   this.button=this.shadowRoot.querySelector("button");this.icon=this.shadowRoot.querySelector("svg");this.badge=this.shadowRoot.querySelector(".count");
   this.button.addEventListener("click",()=>{if(this.hasAttribute("disabled"))return;this.count=0;this.icon.classList.remove("ring");void this.icon.offsetWidth;this.icon.classList.add("ring");window.VFXAnime?.impact(this,"burst",.55);this.dispatchEvent(new CustomEvent("change",{detail:{count:this.count},bubbles:true,composed:true}))})
  }
  connectedCallback(){this.sync()}attributeChangedCallback(){this.sync?.()}get count(){return Math.max(0,Number(this.getAttribute("count")||0))}set count(v){this.setAttribute("count",String(Math.max(0,Number(v)||0)))}
  sync(){if(!this.button)return;this.button.disabled=this.hasAttribute("disabled");this.badge.textContent=this.count>99?"99+":String(this.count);this.badge.hidden=this.count===0;this.button.setAttribute("aria-label",this.getAttribute("label")||`Notifications, ${this.count} unread`)}
 }
 customElements.define("vfx-notification",VFXNotification);
})();