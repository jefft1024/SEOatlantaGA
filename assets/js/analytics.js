/* SEOAtlantaGA — analytics loader.
   Set GA4_ID to your real Measurement ID (looks like "G-XXXXXXXXXX") to switch
   tracking on. While it is empty, nothing is loaded and no cookies are set —
   window.track() still exists and is a safe no-op, so callers never break. */
(function (w, d) {
  "use strict";

  var GA4_ID = "";                 // ← put your GA4 Measurement ID here
  var GTM_ID = "";                 // ← optional: Google Tag Manager container, "GTM-XXXXXXX"

  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }
  w.gtag = w.gtag || gtag;

  function loadScript(src) {
    var s = d.createElement("script");
    s.async = true; s.src = src;
    d.head.appendChild(s);
  }

  if (GA4_ID) {
    loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(GA4_ID));
    gtag("js", new Date());
    gtag("config", GA4_ID, { anonymize_ip: true });
  }

  if (GTM_ID) {
    w.dataLayer.push({ "gtm.start": Date.now(), event: "gtm.js" });
    loadScript("https://www.googletagmanager.com/gtm.js?id=" + encodeURIComponent(GTM_ID));
  }

  /* Single funnel for every custom event on the site. Always safe to call. */
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
})(window, document);
