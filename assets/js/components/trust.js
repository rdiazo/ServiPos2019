/* ==========================================================================
   components/trust.js · barra de métricas (con conteo animado) y aliados
   --------------------------------------------------------------------------
   Montajes:  <div data-mount="stats"></div>   <div data-mount="partners"></div>
   Datos:     data/partners.js (SP.data.stats y SP.data.partners)
   ========================================================================== */
(function (SP) {
  "use strict";
  const { esc } = SP.utils;
  const fmt = (n) => n.toLocaleString("en-US"); // 1,000 (formato del brief)

  /** Pinta las métricas con su valor final (correcto aunque no haya
      animación) y programa el conteo cuando cada cifra entra en pantalla. */
  function renderStats(mount) {
    mount.innerHTML = SP.data.stats
      .map(
        (s) =>
          '<div class="stat reveal">' +
          '<div class="stat__value" data-count="' + s.value + '" data-prefix="' + esc(s.prefix) + '" data-suffix="' + esc(s.suffix) + '">' +
          esc(s.prefix) + fmt(s.value) + esc(s.suffix) + "</div>" +
          '<div class="stat__label">' + esc(s.label) + "</div></div>"
      )
      .join("");

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        io.unobserve(en.target);
        animate(en.target);
      });
    }, { threshold: 0.6 }); // cuenta cuando se ve el 60 % de la cifra
    mount.querySelectorAll("[data-count]").forEach((el) => io.observe(el));
  }

  /** Cuenta de 0 al valor en 1,4 s. Curva "ease-out" cúbica: arranca
      rápido y frena al final. requestAnimationFrame = un paso por cuadro. */
  function animate(el) {
    const target = +el.dataset.count, pre = el.dataset.prefix, suf = el.dataset.suffix;
    const start = performance.now(), dur = 1400;
    const step = (t) => {
      const p = Math.min((t - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + fmt(Math.round(target * eased)) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /** Logos de aliados enlazados a su sitio. motion.js los duplica luego
      para el carrusel continuo. */
  function renderPartners(mount) {
    mount.innerHTML = SP.data.partners
      .map(
        (p) =>
          '<a class="partner" href="' + p.url + '" target="_blank" rel="noopener" title="' + esc(p.name) + '">' +
          '<img src="' + p.logo + '" alt="' + esc(p.name) + '" loading="lazy" width="120" height="44"></a>'
      )
      .join("");
  }

  SP.components.trust = {
    init() {
      const s = document.querySelector('[data-mount="stats"]');
      const p = document.querySelector('[data-mount="partners"]');
      if (s) renderStats(s);
      if (p) renderPartners(p);
    },
  };
})(window.SP);
