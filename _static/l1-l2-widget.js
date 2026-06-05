(() => {
  "use strict";

  function initL1L2Widget(widget) {
    if (widget.dataset.initialized === "true") {
      return;
    }

    widget.dataset.initialized = "true";

    const canvas = widget.querySelector(".l1-l2-plot");
    const lossSlider = widget.querySelector(".loss-size");
    const angleSlider = widget.querySelector(".angle");
    const lossSizeValue = widget.querySelector(".loss-size-value");
    const angleValue = widget.querySelector(".angle-value");
    const circleButton = widget.querySelector(".circle-button");
    const diamondButton = widget.querySelector(".diamond-button");

    if (!canvas || !lossSlider || !angleSlider || !lossSizeValue || !angleValue || !circleButton || !diamondButton) {
      widget.insertAdjacentHTML(
        "beforeend",
        '<p class="error">The L1/L2 visualization could not start because one or more required elements are missing.</p>'
      );
      return;
    }

    const ctx = canvas.getContext("2d");

    if (!ctx) {
      widget.insertAdjacentHTML(
        "beforeend",
        '<p class="error">The L1/L2 visualization could not start because this browser does not support canvas rendering.</p>'
      );
      return;
    }

    let constraintShape = "diamond";
    let animationFrame = null;

    const constraintRadius = 1.5;

    const xMin = -7;
    const xMax = 7;
    const yMin = -7;
    const yMax = 7;

    const width = canvas.width;
    const height = canvas.height;

    const scaleX = width / (xMax - xMin);
    const scaleY = height / (yMax - yMin);
    const scale = Math.min(scaleX, scaleY);

    function toCanvasX(x) {
      return (x - xMin) * scaleX;
    }

    function toCanvasY(y) {
      return height - (y - yMin) * scaleY;
    }

    function drawLine(x1, y1, x2, y2, color = "black", lineWidth = 2) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(x1), toCanvasY(y1));
      ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.stroke();
    }

    function drawCircle(x, y, r, options = {}) {
      ctx.beginPath();
      ctx.arc(
        toCanvasX(x),
        toCanvasY(y),
        r * scale,
        0,
        2 * Math.PI
      );

      if (options.fill) {
        ctx.fillStyle = options.fill;
        ctx.globalAlpha = options.alpha ?? 1;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (options.stroke) {
        ctx.strokeStyle = options.stroke;
        ctx.lineWidth = options.lineWidth ?? 2;
        ctx.stroke();
      }
    }

    function drawPolygon(points, options = {}) {
      ctx.beginPath();
      ctx.moveTo(toCanvasX(points[0][0]), toCanvasY(points[0][1]));

      for (let i = 1; i < points.length; i += 1) {
        ctx.lineTo(toCanvasX(points[i][0]), toCanvasY(points[i][1]));
      }

      ctx.closePath();

      if (options.fill) {
        ctx.fillStyle = options.fill;
        ctx.globalAlpha = options.alpha ?? 1;
        ctx.fill();
        ctx.globalAlpha = 1;
      }

      if (options.stroke) {
        ctx.strokeStyle = options.stroke;
        ctx.lineWidth = options.lineWidth ?? 2;
        ctx.stroke();
      }
    }

    function drawText(text, x, y, size = 24, color = "black") {
      ctx.fillStyle = color;
      ctx.font = `${size}px Arial`;
      ctx.fillText(text, toCanvasX(x), toCanvasY(y));
    }

    function drawArrow(x1, y1, x2, y2, color = "black") {
      const headLength = 0.25;
      const headWidth = 0.15;

      drawLine(x1, y1, x2, y2, color, 2);

      const angle = Math.atan2(y2 - y1, x2 - x1);
      const hyp = Math.sqrt(headLength ** 2 + headWidth ** 2);

      const leftAngle = angle + Math.PI - Math.atan2(headWidth, headLength);
      const rightAngle = angle + Math.PI + Math.atan2(headWidth, headLength);

      const leftX = x2 + hyp * Math.cos(leftAngle);
      const leftY = y2 + hyp * Math.sin(leftAngle);

      const rightX = x2 + hyp * Math.cos(rightAngle);
      const rightY = y2 + hyp * Math.sin(rightAngle);

      drawPolygon(
        [
          [x2, y2],
          [leftX, leftY],
          [rightX, rightY]
        ],
        { fill: color }
      );
    }

    function add(a, b) {
      return [a[0] + b[0], a[1] + b[1]];
    }

    function sub(a, b) {
      return [a[0] - b[0], a[1] - b[1]];
    }

    function mul(s, v) {
      return [s * v[0], s * v[1]];
    }

    function dot(a, b) {
      return a[0] * b[0] + a[1] * b[1];
    }

    function cross2(a, b) {
      return a[0] * b[1] - a[1] * b[0];
    }

    function norm(v) {
      return Math.sqrt(v[0] ** 2 + v[1] ** 2);
    }

    function normalize(v) {
      const n = norm(v);

      if (n === 0) {
        return [0, 0];
      }

      return [v[0] / n, v[1] / n];
    }

    function clip(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function degToRad(deg) {
      return deg * Math.PI / 180;
    }

    function radToDeg(rad) {
      return rad * 180 / Math.PI;
    }

    function drawDiamondCenterPath(r, R) {
      const top = [0, r];
      const right = [r, 0];
      const bottom = [0, -r];
      const left = [-r, 0];

      const sideData = [
        [top, right, [1, 1]],
        [right, bottom, [1, -1]],
        [bottom, left, [-1, -1]],
        [left, top, [-1, 1]]
      ];

      for (const [start, end, normalRaw] of sideData) {
        const normal = normalize(normalRaw);

        const offsetStart = add(start, mul(R, normal));
        const offsetEnd = add(end, mul(R, normal));

        drawLine(
          offsetStart[0],
          offsetStart[1],
          offsetEnd[0],
          offsetEnd[1],
          "gold",
          4
        );
      }

      const cornerData = [
        [top, 45, 135],
        [right, -45, 45],
        [bottom, -135, -45],
        [left, 135, 225]
      ];

      for (const [vertex, startAngle, endAngle] of cornerData) {
        ctx.beginPath();

        const steps = 80;

        for (let i = 0; i <= steps; i += 1) {
          const t = i / steps;
          const angle = degToRad(startAngle + t * (endAngle - startAngle));

          const x = vertex[0] + R * Math.cos(angle);
          const y = vertex[1] + R * Math.sin(angle);

          if (i === 0) {
            ctx.moveTo(toCanvasX(x), toCanvasY(y));
          } else {
            ctx.lineTo(toCanvasX(x), toCanvasY(y));
          }
        }

        ctx.strokeStyle = "green";
        ctx.lineWidth = 4;
        ctx.stroke();
      }
    }

    function getDiamondTangentGeometry(angle, r, R) {
      const theta = degToRad(((angle % 360) + 360) % 360);
      const direction = [Math.cos(theta), Math.sin(theta)];

      const top = [0, r];
      const right = [r, 0];
      const bottom = [0, -r];
      const left = [-r, 0];

      const candidates = [];

      const sideData = [
        [top, right, [1, 1]],
        [right, bottom, [1, -1]],
        [bottom, left, [-1, -1]],
        [left, top, [-1, 1]]
      ];

      for (const [sideStart, sideEnd, normalRaw] of sideData) {
        const normal = normalize(normalRaw);

        const offsetStart = add(sideStart, mul(R, normal));
        const offsetEnd = add(sideEnd, mul(R, normal));
        const segment = sub(offsetEnd, offsetStart);
        const denom = cross2(direction, segment);

        if (Math.abs(denom) < 1e-12) {
          continue;
        }

        const s = cross2(offsetStart, segment) / denom;
        let u = cross2(offsetStart, direction) / denom;

        if (s >= 0 && -1e-9 <= u && u <= 1 + 1e-9) {
          u = clip(u, 0, 1);

          const lossCenter = mul(s, direction);
          const wStar = add(
            mul(1 - u, sideStart),
            mul(u, sideEnd)
          );

          candidates.push({
            s,
            wStar,
            lossCenter,
            color: "gold"
          });
        }
      }

      const cornerData = [
        [top, 45, 135],
        [right, -45, 45],
        [bottom, -135, -45],
        [left, 135, 225]
      ];

      for (const [vertex, startAngle, endAngle] of cornerData) {
        const b = -2 * dot(direction, vertex);
        const c = dot(vertex, vertex) - R ** 2;
        const disc = b ** 2 - 4 * c;

        if (disc < 0) {
          continue;
        }

        const roots = [
          (-b + Math.sqrt(disc)) / 2,
          (-b - Math.sqrt(disc)) / 2
        ];

        for (const s of roots) {
          if (s < 0) {
            continue;
          }

          const lossCenter = mul(s, direction);
          const rel = sub(lossCenter, vertex);

          let arcAngle = radToDeg(Math.atan2(rel[1], rel[0])) % 360;

          if (arcAngle < 0) {
            arcAngle += 360;
          }

          const start = ((startAngle % 360) + 360) % 360;
          const end = ((endAngle % 360) + 360) % 360;

          let onArc;

          if (start <= end) {
            onArc = start - 1e-9 <= arcAngle && arcAngle <= end + 1e-9;
          } else {
            onArc = arcAngle >= start - 1e-9 || arcAngle <= end + 1e-9;
          }

          if (onArc) {
            candidates.push({
              s,
              wStar: vertex,
              lossCenter,
              color: "green"
            });
          }
        }
      }

      if (candidates.length > 0) {
        candidates.sort((a, b) => b.s - a.s);
        return candidates[0];
      }

      const wStar = mul(r, direction);
      const lossCenter = add(wStar, mul(R, direction));

      return {
        wStar,
        lossCenter,
        color: "gold"
      };
    }

    function drawScene() {
      const lossSize = parseFloat(lossSlider.value);
      const angle = parseFloat(angleSlider.value);

      lossSizeValue.textContent = lossSize.toFixed(1);
      angleValue.textContent = `${angle}°`;

      ctx.clearRect(0, 0, width, height);

      drawArrow(-6.5, 0, 6.5, 0, "black");
      drawArrow(0, -6.5, 0, 6.5, "black");

      drawText("w₁", 6.55, -0.35, 24);
      drawText("w₂", -0.45, 6.55, 24);

      const r = constraintRadius;
      const R = lossSize;

      const theta = degToRad(angle);
      const radialDirection = [Math.cos(theta), Math.sin(theta)];

      let wStar;
      let lossCenter;
      let centerOutlineColor;

      if (constraintShape === "circle") {
        drawCircle(0, 0, r, {
          fill: "#f3d999",
          stroke: "red",
          lineWidth: 2,
          alpha: 0.8
        });

        drawCircle(0, 0, r + R, {
          stroke: "gold",
          lineWidth: 4
        });

        wStar = mul(r, radialDirection);
        lossCenter = add(wStar, mul(R, radialDirection));
        centerOutlineColor = "gold";
      } else {
        const diamondVertices = [
          [0, r],
          [r, 0],
          [0, -r],
          [-r, 0]
        ];

        drawDiamondCenterPath(r, R);

        drawPolygon(diamondVertices, {
          fill: "#f3d999",
          stroke: "red",
          lineWidth: 2,
          alpha: 0.8
        });

        const result = getDiamondTangentGeometry(angle, r, R);

        wStar = result.wStar;
        lossCenter = result.lossCenter;
        centerOutlineColor = result.color;
      }

      for (const scaleValue of [0.35, 0.65, 1.0]) {
        drawCircle(lossCenter[0], lossCenter[1], R * scaleValue, {
          stroke: "blue",
          lineWidth: 2
        });
      }

      drawCircle(lossCenter[0], lossCenter[1], 0.1, {
        fill: "blue",
        stroke: centerOutlineColor,
        lineWidth: 4
      });

      drawCircle(wStar[0], wStar[1], 0.08, {
        fill: "black"
      });

      drawText("w*", wStar[0] + 0.12, wStar[1] + 0.12, 24);
    }

    function scheduleDraw() {
      if (animationFrame !== null) {
        cancelAnimationFrame(animationFrame);
      }

      animationFrame = requestAnimationFrame(() => {
        drawScene();
        animationFrame = null;
      });
    }

    lossSlider.addEventListener("input", scheduleDraw);
    angleSlider.addEventListener("input", scheduleDraw);

    circleButton.addEventListener("click", () => {
      constraintShape = "circle";
      circleButton.classList.add("active");
      diamondButton.classList.remove("active");
      scheduleDraw();
    });

    diamondButton.addEventListener("click", () => {
      constraintShape = "diamond";
      diamondButton.classList.add("active");
      circleButton.classList.remove("active");
      scheduleDraw();
    });

    drawScene();
  }

  function initAllL1L2Widgets() {
    document.querySelectorAll("[data-l1-l2-widget]").forEach(initL1L2Widget);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAllL1L2Widgets);
  } else {
    initAllL1L2Widgets();
  }
})();
