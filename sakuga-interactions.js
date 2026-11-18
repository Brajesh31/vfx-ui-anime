// Host-page wiring for the original Sakuga VFX demos.
(() => {
  const byId = (id) => document.getElementById(id);
  const status = (id, message) => {
    const node = byId(id);
    if (node) node.textContent = message;
  };

  const confirm = byId("sakuga-confirm");
  confirm?.addEventListener("click", async () => {
    status("sakuga-button-status", "Clicked, waiting for the action to succeed…");
    // This showcase uses a small local demo action. The success mark is deliberately
    // delayed so the click effect and the success state remain distinct.
    await new Promise((resolve) => window.setTimeout(resolve, 760));
    confirm.done();
    status("sakuga-button-status", "Completed successfully.");
  });

  byId("sakuga-cancel")?.addEventListener("click", () => {
    status("sakuga-secondary-status", "Cancelled.");
  });

  byId("sakuga-toggle")?.addEventListener("change", (event) => {
    const control = event.currentTarget;
    status("sakuga-toggle-status", control.checked ? "Notifications enabled." : "Notifications disabled.");
  });
  byId("sakuga-checkbox")?.addEventListener("change", (event) => {
    status("sakuga-checkbox-status", event.currentTarget.checked ? "Choice selected." : "Choice cleared.");
  });
  byId("sakuga-radio")?.addEventListener("change", (event) => {
    status("sakuga-radio-status", `Selected: ${event.currentTarget.value}`);
  });
  byId("sakuga-input")?.addEventListener("input", (event) => {
    status("sakuga-input-status", event.currentTarget.value ? "Text entered." : "Start typing.");
  });
  byId("sakuga-slider")?.addEventListener("input", (event) => {
    status("sakuga-slider-status", `Intensity: ${event.currentTarget.value}`);
  });
  byId("sakuga-tabs")?.addEventListener("change", (event) => {
    status("sakuga-tabs-status", `Selected tab: ${event.detail?.label ?? event.currentTarget.selected}`);
  });
  byId("sakuga-rating")?.addEventListener("change", (event) => {
    status("sakuga-rating-status", `Rating: ${event.currentTarget.value} / 5`);
  });

  const progress = byId("sakuga-progress");
  let progressTimer = null;
  const stopProgress = () => {
    if (progressTimer !== null) window.clearInterval(progressTimer);
    progressTimer = null;
  };
  byId("sakuga-progress-start")?.addEventListener("click", () => {
    stopProgress();
    progress.reset();
    let value = 0;
    status("sakuga-progress-status", "Loading…");
    progressTimer = window.setInterval(() => {
      value = Math.min(1, value + 0.035);
      progress.set(value);
      if (value >= 1) {
        stopProgress();
        status("sakuga-progress-status", "Progress complete.");
      }
    }, 100);
  });
  byId("sakuga-progress-reset")?.addEventListener("click", () => {
    stopProgress();
    progress.reset();
    status("sakuga-progress-status", "Progress reset.");
  });
  progress?.addEventListener("sakuga:done", () => {
    stopProgress();
    status("sakuga-progress-status", "Progress complete.");
  });

  byId("sakuga-toast-show")?.addEventListener("click", () => {
    byId("sakuga-toast").show("Saved successfully!");
    status("sakuga-toast-status", "Notification displayed.");
  });
})();
