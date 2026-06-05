document.addEventListener("DOMContentLoaded", function () {
  try {
    const key = "intro-counter";
    const el = document.getElementById("count");
    const inc = document.getElementById("inc");
    const dec = document.getElementById("dec");
    const reset = document.getElementById("reset");
    if (!el || !inc || !dec || !reset) return;
    let v = Number(localStorage.getItem(key) || 0);
    function render() {
      el.textContent = v;
      localStorage.setItem(key, String(v));
    }
    inc.addEventListener("click", () => {
      v++;
      render();
    });
    dec.addEventListener("click", () => {
      v--;
      render();
    });
    reset.addEventListener("click", () => {
      v = 0;
      render();
    });
    render();
  } catch (e) {
    console.error("counter.js error", e);
  }
});
