(function () {
  const lambdas = [0, 0.02, 0.05, 0.1, 0.3, 0.5, 1.0];

  const ridgeWeights = [
    [-32623, 135403, -215493, 155315, -42559],
    [97.8, 36.6, -8.5, -35.0, -44.6],
    [75.2, 32.1, -2.1, -26.0, -37.8],
    [56.5, 28.1, 3.7, -15.1, -28.4],
    [32.1, 18.2, 6.2, -5.3, -14.1],
    [21.4, 13.4, 6.5, -1.2, -8.7],
    [12.3, 8.2, 5.1, 1.2, -4.2]
  ];

  const lassoWeights = [
    [-646.4, 2046.6, 0, -3351.0, 2007.9],
    [-646.4, 2046.6, 0, -3351.0, 2007.9],
    [480.2, 800.1, 0, -1100.0, 600.0],
    [355.4, 0, -494.8, 0, 196.5],
    [220.1, 0, -150.2, 0, 80.3],
    [180.0, 0, 0, -120.0, 40.1],
    [147.4, 0, 0, -99.3, 0]
  ];

  const featureLabels = ["w₁ (x)", "w₂ (x²)", "w₃ (x³)", "w₄ (x⁴)", "w₅ (x⁵)"];
  const featureColors = ["#1a4a8a", "#2a7a5a", "#8a5a1a", "#8a1a1a", "#5a1a8a"];

  function buildDatasets(weights) {
    return featureLabels.map(function (label, featureIndex) {
      return {
        label: label,
        data: lambdas.map(function (lambda, lambdaIndex) {
          return { x: lambda, y: weights[lambdaIndex][featureIndex] };
        }),
        borderColor: featureColors[featureIndex],
        backgroundColor: featureColors[featureIndex],
        borderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
        tension: 0.3,
        fill: false
      };
    });
  }

  function showError(widget, message) {
    const error = document.createElement("div");
    error.className = "lambda-error";
    error.textContent = message;
    widget.appendChild(error);
  }

  function initLambdaExplorer(widget) {
    if (widget.dataset.lambdaExplorerInitialized === "true") return;
    widget.dataset.lambdaExplorerInitialized = "true";

    if (typeof Chart === "undefined") {
      showError(widget, "Chart.js did not load. Add Chart.js before lambda-explorer-widget.js in myst.yml.");
      return;
    }

    const canvas = widget.querySelector(".lambda-chart");
    const ridgeInsight = widget.querySelector(".lambda-ridge-insight");
    const lassoInsight = widget.querySelector(".lambda-lasso-insight");
    const buttons = widget.querySelectorAll(".lambda-tab");

    if (!canvas) {
      showError(widget, "The lambda explorer canvas was not found.");
      return;
    }

    const chart = new Chart(canvas.getContext("2d"), {
      type: "line",
      data: { datasets: buildDatasets(ridgeWeights) },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            labels: {
              font: { size: 12 },
              boxWidth: 14,
              padding: 10
            }
          }
        },
        scales: {
          x: {
            type: "linear",
            min: 0,
            max: 1,
            title: {
              display: true,
              text: "λ",
              font: { size: 13, weight: "bold" }
            },
            grid: { color: "rgba(0,0,0,.06)" },
            ticks: { color: "#6f6b63", font: { size: 11 } }
          },
          y: {
            title: {
              display: true,
              text: "Weight value",
              font: { size: 12 }
            },
            grid: { color: "rgba(0,0,0,.06)" },
            ticks: { color: "#6f6b63", font: { size: 11 } }
          }
        }
      }
    });

    function setMethod(method) {
      chart.data.datasets = buildDatasets(method === "ridge" ? ridgeWeights : lassoWeights);
      chart.update();

      buttons.forEach(function (button) {
        button.classList.toggle("active", button.dataset.method === method);
      });

      ridgeInsight.hidden = method !== "ridge";
      lassoInsight.hidden = method !== "lasso";
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        setMethod(button.dataset.method);
      });
    });
  }

  function initAllLambdaExplorers() {
    document.querySelectorAll("[data-lambda-explorer-widget]").forEach(initLambdaExplorer);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllLambdaExplorers);
  } else {
    initAllLambdaExplorers();
  }
})();
