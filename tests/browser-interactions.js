(() => {
  const results = [];
  const failures = [];
  const errors = [];

  window.addEventListener("error", (event) => {
    errors.push(event.message || "Uncaught browser error");
  });

  function assert(condition, message) {
    if (!condition) throw new Error(message);
  }

  function test(name, run) {
    try {
      run();
      results.push({ name, status: "passed" });
    } catch (error) {
      failures.push({ name, message: error?.message || String(error) });
      results.push({ name, status: "failed", message: error?.message || String(error) });
    }
  }

  function createTabs({ items = "Overview,Details", value, orientation = "horizontal" } = {}) {
    const tabs = document.createElement("vfx-tabs");
    tabs.setAttribute("items", items);
    tabs.setAttribute("label", "Test content sections");
    tabs.setAttribute("orientation", orientation);
    if (value) tabs.setAttribute("value", value);

    for (const label of items.split(",").map((item) => item.trim()).filter(Boolean)) {
      const panel = document.createElement("section");
      panel.slot = label;
      panel.textContent = label + " panel content";
      tabs.append(panel);
    }

    document.body.append(tabs);
    return tabs;
  }

  function fireKey(target, key) {
    const event = new KeyboardEvent("keydown", {
      key,
      bubbles: true,
      cancelable: true,
      composed: true
    });
    target.dispatchEvent(event);
    return event;
  }

  test("tabs expose reciprocal tab and tabpanel relationships with slotted content", () => {
    const tabs = createTabs({ items: "Overview,Features,Details" });
    const shadow = tabs.shadowRoot;
    const tablist = shadow.querySelector('[role="tablist"]');
    const tabNodes = [...shadow.querySelectorAll('[role="tab"]')];
    const panels = [...shadow.querySelectorAll('[role="tabpanel"]')];

    assert(tablist?.getAttribute("aria-label") === "Test content sections", "Tablist accessible name was not applied.");
    assert(tablist?.getAttribute("aria-orientation") === "horizontal", "Horizontal orientation was not exposed.");
    assert(tabNodes.length === 3 && panels.length === 3, "Expected three tabs and three tabpanels.");

    for (let index = 0; index < tabNodes.length; index += 1) {
      const tab = tabNodes[index];
      const panel = panels[index];
      assert(tab.getAttribute("aria-controls") === panel.id, "Tab aria-controls does not point to its panel.");
      assert(panel.getAttribute("aria-labelledby") === tab.id, "Panel aria-labelledby does not point to its tab.");
      assert(panel.querySelector("slot")?.name === tab.textContent, "Panel slot does not match its tab label.");
      assert(panel.querySelector("slot")?.assignedElements().length === 1, "Named panel content was not assigned to its slot.");
      assert(panel.hidden === (index !== 0), "Initial active/inactive panel visibility is incorrect.");
      assert(tab.tabIndex === (index === 0 ? 0 : -1), "Roving tab index is incorrect.");
    }
  });

  test("horizontal tabs activate on click and Arrow/Home/End keys while retaining focus", () => {
    const tabs = createTabs({ items: "Overview,Features,Details" });
    const shadow = tabs.shadowRoot;
    let changeValue = "";
    tabs.addEventListener("change", (event) => { changeValue = event.detail?.value || ""; });

    const first = shadow.querySelectorAll('[role="tab"]')[0];
    first.focus();
    const arrow = fireKey(first, "ArrowRight");
    assert(arrow.defaultPrevented, "ArrowRight was not consumed by horizontal tabs.");
    assert(tabs.value === "Features", "ArrowRight did not select the next tab.");
    assert(shadow.activeElement?.textContent === "Features", "Focus did not move to the newly selected tab.");
    assert(changeValue === "Features", "The change event did not expose the selected value.");
    assert(shadow.querySelectorAll('[role="tabpanel"]')[1].hidden === false, "Selected panel remained hidden.");

    fireKey(shadow.querySelectorAll('[role="tab"]')[1], "End");
    assert(tabs.value === "Details", "End did not select the last tab.");
    fireKey(shadow.querySelectorAll('[role="tab"]')[2], "Home");
    assert(tabs.value === "Overview", "Home did not select the first tab.");

    shadow.querySelectorAll('[role="tab"]')[1].click();
    assert(tabs.value === "Features", "Click did not activate the selected tab.");
  });

  test("vertical tabs use Up/Down keys instead of Left/Right", () => {
    const tabs = createTabs({ items: "One,Two,Three", orientation: "vertical" });
    const shadow = tabs.shadowRoot;
    const tablist = shadow.querySelector('[role="tablist"]');
    const first = shadow.querySelectorAll('[role="tab"]')[0];

    assert(tablist.getAttribute("aria-orientation") === "vertical", "Vertical orientation was not exposed.");
    first.focus();
    fireKey(first, "ArrowDown");
    assert(tabs.value === "Two", "ArrowDown did not select the next vertical tab.");
    fireKey(shadow.querySelectorAll('[role="tab"]')[1], "ArrowUp");
    assert(tabs.value === "One", "ArrowUp did not select the previous vertical tab.");
  });

  test("programmatic tab selection updates the visible panel and instances get unique IDs", () => {
    const first = createTabs({ items: "Summary,Details", value: "Summary" });
    const second = createTabs({ items: "Summary,Details", value: "Details" });

    first.value = "Details";
    assert(first.value === "Details", "The value setter did not update the selected tab.");
    assert(first.shadowRoot.querySelectorAll('[role="tabpanel"]')[1].hidden === false, "Programmatic selection did not expose its panel.");
    assert(second.value === "Details", "A separate tab instance changed unexpectedly.");

    const firstIds = [...first.shadowRoot.querySelectorAll('[role="tab"], [role="tabpanel"]')].map((node) => node.id);
    const secondIds = [...second.shadowRoot.querySelectorAll('[role="tab"], [role="tabpanel"]')].map((node) => node.id);
    assert(new Set([...firstIds, ...secondIds]).size === firstIds.length + secondIds.length, "Tab/panel IDs collide across instances.");
  });

  test("radio groups enforce required validity, submit values, and restore their initial value", () => {
    const form = document.createElement("form");
    const radio = document.createElement("vfx-radio");
    radio.setAttribute("label", "Plan");
    radio.setAttribute("name", "plan");
    radio.setAttribute("options", "Basic,Pro,Enterprise");
    radio.setAttribute("value", "Basic");
    radio.required = true;
    form.append(radio);
    document.body.append(form);

    const inputs = [...radio.shadowRoot.querySelectorAll('input[type="radio"]')];
    assert(inputs.length === 3, "Expected three native radio inputs.");
    assert(inputs.every((input) => input.name === "plan" && input.required), "Native radio name/required state was not applied.");
    assert(radio.shadowRoot.querySelector('[role="radiogroup"]').getAttribute("aria-label") === "Plan", "Radiogroup accessible name was not applied.");
    assert(form.checkValidity(), "A required group with its initial selected value should be valid.");

    inputs[1].click();
    assert(radio.value === "Pro", "Native radio click did not synchronize the host value.");
    assert(new FormData(form).get("plan") === "Pro", "FormData did not include the custom radio group's selected value.");

    form.reset();
    assert(radio.value === "Basic", "Form reset did not restore the initial radio value.");

    radio.disabled = true;
    assert(radio.shadowRoot.querySelectorAll("input:disabled").length === 3, "Disabled state was not reflected to native radio inputs.");
    assert(radio.shadowRoot.querySelector('[role="radiogroup"]').getAttribute("aria-disabled") === "true", "Disabled state was not exposed on the radiogroup.");
    radio.disabled = false;
    assert(radio.shadowRoot.querySelectorAll("input:disabled").length === 0, "Enabling the group did not enable its native inputs.");
  });

  test("required radio groups reject an empty value and accept a user selection", () => {
    const form = document.createElement("form");
    const radio = document.createElement("vfx-radio");
    radio.setAttribute("label", "Required answer");
    radio.setAttribute("name", "answer");
    radio.setAttribute("options", "Yes,No");
    radio.required = true;
    form.append(radio);
    document.body.append(form);

    assert(radio.value === "", "A required group without an initial value should start unselected.");
    assert(form.checkValidity() === false, "An empty required radio group should fail form validity.");

    radio.shadowRoot.querySelectorAll('input[type="radio"]')[0].click();
    assert(radio.value === "Yes", "Selecting a required option did not update the host value.");
    assert(form.checkValidity() === true, "A selected required radio group should pass form validity.");
  });

  test("independent radio components do not share an implicit native group name", () => {
    const first = document.createElement("vfx-radio");
    const second = document.createElement("vfx-radio");
    first.setAttribute("options", "A,B");
    second.setAttribute("options", "A,B");
    document.body.append(first, second);

    const firstInputs = [...first.shadowRoot.querySelectorAll('input[type="radio"]')];
    const secondInputs = [...second.shadowRoot.querySelectorAll('input[type="radio"]')];
    assert(firstInputs[0].name !== secondInputs[0].name, "Implicit radio names collide across component instances.");

    firstInputs[1].click();
    assert(first.value === "B", "First radio instance did not change.");
    assert(second.value === "A", "Selecting one instance affected another instance.");
  });

  test("tooltip exposes its description, opens on focus, dismisses with Escape, and reopens", () => {
    const tooltip = document.createElement("vfx-tooltip");
    tooltip.setAttribute("text", "A helpful description");
    tooltip.textContent = "Focus trigger";
    document.body.append(tooltip);

    const trigger = tooltip.shadowRoot.querySelector(".trigger");
    const description = tooltip.shadowRoot.querySelector('[role="tooltip"]');
    assert(trigger.getAttribute("aria-describedby") === description.id, "aria-describedby does not resolve to the tooltip.");
    assert(description.textContent === "A helpful description", "Tooltip text was not rendered.");

    trigger.focus();
    assert(tooltip.matches(":focus-within"), "Tooltip trigger did not receive focus.");
    assert(tooltip.hasAttribute("data-active"), "Trigger focus did not set data-active.");
    const focusVisibility = getComputedStyle(description).visibility;
    assert(focusVisibility === "visible", "Tooltip was not visible on focus. visibility=" + focusVisibility + ", active=" + tooltip.hasAttribute("data-active") + ", display=" + getComputedStyle(description).display + ", opacity=" + getComputedStyle(description).opacity);

    const escape = fireKey(trigger, "Escape");
    assert(escape.defaultPrevented, "Escape was not consumed.");
    assert(tooltip.hasAttribute("data-dismissed"), "Escape did not mark the tooltip as dismissed.");
    assert(getComputedStyle(description).visibility === "hidden", "Dismissed tooltip remained visible.");

    trigger.focus();
    assert(!tooltip.hasAttribute("data-dismissed"), "Refocusing did not restore the tooltip.");
    assert(getComputedStyle(description).visibility === "visible", "Tooltip did not reopen on focus.");
  });

  test("tooltip text updates live and placement remains inside the viewport", () => {
    const tooltip = document.createElement("vfx-tooltip");
    tooltip.setAttribute("text", "A short hint");
    tooltip.setAttribute("placement", "auto");
    tooltip.textContent = "Right edge trigger";
    tooltip.style.position = "fixed";
    tooltip.style.right = "0";
    tooltip.style.top = "0";
    document.body.append(tooltip);

    tooltip.setAttribute("text", "Updated tooltip text");
    assert(tooltip.tip.textContent === "Updated tooltip text", "Changing the text attribute did not update the description.");
    assert(tooltip.getAttribute("data-placement") === "bottom", "Automatic placement did not flip below a trigger near the top edge.");

    const tipRect = tooltip.tip.getBoundingClientRect();
    assert(tipRect.left >= 7, "Tooltip extends beyond the left viewport margin.");
    assert(tipRect.right <= document.documentElement.clientWidth + 1, "Tooltip extends beyond the right viewport margin.");

    tooltip.setAttribute("placement", "bottom");
    assert(tooltip.getAttribute("data-placement") === "bottom", "Explicit bottom placement was not applied.");
  });

  const passed = results.filter((result) => result.status === "passed").length;
  const failed = results.filter((result) => result.status === "failed").length;
  const report = { browser: navigator.userAgent, passed, failed, errors, results, failures };
  document.body.dataset.browserTestStatus = failed || errors.length ? "failed" : "passed";
  document.querySelector("#browser-test-results").textContent = JSON.stringify(report, null, 2);
})();
