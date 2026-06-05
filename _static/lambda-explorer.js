document.addEventListener('DOMContentLoaded', () => {
const lambdas = [0, 0.02, 0.05, 0.1, 0.3, 0.5, 1.0];

const ridgeWeights = [
  [-32623, 135403, -215493, 155315, -42559],  // λ=0
  [97.8,   36.6,   -8.5,   -35.0,  -44.6],   // λ=0.02
  [75.2,   32.1,   -2.1,   -26.0,  -37.8],   // λ=0.05
  [56.5,   28.1,    3.7,   -15.1,  -28.4],   // λ=0.10
  [32.1,   18.2,    6.2,    -5.3,  -14.1],   // λ=0.30
  [21.4,   13.4,    6.5,    -1.2,   -8.7],   // λ=0.50
  [12.3,    8.2,    5.1,     1.2,   -4.2],   // λ=1.00
];

const lassoWeights = [
  [-646.4, 2046.6,    0, -3351.0, 2007.9],   // λ=0
  [-646.4, 2046.6,    0, -3351.0, 2007.9],   // λ=0.02
  [ 480.2,  800.1,    0, -1100.0,  600.0],   // λ=0.05
  [ 355.4,    0,  -494.8,     0,   196.5],   // λ=0.10
  [ 220.1,    0,  -150.2,     0,    80.3],   // λ=0.30
  [ 180.0,    0,      0,  -120.0,   40.1],   // λ=0.50
  [ 147.4,    0,      0,   -99.3,      0],   // λ=1.00
];

const featureLabels = ['w₁ (x)', 'w₂ (x²)', 'w₃ (x³)', 'w₄ (x⁴)', 'w₅ (x⁵)'];
const featureColors = ['#1a4a8a', '#2a7a5a', '#8a5a1a', '#8a1a1a', '#5a1a8a'];

function buildDatasets(weights) {
  return featureLabels.map((lbl, fi) => ({
    label: lbl,
    data: lambdas.map((lam, li) => ({ x: lam, y: weights[li][fi] })),
    borderColor: featureColors[fi],
    backgroundColor: featureColors[fi],
    borderWidth: 2,
    pointRadius: 4,
    pointHoverRadius: 6,
    tension: 0.3,
    fill: false,
  }));
}

const canvas = document.getElementById('lambdaChart');
if (!canvas || typeof Chart === 'undefined') {
  console.error('Lambda explorer could not load: Chart.js is missing or the canvas was not found.');
  return;
}
const ctx = canvas.getContext('2d');
const chart = new Chart(ctx, {
  type: 'line',
  data: { datasets: buildDatasets(ridgeWeights) },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        labels: { font: { size: 12 }, boxWidth: 14, padding: 10 }
      }
    },
    scales: {
      x: {
        type: 'linear', min: 0, max: 1,
        title: { display: true, text: 'λ', font: { size: 13, weight: 'bold' } },
        grid: { color: 'rgba(0,0,0,.06)' },
        ticks: { color: '#8c897f', font: { size: 11 } }
      },
      y: {
        title: { display: true, text: 'Weight value', font: { size: 12 } },
        grid: { color: 'rgba(0,0,0,.06)' },
        ticks: { color: '#8c897f', font: { size: 11 } }
      }
    }
  }
});

let current = 'ridge';
function setMethod(m) {
  if (current === m) return;
  current = m;

  document.getElementById('mb-ridge').classList.toggle('active', m === 'ridge');
  document.getElementById('mb-lasso').classList.toggle('active', m === 'lasso');
  document.getElementById('ridge-insight').style.display = m === 'ridge' ? 'block' : 'none';
  document.getElementById('lasso-insight').style.display = m === 'lasso' ? 'block' : 'none';

  const weights = m === 'ridge' ? ridgeWeights : lassoWeights;
  chart.data.datasets = buildDatasets(weights);

  // Adjust y-axis: Ridge needs a tighter range after λ=0 is shown,
  // Lasso has large values at λ=0 too — clamp to readable range
  chart.options.scales.y.min = undefined;
  chart.options.scales.y.max = undefined;

  chart.update();
}

  document.querySelectorAll('.lambda-explorer .tab-btn[data-method]').forEach((button) => {
    button.addEventListener('click', () => setMethod(button.dataset.method));
  });

  window.setMethod = setMethod;
});
