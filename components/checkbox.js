(() => {
  if (customElements.get("vfx-checkbox")) return;
  class VFXCheckbox extends HTMLElement {
    static formAssociated = true;
    static get observedAttributes() { return ["checked", "disabled", "value"]; }
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this.internals = this.attachInternals?.();
      this.shadowRoot.innerHTML = `<style>
        :host{display:inline-flex;align-items:center;gap:.55rem}
        input{width:18px;height:18px;accent-color:var(--vfx-violet);cursor:pointer}
        input:focus-visible{outline:2px solid var(--vfx-pink);outline-offset:2px}
        label{cursor:pointer}
      </style><label><input type="checkbox"><slot></slot></label>`;
      this.input = this.shadowRoot.querySelector("input");
      this.input.addEventListener("change", () => {
        this.toggleAttribute("checked", this.input.checked);
        this.sync();
        window.VFXAnime?.impact(this, "burst", .55);
        this.dispatchEvent(new Event("change", { bubbles: true, composed: true }));
      });
    }
    connectedCallback() { this.input.checked = this.checked; this.sync(); }
    attributeChangedCallback() { if (this.input) { this.input.checked = this.checked; this.sync(); } }
    get checked() { return this.hasAttribute("checked"); }
    set checked(value) { this.toggleAttribute("checked", !!value); if (this.input) this.input.checked = !!value; this.sync(); }
    get disabled() { return this.hasAttribute("disabled"); }
    sync() {
      this.input.disabled = this.disabled;
      this.internals?.setFormValue(this.disabled || !this.checked ? null : (this.getAttribute("value") || "on"));
    }
    formDisabledCallback(disabled) { this.toggleAttribute("disabled", disabled); }
    formResetCallback() { this.checked = this.hasAttribute("checked"); }
  }
  customElements.define("vfx-checkbox", VFXCheckbox);
})();