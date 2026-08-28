/* SEOAtlantaGA — shared behaviour for inner pages.
   Mirrors the inline script on the homepage, minus the homepage-only canvases. */
(function () {
  "use strict";
  var d = document;
  var track = function () { if (typeof window.track === "function") window.track.apply(null, arguments); };

  /* mobile menu */
  var mb = d.querySelector(".menu-btn"), mn = d.querySelector(".mobile-nav");
  if (mb && mn) mb.addEventListener("click", function () { mn.classList.toggle("open"); });

  /* scroll reveal */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: .13 });
    d.querySelectorAll(".reveal:not(.in)").forEach(function (el) { io.observe(el); });

    /* animated counters */
    var cio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (!e.isIntersecting) return;
        var el = e.target, t = parseFloat(el.dataset.count),
            pre = el.dataset.prefix || "", suf = el.dataset.suffix || "",
            dec = t % 1 !== 0 ? 1 : 0, s = 0, step = t / 40;
        var iv = setInterval(function () {
          s += step; if (s >= t) { s = t; clearInterval(iv); }
          el.textContent = pre + s.toFixed(dec) + suf;
        }, 22);
        cio.unobserve(el);
      });
    }, { threshold: .5 });
    d.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });
  } else {
    d.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
  }

  /* tabs */
  d.querySelectorAll(".tab").forEach(function (t) {
    t.addEventListener("click", function () {
      var i = +t.dataset.tab, root = t.closest("section") || d;
      root.querySelectorAll(".tab").forEach(function (x) { x.classList.remove("active"); });
      root.querySelectorAll(".tab-panel").forEach(function (x) { x.classList.remove("active"); });
      t.classList.add("active");
      root.querySelectorAll(".tab-panel")[i].classList.add("active");
    });
  });

  /* faq accordion — also drives keyboard access */
  d.querySelectorAll(".faq-q").forEach(function (q) {
    q.setAttribute("tabindex", "0");
    q.setAttribute("role", "button");
    function toggle() {
      var item = q.closest(".faq-item"), open = item.classList.contains("open");
      item.parentElement.querySelectorAll(".faq-item").forEach(function (x) {
        x.classList.remove("open");
        var h = x.querySelector(".faq-q"); if (h) h.setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("open");
        q.setAttribute("aria-expanded", "true");
        track("faq_open", { question: (q.textContent || "").trim().slice(0, 90) });
      }
    }
    q.setAttribute("aria-expanded", "false");
    q.addEventListener("click", toggle);
    q.addEventListener("keydown", function (e) {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); }
    });
  });

  /* blog category chips */
  var chips = d.querySelectorAll(".chip[data-cat]");
  if (chips.length) {
    var empty = d.querySelector(".empty-note");
    chips.forEach(function (c) {
      c.addEventListener("click", function () {
        var cat = c.dataset.cat;
        chips.forEach(function (x) { x.classList.remove("active"); });
        c.classList.add("active");
        var shown = 0;
        d.querySelectorAll(".post-card[data-cat]").forEach(function (p) {
          var hit = cat === "all" || p.dataset.cat === cat;
          p.classList.toggle("hide", !hit);
          if (hit) shown++;
        });
        if (empty) empty.classList.toggle("show", shown === 0);
        track("blog_filter", { category: cat });
      });
    });
  }

  /* ── lead forms ───────────────────────────────────────────────────────── */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function setError(field, msg) {
    var slot = field.parentElement.querySelector(".err");
    if (slot) slot.textContent = msg || "";
    if (msg) field.setAttribute("aria-invalid", "true");
    else field.removeAttribute("aria-invalid");
  }

  function validate(form) {
    var ok = true, first = null;
    form.querySelectorAll("[data-required]").forEach(function (f) {
      var v = (f.value || "").trim(), msg = "";
      if (!v) msg = "This field is required.";
      else if (f.type === "email" && !EMAIL_RE.test(v)) msg = "Enter a valid email address.";
      else if (f.dataset.kind === "domain" && v.replace(/^https?:\/\//, "").indexOf(".") < 0) msg = "Enter a domain, e.g. yourbusiness.com";
      setError(f, msg);
      if (msg) { ok = false; if (!first) first = f; }
    });
    if (first) first.focus();
    return ok;
  }

  d.querySelectorAll("form[data-lead-form]").forEach(function (form) {
    var status = form.querySelector(".form-status");
    var btn = form.querySelector("button[type=submit]");
    var btnText = btn ? btn.textContent : "";

    form.querySelectorAll("[data-required]").forEach(function (f) {
      f.addEventListener("blur", function () { if (f.value.trim()) setError(f, ""); });
      f.addEventListener("input", function () { if (f.getAttribute("aria-invalid")) setError(f, ""); });
    });

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (status) status.className = "form-status";
      if (!validate(form)) return;

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = typeof v === "string" ? v.trim() : v; });
      data.page = location.pathname;
      data.referrer = d.referrer || "";
      ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid"].forEach(function (k) {
        var v = new URLSearchParams(location.search).get(k);
        if (v) data[k] = v;
      });

      if (btn) { btn.disabled = true; btn.textContent = "Sending…"; }
      track("lead_submit_attempt", { form_id: form.id || "lead", form_name: form.dataset.leadForm });

      fetch(form.getAttribute("action") || "/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      }).then(function (r) {
        return r.json().catch(function () { return { ok: r.ok }; });
      }).then(function (body) {
        if (!body || body.ok !== true) throw new Error((body && body.error) || "Request failed");
        track("lead_submit_success", { form_id: form.id || "lead", form_name: form.dataset.leadForm });
        var to = form.dataset.redirect;
        if (to) { location.href = to; return; }
        form.reset();
        if (status) { status.className = "form-status ok show"; status.textContent = "Thanks — we've got it. You'll hear back within one business day."; }
      }).catch(function (err) {
        track("lead_submit_error", { form_id: form.id || "lead", message: String(err && err.message) });
        if (status) {
          status.className = "form-status bad show";
          status.innerHTML = 'Something went wrong sending that. Email us directly at <a href="mailto:hello@seoatlantaga.com">hello@seoatlantaga.com</a> and we\'ll pick it up.';
        }
      }).then(function () {
        if (btn) { btn.disabled = false; btn.textContent = btnText; }
      });
    });
  });

  /* ── article: reading progress + contents scroll-spy ─────────────────── */
  var bar = d.getElementById("readbar");
  var body = d.getElementById("articleBody");
  if (bar && body) {
    var ticking = false;
    var update = function () {
      var r = body.getBoundingClientRect();
      var total = r.height - window.innerHeight;
      var done = total > 0 ? Math.min(1, Math.max(0, -r.top / total)) : (r.top < 0 ? 1 : 0);
      bar.style.transform = "scaleX(" + done + ")";
      ticking = false;
    };
    var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    update();
  }

  var tocLinks = [].slice.call(d.querySelectorAll("#tocNav a[href^='#']"));
  if (tocLinks.length) {
    var sections = tocLinks
      .map(function (a) { return d.getElementById(a.getAttribute("href").slice(1)); })
      .filter(Boolean);

    var setActive = function (id) {
      tocLinks.forEach(function (a) {
        a.classList.toggle("active", a.getAttribute("href") === "#" + id);
      });
    };

    /* Pick the last heading whose top has passed the reading line, rather than
       relying on intersection alone — that keeps one entry lit while a long
       section fills the viewport and nothing is intersecting. */
    var spyTicking = false;
    var spy = function () {
      var line = 140, current = sections[0];
      for (var i = 0; i < sections.length; i++) {
        if (sections[i].getBoundingClientRect().top <= line) current = sections[i];
      }
      if (window.innerHeight + window.scrollY >= d.documentElement.scrollHeight - 4) {
        current = sections[sections.length - 1];
      }
      if (current) setActive(current.id);
      spyTicking = false;
    };
    window.addEventListener("scroll", function () {
      if (!spyTicking) { spyTicking = true; requestAnimationFrame(spy); }
    }, { passive: true });
    spy();

    tocLinks.forEach(function (a) {
      a.addEventListener("click", function () {
        track("toc_click", { section: a.getAttribute("href").slice(1) });
      });
    });
  }

  /* CTA click tracking */
  d.querySelectorAll("[data-cta]").forEach(function (el) {
    el.addEventListener("click", function () { track("cta_click", { cta: el.dataset.cta }); });
  });
})();
