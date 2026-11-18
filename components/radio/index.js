(() => {
  if (customElements.get("vfx-radio")) return;

  let instanceCount = 0;

  class VFXRadio extends HTMLElement {
    static formAssociated = true;

    static get observedAttributes() {
      return ["options", "value", "name", "disabled", "required", "label"];
    }

    constructor() {
      super();
      this.instanceId = ++instanceCount;
      this.formDisabled = false;
      this.internals = this.attachInternals?.();
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: flex; gap: .8rem; flex-wrap: wrap; }
          [role="radiogroup"][aria-disabled="true"] { opacity: .6; }
          label {
            display: flex;
            align-items: center;
            gap: .35rem;
            cursor: pointer;
            font-size: .9rem;
          }
          [role="radiogroup"][aria-disabled="true"] label { cursor: not-allowed; }
          input { accent-color: var(--vfx-violet, #6557d9); }
          input:focus-visible {
            outline: 2px solid var(--vfx-pink, #ff5f9e);
            outline-offset: 3px;
          }
        </style>
        <div role="radiogroup" aria-label="Choose an option"></div>
      `;
      this.group = this.shadowRoot.querySelector('[role="radiogroup"]');
    }

    connectedCallback() {
      this.render();
      if (this.defaultValue === undefined) this.defaultValue = this.value;
    }

    attributeChangedCallback() {
      if (this.isConnected) this.render();
    }

    get options() {
      return (this.getAttribute("options") || "Option A,Option B")
        .split(",")
        .map((option) => option.trim())
        .filter(Boolean);
    }

    get value() {
      return this.group.querySelector('input[type="radio"]:checked')?.value || "";
    }

    set value(nextValue) {
      const value = String(nextValue ?? "");
      if (this.options.includes(value)) {
        this.setAttribute("value", value);
      } else if (!value && this.required) {
        this.removeAttribute("value");
      }
    }

    get disabled() {
      return this.hasAttribute("disabled") || this.formDisabled;
    }

    set disabled(nextValue) {
      this.toggleAttribute("disabled", Boolean(nextValue));
    }

    get required() {
      return this.hasAttribute("required");
    }

    set required(nextValue) {
      this.toggleAttribute("required", Boolean(nextValue));
    }

    render() {
      const options = this.options;
      const requestedValue = this.getAttribute("value");
      const selectedValue = options.includes(requestedValue)
        ? requestedValue
        : (this.required ? "" : (options[0] || ""));
      const name = this.getAttribute("name") || `vfx-radio-${this.instanceId}`;

      this.group.setAttribute("aria-label", this.getAttribute("label") || "Choose an option");
      this.group.setAttribute("aria-required", String(this.required));
      this.group.setAttribute("aria-disabled", String(this.disabled));
      this.group.replaceChildren();

      options.forEach((option) => {
        const label = document.createElement("label");
        const input = document.createElement("input");

        input.type = "radio";
        input.name = name;
        input.value = option;
        input.checked = option === selectedValue;
        input.disabled = this.disabled;
        input.required = this.required;

        input.addEventListener("change", () => {
          this.setAttribute("value", input.value);
          this.sync();
          window.VFXAnime?.impact(this, "spark", 0.5);
          this.dispatchEvent(new Event("change", {
            bubbles: true,
            composed: true
          }));
        });

        label.append(input, document.createTextNode(option));
        this.group.append(label);
      });

      this.sync();
    }

    sync() {
      const selected = this.value;
      this.internals?.setFormValue(this.disabled || !selected ? null : selected);

      if (!this.internals) return;

      if (!this.disabled && this.required && !selected) {
        const anchor = this.group.querySelector("input");
        if (anchor) {
          this.internals.setValidity(
            { valueMissing: true },
            "Please select an option.",
            anchor
          );
        } else {
          this.internals.setValidity({ valueMissing: true }, "Please select an option.");
        }
      } else {
        this.internals.setValidity({});
      }
    }

    formDisabledCallback(disabled) {
      this.formDisabled = disabled;
      if (this.isConnected) this.render();
      else this.sync();
    }

    formResetCallback() {
      if (this.defaultValue) this.setAttribute("value", this.defaultValue);
      else this.removeAttribute("value");
      this.sync();
    }

    formStateRestoreCallback(state) {
      this.value = String(state ?? "");
    }
  }

  customElements.define("vfx-radio", VFXRadio);
})();
