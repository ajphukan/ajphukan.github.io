// Theme switcher and page-peel interaction. Loaded on every page by _includes/theme-toggle.html.
//
// The peel sits at the bottom-right of the page itself. Dragging it lifts the corner: the corner
// follows the pointer in any direction, the crease is the perpendicular bisector between the page
// corner and the pointer, and the other theme shows through the lifted area.
(function () {
  var root = document.documentElement;
  var body = document.body;
  var btn = document.getElementById("theme-toggle"); // optional text link in the footer
  var peel = document.getElementById("peel");
  var REST = 40; // size of the resting fold in px
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
  var reveal = null, shade = null, flapWrap = null, flap = null;
  var drag = null, busy = false, raf = 0, fallback = 0;
  var C = { x: 0, y: 0 }; // the page corner being lifted, in viewport coordinates

  function current() {
    var t = root.getAttribute("data-theme");
    if (t) return t;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  }
  function other() { return current() === "dark" ? "light" : "dark"; }
  function label() { if (btn) btn.textContent = current() === "dark" ? "Light theme" : "Dark theme"; }
  function apply(next) {
    root.setAttribute("data-theme", next);
    // The hidden matrix theme (terminal: theme matrix) is not remembered between visits.
    if (next === "light" || next === "dark") {
      try { localStorage.setItem("theme", next); } catch (e) {}
    } else {
      try { localStorage.removeItem("theme"); } catch (e) {}
    }
    label();
  }
  function vw() { return root.clientWidth; }
  function vh() { return window.innerHeight; }
  function restTip() { return { x: C.x - REST, y: C.y - REST }; }

  // ---- fold geometry -------------------------------------------------------------------------
  // Keep the part of polygon `poly` on the side of the crease that contains the page corner.
  function clipHalf(poly, M, u) {
    var out = [], n = poly.length;
    for (var i = 0; i < n; i++) {
      var A = poly[i], B = poly[(i + 1) % n];
      var da = (A.x - M.x) * u.x + (A.y - M.y) * u.y;
      var db = (B.x - M.x) * u.x + (B.y - M.y) * u.y;
      if (da >= 0) out.push(A);
      if ((da >= 0) !== (db >= 0)) {
        var t = da / (da - db);
        out.push({ x: A.x + (B.x - A.x) * t, y: A.y + (B.y - A.y) * t });
      }
    }
    return out;
  }
  function polyCss(poly) {
    if (poly.length < 3) return "polygon(0 0, 0 0, 0 0)";
    return "polygon(" + poly.map(function (p) { return p.x.toFixed(1) + "px " + p.y.toFixed(1) + "px"; }).join(", ") + ")";
  }

  // Draw the fold with the lifted corner at tip T.
  function render(T) {
    if (!reveal) return;
    var W = vw(), H = vh();
    var dx = C.x - T.x, dy = C.y - T.y;
    var d = Math.sqrt(dx * dx + dy * dy) || 1;
    var u = { x: dx / d, y: dy / d };                       // from the tip toward the page corner
    var M = { x: (C.x + T.x) / 2, y: (C.y + T.y) / 2 };    // a point on the crease
    var rect = [{ x: 0, y: 0 }, { x: W, y: 0 }, { x: W, y: H }, { x: 0, y: H }];
    var shown = clipHalf(rect, M, u);                       // area where the other theme shows
    var back = shown.map(function (p) {                     // the folded-over flap (mirror image)
      var k = 2 * ((p.x - M.x) * u.x + (p.y - M.y) * u.y);
      return { x: p.x - k * u.x, y: p.y - k * u.y };
    });
    var theta = Math.atan2(u.x, -u.y);                      // CSS gradient angle along u
    var deg = (theta * 180 / Math.PI).toFixed(2) + "deg";
    var L = Math.abs(W * Math.sin(theta)) + Math.abs(H * Math.cos(theta));
    var t = (M.x - W / 2) * u.x + (M.y - H / 2) * u.y + L / 2; // crease position along the gradient

    reveal.style.clipPath = polyCss(shown);
    shade.style.background = "linear-gradient(" + deg + ", transparent " + (t - 1).toFixed(1) + "px, rgba(0,0,0,.38) " +
      (t + 1).toFixed(1) + "px, rgba(0,0,0,.12) " + (t + 16).toFixed(1) + "px, transparent " + (t + 44).toFixed(1) + "px)";
    flap.style.clipPath = polyCss(back);
    flap.style.background = "linear-gradient(" + deg + ", var(--chip) " + (t - 320).toFixed(1) + "px, var(--line) " +
      (t - 60).toFixed(1) + "px, var(--muted) " + t.toFixed(1) + "px)";
    flapWrap.style.filter = "drop-shadow(" + (-u.x * 4).toFixed(1) + "px " + (-u.y * 4).toFixed(1) +
      "px 6px rgba(0,0,0,.35)) drop-shadow(" + (-u.x).toFixed(1) + "px " + (-u.y).toFixed(1) + "px 1px rgba(0,0,0,.25))";
    reveal.firstChild.style.transform = "translateY(" + (-window.scrollY) + "px)";
  }

  // ---- overlay: live copy of the page in the other theme -------------------------------------
  function makeOverlay() {
    var r = peel.getBoundingClientRect();
    C = { x: r.right, y: r.bottom };
    reveal = document.createElement("div");
    reveal.className = "reveal";
    reveal.setAttribute("data-theme", other());
    reveal.setAttribute("aria-hidden", "true");
    var inner = document.createElement("div");
    inner.className = "reveal-inner";
    inner.style.width = vw() + "px";
    Array.prototype.slice.call(body.children).forEach(function (el) {
      if (el.tagName === "SCRIPT" || el === peel || el.classList.contains("reveal") || el.classList.contains("flap-wrap")) return;
      var c = el.cloneNode(true);
      c.removeAttribute("id");
      Array.prototype.forEach.call(c.querySelectorAll("[id]"), function (n) { n.removeAttribute("id"); });
      inner.appendChild(c);
    });
    shade = document.createElement("div");
    shade.className = "reveal-shade";
    reveal.appendChild(inner);
    reveal.appendChild(shade);
    flapWrap = document.createElement("div");
    flapWrap.className = "flap-wrap";
    flapWrap.setAttribute("aria-hidden", "true");
    flap = document.createElement("div");
    flap.className = "flap";
    flapWrap.appendChild(flap);
    body.appendChild(reveal);
    body.appendChild(flapWrap);
    peel.classList.add("active");
    render(restTip());
  }
  function removeOverlay() {
    [reveal, flapWrap].forEach(function (el) { if (el && el.parentNode) el.parentNode.removeChild(el); });
    reveal = shade = flapWrap = flap = null;
    peel.classList.remove("active");
  }
  window.addEventListener("scroll", function () {
    if (reveal) reveal.firstChild.style.transform = "translateY(" + (-window.scrollY) + "px)";
  }, { passive: true });

  // ---- animation helpers ---------------------------------------------------------------------
  function animate(from, to, ms, ease, done) {
    cancelAnimationFrame(raf);
    clearTimeout(fallback);
    var start = null, finished = false;
    function complete() {
      if (finished) return;
      finished = true;
      cancelAnimationFrame(raf);
      clearTimeout(fallback);
      done();
    }
    function step(ts) {
      if (finished) return;
      if (start === null) start = ts;
      var k = Math.min(1, (ts - start) / ms);
      var e = ease(k);
      render({ x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e });
      if (k < 1) raf = requestAnimationFrame(step); else complete();
    }
    raf = requestAnimationFrame(step);
    // Frames are paused in hidden tabs; make sure the turn still completes.
    fallback = setTimeout(complete, ms + 150);
  }
  function easeInOut(k) { return k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2; }

  function finish(commit, T) {
    var next = other();
    if (commit && reduce.matches) {
      apply(next); removeOverlay(); busy = false; return;
    }
    if (!commit) {
      animate(T, restTip(), 260, easeInOut, function () { removeOverlay(); busy = false; });
      return;
    }
    // Page turn: keep the corner travelling away along the same line until the whole page is lifted.
    var dx = C.x - T.x, dy = C.y - T.y, d = Math.sqrt(dx * dx + dy * dy) || 1;
    var far = Math.sqrt(vw() * vw() + vh() * vh()) * 2.2;
    var target = { x: C.x - dx / d * far, y: C.y - dy / d * far };
    animate(T, target, 560, easeInOut, function () {
      apply(next);
      removeOverlay();
      busy = false;
    });
  }

  // ---- input ---------------------------------------------------------------------------------
  if (btn) {
    btn.addEventListener("click", function () {
      if (busy) return;
      busy = true;
      makeOverlay();
      finish(true, restTip());
    });
  }
  label();
  window.AJTheme = { current: current, set: apply };

  function clampTip(x, y) {
    return { x: Math.max(0, Math.min(vw(), x)), y: Math.max(0, Math.min(vh(), y)) };
  }
  peel.addEventListener("pointerdown", function (e) {
    if (busy) return;
    busy = true;
    cancelAnimationFrame(raf);
    makeOverlay();
    var tip = restTip();
    drag = { moved: 0, x: e.clientX, y: e.clientY, gx: e.clientX - tip.x, gy: e.clientY - tip.y, tip: tip };
    try { peel.setPointerCapture(e.pointerId); } catch (err) {}
    e.preventDefault();
  });
  peel.addEventListener("pointermove", function (e) {
    if (!drag) return;
    drag.moved = Math.max(drag.moved, Math.abs(e.clientX - drag.x) + Math.abs(e.clientY - drag.y));
    drag.tip = clampTip(e.clientX - drag.gx, e.clientY - drag.gy);
    render(drag.tip);
  });
  function end() {
    if (!drag) return;
    var d = drag; drag = null;
    var dist = Math.sqrt(Math.pow(C.x - d.tip.x, 2) + Math.pow(C.y - d.tip.y, 2));
    var commit = d.moved < 6 || dist > Math.min(vw(), vh()) * 0.42;
    finish(commit, d.moved < 6 ? restTip() : d.tip);
  }
  peel.addEventListener("pointerup", end);
  peel.addEventListener("pointercancel", end);
})();
