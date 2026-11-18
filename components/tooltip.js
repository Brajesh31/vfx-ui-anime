(() => {
  if (customElements.get("vfx-tooltip")) return;

  let tooltipCount = 0;

  class VFXTooltip extends HTMLElement {
    static get observedAttributes() {
      return ["text", "placement"];
    }

    constructor() {
      super();
      this.instanceId = ++tooltipCount;
      this.attachShadow({ mode: "open" });
      this.shadowRoot.innerHTML = `
        <style>
          :host {
            position: relative;
            display: inline-block;
          }

          .trigger {
            border-bottom: 1px dashed var(--vfx-violet, #6557d9);
            cursor: help;
            padding: .25rem;
            color: var(--vfx-violet, #6557d9);
            font: inherit;
            font-weight: 700;
          }

          .trigger:focus-visible {
            outline: 2px solid var(--vfx-pink, #ff5f9e);
            outline-offset: 3px;
            border-radius: 3px;
          }

          .tip {
            position: absolute;
            z-index: 10;
            bottom: calc(100% + 10px);
            top: auto;
            left: 50%;
            box-sizing: border-box;
            width: max-content;
            max-width: min(16rem, calc(100vw - 2rem));
            transform: translate(-50%, 5px);
            opacity: 0;
            visibility: hidden;
            pointer-events: none;
            overflow-wrap: anywhere;
            white-space: normal;
            background: var(--vfx-ink, #211b43);
            color: #fff;
            border-radius: 8px;
            padding: .5rem .7rem;
            font-size: .8rem;
            line-height: 1.4;
            box-shadow: 0 6px 18px #211b4330;
            transition: opacity .18s ease, transform .18s ease, visibility .18s;
          }

          .tip::after {
            content: "";
            position: absolute;
            top: 100%;
            left: var(--vfx-tooltip-arrow-left, 50%);
            transform: translateX(-50%);
            border: 6px solid transparent;
            border-top-color: var(--vfx-ink, #211b43);
          }

          :host([data-placement="bottom"]) .tip {
            top: calc(100% + 10px);
            bottom: auto;
            transform: translate(-50%, -5px);
          }

          :host([data-placement="bottom"]) .tip::after {
            top: auto;
            bottom: 100%;
            border-top-color: transparent;
            border-bottom-color: var(--vfx-ink, #211b43);
          }

          :host([data-active]) .tip,
          :host(:focus-within) .tip {
            opacity: 1;
            visibility: visible;
            transform: translate(-50%, 0);
          }

          :host([data-dismissed]) .tip {
            opacity: 0;
            visibility: hidden;
          }

          @media (prefers-reduced-motion: reduce) {
            .tip {
              transition: none;
            }
          }
        </style>
        <span class="trigger" tabindex="0"><slot></slot></span>
        <span class="tip" role="tooltip"></span>
      `;

      this.trigger = this.shadowRoot.querySelector(".trigger");
      this.tip = this.shadowRoot.querySelector(".tip");
      this.tip.id = `vfx-tooltip-description-${this.instanceId}`;
      this.trigger.setAttribute("aria-describedby", this.tip.id);

      this.handlePointerEnter = () => { this.removeAttribute("data-dismissed"); this.setAttribute("data-active", ""); };
      this.handlePointerLeave = () => { if (!this.matches(":focus-within")) this.removeAttribute("data-active"); this.removeAttribute("data-dismissed"); };
      this.handleFocusIn = () => { this.removeAttribute("data-dismissed"); this.setAttribute("data-active", ""); };
      this.handleFocusOut = () => { if (!this.matches(":focus-within") && !this.matches(":hover")) this.removeAttribute("data-active"); };
      this.handleKeyDown = (event) => {
        if (event.key !== "Escape") return;
        if (!this.matches(":hover") && !this.matches(":focus-within")) return;

        event.preventDefault();
        this.setAttribute("data-dismissed", "");
        this.removeAttribute("data-active");
        this.trigger.blur();
      };
      this.handleViewportChange = () => this.updatePlacement();
    }

    connectedCallback() {
      this.updateText();
      this.addEventListener("pointerenter", this.handlePointerEnter);
      this.addEventListener("pointerleave", this.handlePointerLeave);
      this.trigger.addEventListener("focus", this.handleFocusIn);
      this.trigger.addEventListener("blur", this.handleFocusOut);
      this.addEventListener("keydown", this.handleKeyDown);
      window.addEventListener("resize", this.handleViewportChange, { passive: true });
      window.addEventListener("scroll", this.handleViewportChange, true);

      if (typeof ResizeObserver !== "undefined") {
        this.resizeObserver = new ResizeObserver(this.handleViewportChange);
        this.resizeObserver.observe(this);
        this.resizeObserver.observe(this.tip);
      }

      this.updatePlacement();
    }

    disconnectedCallback() {
      this.removeEventListener("pointerenter", this.handlePointerEnter);
      this.removeEventListener("pointerleave", this.handlePointerLeave);
      this.trigger.removeEventListener("focus", this.handleFocusIn);
      this.trigger.removeEventListener("blur", this.handleFocusOut);
      this.removeEventListener("keydown", this.handleKeyDown);
      window.removeEventListener("resize", this.handleViewportChange);
      window.removeEventListener("scroll", this.handleViewportChange, true);
      this.resizeObserver?.disconnect();
    }

    attributeChangedCallback(name) {
      if (!this.tip) return;
      if (name === "text") this.updateText();
      if (name === "placement" && this.isConnected) this.updatePlacement();
    }

    updateText() {
      this.tip.textContent = this.getAttribute("text") || "Helpful information";
    }

    updatePlacement() {
      if (!this.isConnected || !this.trigger || !this.tip) return;

      const triggerRect = this.trigger.getBoundingClientRect();
      const tipRect = this.tip.getBoundingClientRect();
      const margin = 8;
      const halfWidth = tipRect.width / 2;
      const viewportWidth = document.documentElement.clientWidth || window.innerWidth;

      const minCenter = margin + halfWidth;
      const maxCenter = Math.max(minCenter, viewportWidth - margin - halfWidth);
      const desiredCenter = triggerRect.left + triggerRect.width / 2;
      const clampedCenter = Math.min(maxCenter, Math.max(minCenter, desiredCenter));
      const hostRect = this.getBoundingClientRect();

      this.tip.style.left = `${clampedCenter - hostRect.left}px`;

      const requestedPlacement = this.getAttribute("placement") || "auto";
      const explicitPlacement = requestedPlacement === "top" || requestedPlacement === "bottom";
      let placement = explicitPlacement ? requestedPlacement : "top";

      if (!explicitPlacement) {
        const spaceAbove = triggerRect.top;
        const spaceBelow = window.innerHeight - triggerRect.bottom;
        const requiredSpace = tipRect.height + 14;

        if (spaceAbove < requiredSpace && spaceBelow > spaceAbove) {
          placement = "bottom";
        }
      }

      this.setAttribute("data-placement", placement);

      const tooltipLeft = clampedCenter - halfWidth;
      const arrowLeft = Math.min(
        Math.max(desiredCenter - tooltipLeft, 8),
        Math.max(8, tipRect.width - 8)
      );
      this.tip.style.setProperty("--vfx-tooltip-arrow-left", `${arrowLeft}px`);
    }
  }

  customElements.define("vfx-tooltip", VFXTooltip);
})();
