/* FinPulse — concept build interactions (vanilla JS, no dependencies) */
(function () {
  "use strict";

  /* ---------- Seamless ticker: duplicate track content ---------- */
  var track = document.getElementById("tickerTrack");
  if (track) {
    var clone = track.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    while (clone.firstChild) track.appendChild(clone.firstChild);
  }

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById("siteHeader");
  var onScroll = function () {
    if (window.scrollY > 8) header.classList.add("is-scrolled");
    else header.classList.remove("is-scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile nav ---------- */
  var toggle = document.getElementById("navToggle");
  var mobileNav = document.getElementById("mobileNav");
  if (toggle && mobileNav) {
    toggle.addEventListener("click", function () {
      var open = mobileNav.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    mobileNav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") {
        mobileNav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ---------- Dashboard table filter ---------- */
  var seg = document.querySelector(".seg");
  var rows = Array.prototype.slice.call(document.querySelectorAll("#txTable tbody tr"));
  if (seg && rows.length) {
    seg.addEventListener("click", function (e) {
      var btn = e.target.closest(".seg__btn");
      if (!btn) return;
      seg.querySelectorAll(".seg__btn").forEach(function (b) { b.classList.remove("is-active"); });
      btn.classList.add("is-active");
      var f = btn.getAttribute("data-filter");
      rows.forEach(function (row) {
        var show = f === "all" || row.getAttribute("data-status") === f;
        row.classList.toggle("is-hidden", !show);
      });
    });
  }

  /* ---------- Reveal fallback (browsers without scroll-driven CSS) ---------- */
  var supportsScrollTimeline = CSS.supports("animation-timeline", "view()");
  if (!supportsScrollTimeline && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            en.target.classList.add("is-visible");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  }

  /* ---------- Gentle sample-latency jitter in the ticker (sandbox feel) ---------- */
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduceMotion && track) {
    setInterval(function () {
      var cells = track.querySelectorAll(".tk-lat");
      var i = Math.floor(Math.random() * cells.length);
      var v = 55 + Math.floor(Math.random() * 45);
      if (cells[i] && cells[i].textContent !== "—") {
        cells[i].textContent = v + "ms";
        // mirrored half of the duplicated track
        var mirror = cells[i + Math.floor(cells.length / 2)] || cells[i - Math.floor(cells.length / 2)];
        if (mirror) mirror.textContent = v + "ms";
      }
    }, 2600);
  }
})();
