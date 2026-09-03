/* SEOAtlantaGA — analytics + tracking loader.
 *
 * Reads configuration from /api/site-config (set in the admin dashboard's
 * Tracking tab): a GA4 Measurement ID, a Google Tag Manager container ID, and
 * optional custom <head> / end-of-<body> code. Nothing is loaded until those
 * are set, and window.track() is always a safe no-op so callers never break.
 *
 * NOTE: the site's Content-Security-Policy only allows scripts from approved
 * domains (self, Google Tag Manager / Analytics, jsDelivr, Cloudflare Turnstile).
 * Custom snippets that load from other domains are blocked by the browser until
 * that domain is added to the CSP in vercel.json. */
(function (w, d) {
  "use strict";

  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }
  w.gtag = w.gtag || gtag;

  var GA4_ID = "";

  function loadScript(src) {
    var s = d.createElement("script");
    s.async = true; s.src = src;
    d.head.appendChild(s);
  }

  /* Execute owner-authored HTML by rebuilding <script> nodes (innerHTML alone
     never runs scripts). Non-script nodes are appended as-is. */
  function injectHTML(target, html) {
    if (!html) return;
    var tpl = d.createElement("template");
    tpl.innerHTML = html;
    Array.prototype.forEach.call(tpl.content.childNodes, function (node) {
      if (node.tagName === "SCRIPT") {
        var s = d.createElement("script");
        for (var i = 0; i < node.attributes.length; i++) {
          s.setAttribute(node.attributes[i].name, node.attributes[i].value);
        }
        s.text = node.textContent;
        target.appendChild(s);
      } else {
        target.appendChild(node.cloneNode(true));
      }
    });
  }

  function apply(cfg) {
    cfg = cfg || {};
    GA4_ID = cfg.ga4_id || "";

    if (GA4_ID) {
      loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_ID));
      gtag("js", new Date());
      gtag("config", GA4_ID, { anonymize_ip: true });
    }
    if (cfg.gtm_id) {
      w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
      loadScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(cfg.gtm_id));
    }
    if (cfg.head_html) injectHTML(d.head, cfg.head_html);
    if (cfg.body_html) injectHTML(d.body, cfg.body_html);
  }

  /* Single funnel for every custom event. Always safe to call — events queue
     into dataLayer and reach GA4 once it has loaded. */
  w.track = function (name, params) {
    var payload = params || {};
    w.dataLayer.push(Object.assign({ event: name }, payload));
    if (GA4_ID && typeof w.gtag === "function") w.gtag("event", name, payload);
    if (!GA4_ID && w.location && /[?&]debugTracking=1/.test(w.location.search)) {
      /* eslint-disable-next-line no-console */
      console.log("[track]", name, payload);
    }
  };

  /* Outbound + contact-intent clicks, captured once for the whole document. */
  d.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a) return;
    var href = a.getAttribute("href") || "";
    if (href.indexOf("mailto:") === 0) w.track("contact_email_click", { link_url: href });
    else if (href.indexOf("tel:") === 0) w.track("contact_phone_click", { link_url: href });
  }, true);

  /* Scroll depth — one event per threshold per page. */
  var seen = {};
  w.addEventListener("scroll", function () {
    var doc = d.documentElement;
    var max = doc.scrollHeight - w.innerHeight;
    if (max <= 0) return;
    var pct = Math.round((doc.scrollTop || d.body.scrollTop) / max * 100);
    [25, 50, 75, 90].forEach(function (t) {
      if (pct >= t && !seen[t]) { seen[t] = 1; w.track("scroll_depth", { percent: t }); }
    });
  }, { passive: true });

  /* Pull the configuration, then switch tracking on. Best-effort: if the
     request fails, the site simply runs without analytics. */
  try {
    fetch("/api/site-config", { headers: { Accept: "application/json" } })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (cfg) { if (cfg) apply(cfg); })
      .catch(function () {});
  } catch (e) { /* no fetch — skip */ }
})(window, document);
