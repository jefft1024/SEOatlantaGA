/* Service-page interactions. Loaded only on /services/*.
   Reveal, scroll-progress, process connector + heat grid, card cursor spotlight,
   and single-open FAQ. The shared lead form is still handled by site.js. */
(function () {
  "use strict";
  var d = document;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* scroll progress */
  var prog = d.getElementById("svcProg");
  if (prog) {
    var tick = false;
    var onScroll = function () {
      if (tick) return; tick = true;
      requestAnimationFrame(function () {
        var h = d.documentElement;
        var pct = h.scrollTop / ((h.scrollHeight - h.clientHeight) || 1);
        prog.style.transform = "scaleX(" + Math.min(1, Math.max(0, pct)) + ")";
        tick = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  if ("IntersectionObserver" in window && !reduce) {
    /* reveal */
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .12, rootMargin: "0px 0px -40px 0px" });
    d.querySelectorAll(".svcx .rv").forEach(function (el) { io.observe(el); });

    /* process connector + heat grid fill once in view */
    var big = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); big.unobserve(e.target); } });
    }, { threshold: .28 });
    ["svcSteps", "svcHeat"].forEach(function (id) { var el = d.getElementById(id); if (el) big.observe(el); });
  } else {
    d.querySelectorAll(".svcx .rv").forEach(function (el) { el.classList.add("in"); });
    ["svcSteps", "svcHeat"].forEach(function (id) { var el = d.getElementById(id); if (el) el.classList.add("in"); });
  }

  /* cursor spotlight on scope cards */
  d.querySelectorAll(".svcx .card").forEach(function (c) {
    c.addEventListener("pointermove", function (ev) {
      var r = c.getBoundingClientRect();
      c.style.setProperty("--mx", (ev.clientX - r.left) + "px");
      c.style.setProperty("--my", (ev.clientY - r.top) + "px");
    });
  });

  /* one FAQ open at a time */
  var items = d.querySelectorAll(".svcx details.faq-item");
  items.forEach(function (dt) {
    dt.addEventListener("toggle", function () {
      if (dt.open) items.forEach(function (o) { if (o !== dt) o.open = false; });
    });
  });
})();
