(() => {
  if (customElements.get("vfx-tabs")) return;

  let instanceCount = 0;

  class VFXTabs extends HTMLElement {
    static get observedAttributes() {
      return ["items", "value", "orientation", "label"];
    }

    constructor() {
      super();
      this.instanceId = ++instanceCount;
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <style>
          :host { display: block; width: 100%; }
          nav {
            display: flex;
            gap: .3rem;
            padding: .25rem;
            background: #f0edfa;
            border-radius: 12px;
          }
          button {
            flex: 1;
            min-width: 0;
            border: 0;
            border-radius: 9px;
            background: transparent;
            padding: .6rem .7rem;
            color: #716b8b;
            font: inherit;
            font-weight: 700;
            cursor: pointer;
          }
          button[aria-selected="true"] {
            background: #fff;
            color: var(--vfx-violet, #6557d9);
            box-shadow: 0 2px 8px #241b5015;
          }
          button:focus-visible {
            outline: 3px solid var(--vfx-pink, #ff5f9e);
            outline-offset: 2px;
          }
          :host([orientation="vertical"]) nav {
            flex-direction: column;
            align-items: stretch;
          }
          :host([orientation="vertical"]) button {
            flex: none;
            text-align: start;
          }
        </style>
        <nav role="tablist" aria-label="Tabs" aria-orientation="horizontal"></nav>
      `;
      this.nav = this.shadowRoot.querySelector("nav");
    }

    connectedCallback() {
      this.render();
    }

    attributeChangedCallback() {
      if (this.isConnected) this.render();
    }

    get items() {
      const raw = (this.getAttribute("items") || "Overview,Details")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
      return [...new Set(raw)];
    }

    get value() {
      const items = this.items;
      const current = this.getAttribute("value");
      return items.includes(current) ? current : (items[0] || "");
    }

    set value(nextValue) {
      const value = String(nextValue ?? "");
      if (this.items.includes(value)) this.setAttribute("value", value);
    }

    get orientation() {
      return this.getAttribute("orientation") === "vertical" ? "vertical" : "horizontal";
    }

    render() {
      const items = this.items;
      const selected = this.value;
      const orientation = this.orientation;

      this.nav.setAttribute("aria-orientation", orientation);
      this.nav.setAttribute("aria-label", this.getAttribute("label") || "Tabs");
      this.nav.replaceChildren();

      items.forEach((item, index) => {
        const button = document.createElement("button");
        const isSelected = item === selected;

        button.type = "button";
        button.id = `vfx-tabs-${this.instanceId}-tab-${index}`;
        button.setAttribute("role", "tab");
        button.setAttribute("aria-selected", String(isSelected));
        button.tabIndex = isSelected ? 0 : -1;
        button.dataset.index = String(index);
        button.textContent = item;

        button.addEventListener("click", () => this.activate(index, true));
        button.addEventListener("keydown", (event) => this.handleKeydown(event, index));

        this.nav.append(button);
      });
    }

    activate(index, moveFocus) {
      const items = this.items;
      const nextValue = items[index];
      if (nextValue === undefined) return;

      const changed = this.value !== nextValue;
      if (changed) this.setAttribute("value", nextValue);

      const target = [...this.nav.querySelectorAll('[role="tab"]')]
        .find((button) => Number(button.dataset.index) === index);

      if (moveFocus) target?.focus();

      if (changed) {
        this.dispatchEvent(new CustomEvent("change", {
          detail: { value: nextValue },
          bubbles: true,
          composed: true
        }));
        if (target) window.VFXAnime?.impact(target, "spark", 0.45);
      }
    }

    handleKeydown(event, currentIndex) {
      const horizontal = this.orientation === "horizontal";
      const previousKey = horizontal ? "ArrowLeft" : "ArrowUp";
      const nextKey = horizontal ? "ArrowRight" : "ArrowDown";
      const count = this.items.length;
      if (!count) return;

      let nextIndex = currentIndex;

      if (event.key === nextKey) nextIndex = (currentIndex + 1) % count;
      else if (event.key === previousKey) nextIndex = (currentIndex - 1 + count) % count;
      else if (event.key === "Home") nextIndex = 0;
      else if (event.key === "End") nextIndex = count - 1;
      else return;

      event.preventDefault();
      this.activate(nextIndex, true);
    }
  }

  customElements.define("vfx-tabs", VFXTabs);
})();
