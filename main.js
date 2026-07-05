// Marine Group — interactions

(function () {
  "use strict";

  const nav = document.getElementById("nav");
  const burger = document.getElementById("burger");
  const mobileMenu = document.getElementById("mobileMenu");

  /* ---- Year in footer ---- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---- Nav: solid on scroll ---- */
  const onScroll = () => {
    if (window.scrollY > 40) nav.classList.add("is-scrolled");
    else nav.classList.remove("is-scrolled");
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---- Mobile menu ---- */
  const closeMenu = () => {
    nav.classList.remove("is-open");
    burger.setAttribute("aria-expanded", "false");
    mobileMenu.hidden = true;
  };
  const toggleMenu = () => {
    const open = nav.classList.toggle("is-open");
    burger.setAttribute("aria-expanded", String(open));
    mobileMenu.hidden = !open;
  };
  if (burger) burger.addEventListener("click", toggleMenu);
  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

  /* ---- Scroll reveal ---- */
  const revealEls = document.querySelectorAll("[data-reveal]");
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const delay = Number(el.dataset.revealDelay || 0) * 110;
          el.style.transitionDelay = delay + "ms";
          el.classList.add("is-visible");
          obs.unobserve(el);
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -8% 0px" }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  /* ---- Subtle hero parallax (respects reduced motion) ---- */
  const heroImg = document.querySelector(".hero__media img");
  if (heroImg && !prefersReduced) {
    let ticking = false;
    window.addEventListener(
      "scroll",
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          const y = Math.min(window.scrollY, window.innerHeight);
          heroImg.style.transform = "translateY(" + y * 0.04 + "px) scale(1.06)";
          ticking = false;
        });
      },
      { passive: true }
    );
  }

  /* ---- Filter tabs (scoped per section: fleet & sales are independent) ---- */
  document.querySelectorAll(".filter").forEach((btn) => {
    btn.addEventListener("click", () => {
      const scope = btn.closest("section") || document;
      const cat = btn.dataset.filter;
      scope.querySelectorAll(".filter").forEach((f) => {
        const active = f === btn;
        f.classList.toggle("is-active", active);
        f.setAttribute("aria-selected", String(active));
      });
      scope.querySelectorAll(".boat").forEach((b) => {
        b.classList.toggle("is-hidden", cat !== "all" && b.dataset.cat !== cat);
      });
    });
  });

  /* ---- Contact form: open the visitor's mail client (no backend) ---- */
  const form = document.getElementById("contactForm");
  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const get = (n) => (form.querySelector('[name="' + n + '"]') || {}).value || "";
      const name = get("name").trim();
      const email = get("email").trim();
      if (!name || !email) {
        form.reportValidity();
        return;
      }
      const subject = "Demande — " + get("subject");
      const body =
        "Nom : " + name + "\n" +
        "Email : " + email + "\n" +
        "Téléphone : " + get("phone") + "\n" +
        "Sujet : " + get("subject") + "\n\n" +
        get("message");
      window.location.href =
        "mailto:marinegroup2a@gmail.com?subject=" +
        encodeURIComponent(subject) +
        "&body=" +
        encodeURIComponent(body);
    });
  }
})();
