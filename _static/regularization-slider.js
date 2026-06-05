(() => {
  "use strict";

  function initRegularizationSlider(widget) {
    if (widget.dataset.initialized === "true") {
      return;
    }

    widget.dataset.initialized = "true";

    const slider = widget.querySelector(".reg-slider");
    const sliderValue = widget.querySelector(".reg-slider-value");
    const outputDisplay = widget.querySelector(".reg-output");

    if (!slider || !sliderValue || !outputDisplay) {
      widget.insertAdjacentHTML(
        "beforeend",
        '<p style="color: red;">Regularization slider could not initialize: missing elements.</p>',
      );
      return;
    }

    function updateDisplay() {
      const lambda = parseFloat(slider.value);
      sliderValue.textContent = lambda.toFixed(2);

      // Simulate regularization effect
      const unregularizedWeights = [2.5, 1.8, 1.2];
      const regularizedWeights = unregularizedWeights.map(
        (w) => w / (1 + lambda),
      );

      const html = `
        <div style="font-size: 14px; line-height: 1.6;">
          <p><strong>λ = ${lambda.toFixed(2)}</strong></p>
          <p style="margin: 10px 0;">Regularized Weights:</p>
          <div style="background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace;">
            <div>w₁: ${regularizedWeights[0].toFixed(3)}</div>
            <div>w₂: ${regularizedWeights[1].toFixed(3)}</div>
            <div>w₃: ${regularizedWeights[2].toFixed(3)}</div>
          </div>
          <p style="margin-top: 10px; color: #666; font-size: 12px;">
            Increase λ to shrink weights and reduce overfitting
          </p>
        </div>
      `;
      outputDisplay.innerHTML = html;
    }

    slider.addEventListener("input", updateDisplay);
    updateDisplay();

    console.log("Regularization slider widget initialized successfully");
  }

  // Initialize on load or immediately if DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      document
        .querySelectorAll("[data-regularization-slider]")
        .forEach(initRegularizationSlider);
    });
  } else {
    document
      .querySelectorAll("[data-regularization-slider]")
      .forEach(initRegularizationSlider);
  }
})();
