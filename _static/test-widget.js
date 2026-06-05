(() => {
  "use strict";

  function initTestWidget(widget) {
    if (widget.dataset.initialized === "true") {
      return;
    }

    widget.dataset.initialized = "true";

    const display = widget.querySelector(".test-display");
    const incrementBtn = widget.querySelector(".test-increment");
    const decrementBtn = widget.querySelector(".test-decrement");

    if (!display || !incrementBtn || !decrementBtn) {
      widget.insertAdjacentHTML(
        "beforeend",
        '<p style="color: red;">Test widget could not start: missing elements.</p>'
      );
      return;
    }

    let count = 0;

    function updateDisplay() {
      display.textContent = count;
    }

    incrementBtn.addEventListener("click", () => {
      count++;
      updateDisplay();
    });

    decrementBtn.addEventListener("click", () => {
      count--;
      updateDisplay();
    });

    updateDisplay();
    console.log("Test widget initialized successfully");
  }

  // Initialize on load or immediately if DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      document.querySelectorAll("[data-test-widget]").forEach(initTestWidget);
    });
  } else {
    document.querySelectorAll("[data-test-widget]").forEach(initTestWidget);
  }
})();
