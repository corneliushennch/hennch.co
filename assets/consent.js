// Google Analytics, loaded only after opt-in consent (§ 25 TDDDG, Art. 6 (1) a GDPR).
// The choice is kept in localStorage; nothing is sent to Google before "Accept".
(function () {
  var GA_ID = "G-DT52RVD1ST";
  var KEY = "ga-consent"; // "granted" | "denied"

  function getChoice() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }

  function setChoice(value) {
    try { localStorage.setItem(KEY, value); } catch (e) {}
  }

  function loadAnalytics() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { dataLayer.push(arguments); };
    gtag("js", new Date());
    gtag("config", GA_ID);
    var s = document.createElement("script");
    s.async = true;
    s.src = "https://www.googletagmanager.com/gtag/js?id=" + GA_ID;
    document.head.appendChild(s);
  }

  function deleteAnalyticsCookies() {
    var host = location.hostname.replace(/^www\./, "");
    document.cookie.split(";").forEach(function (c) {
      var name = c.split("=")[0].trim();
      if (name.indexOf("_ga") !== 0) return;
      [null, host, "." + host].forEach(function (domain) {
        document.cookie = name + "=; Max-Age=0; path=/" + (domain ? "; domain=" + domain : "");
      });
    });
  }

  function hideBanner() {
    var b = document.getElementById("consent-banner");
    if (b) b.remove();
  }

  function showBanner() {
    if (document.getElementById("consent-banner")) return;
    var b = document.createElement("div");
    b.id = "consent-banner";
    b.setAttribute("role", "dialog");
    b.setAttribute("aria-label", "Analytics consent");
    b.innerHTML =
      '<p>May this site use Google Analytics to count visits? It sets cookies and sends usage data to Google. ' +
      'You can change your mind at any time. <a href="/datenschutz/">Datenschutz / Privacy</a></p>' +
      '<div class="consent-buttons">' +
      '<button type="button" class="btn btn-secondary" data-consent="denied">Decline</button>' +
      '<button type="button" class="btn btn-secondary" data-consent="granted">Accept</button>' +
      "</div>";
    b.addEventListener("click", function (e) {
      var value = e.target.getAttribute("data-consent");
      if (!value) return;
      setChoice(value);
      hideBanner();
      if (value === "granted") loadAnalytics();
    });
    document.body.appendChild(b);
  }

  if (getChoice() === "granted") loadAnalytics();

  document.addEventListener("DOMContentLoaded", function () {
    if (!getChoice()) showBanner();
    // Any link with data-consent-reset reopens the banner and withdraws consent.
    document.addEventListener("click", function (e) {
      var link = e.target.closest("[data-consent-reset]");
      if (!link) return;
      e.preventDefault();
      var wasGranted = getChoice() === "granted";
      try { localStorage.removeItem(KEY); } catch (err) {}
      deleteAnalyticsCookies();
      if (wasGranted) {
        // gtag.js is already running on this page; reload so it stops.
        location.reload();
      } else {
        showBanner();
      }
    });
  });
})();
