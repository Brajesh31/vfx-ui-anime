(() => {
  if (customElements.get("vfx-toggle")) return;
  class VFXToggle extends HTMLElement {
    static formAssociated = true;
    static get observedAttributes() { return ["checked", "name", "value", "label", "disabled"]; }
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.internals = this.attachInternals?.();
      this.shadowRoot.innerHTML = `<style>
        :host{display:inline-flex;align-items:center;gap:.65rem;color:var(--vfx-ink)}
        button{width:48px;height:27px;border:2px solid var(--vfx-ink);border-radius:99px;background:#e7e4f3;padding:2px;cursor:pointer;transition:background .2s}
        i{display:block;width:19px;height:19px;border-radius:50%;background:white;border:1px solid #aaa;box-shadow:1px 2px 0 #b5b0d0;transition:transform .22s cubic-bezier(.2,.8,.2,1)}
        :host([checked]) button{background:var(--vfx-pink)}
        :host([checked]) i{transform:translateX(20px)}
        button:focus-visible{outline:3px solid var(--vfx-violet);outline-offset:3px}
        button:disabled{opacity:.55;cursor:not-allowed}
      </style><span></span><button type="button" role="switch"><i></i></button>`;
      this.label = this.shadowRoot.querySelector("span");
      this.btn = this.shadowRoot.querySelector("button");
      this.btn.addEventListener("click", () => { if (!this.disabled) this.checked = !this.checked; });
    }
    connectedCallback() { this.sync(false); }
    attributeChangedCallback() { this.sync?.(false); }
    get checked() { return this.hasAttribute("checked"); }
    set checked(value) {
      const next = !!value, previous = this.checked;
      this.toggleAttribute("checked", next);
      this.sync(previous !== next);
    }
    get disabled() { return this.hasAttribute("disabled"); }
    sync(animate = false) {
      if (!this.btn) return;
      const label = this.getAttribute("label") || "Toggle";
      this.label.textContent = this.getAttribute("label") || "";
      this.btn.setAttribute("aria-label", label);
      this.btn.setAttribute("aria-checked", String(this.checked));
      this.btn.disabled = this.disabled;
      this.internals?.setFormValue(this.disabled || !this.checked ? null : (this.getAttribute("value") || "on"));
      if (animate && this.checked) window.VFXAnime?.impact(this, "spark", .65);
      if (animate) this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
    }
    formDisabledCallback(disabled) { this.toggleAttribute("disabled", disabled); }
    formResetCallback() { this.checked = this.hasAttribute("checked"); }
  }
  customElements.define("vfx-toggle", VFXToggle);
})();