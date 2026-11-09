/* ==========================================================================
   components/motion.js · comportamientos animados (estilos en animations.css)
   --------------------------------------------------------------------------
   · Barra de progreso de lectura bajo el header
   · Inclinación 3D del equipo del hero según el puntero (solo mouse)
   · Carrusel continuo de aliados (duplica los logos para el bucle)
   La entrada del hero (html.is-ready) la activa assets/js/theme-init.js en el <head>,
   así no depende de que este archivo cargue.
   Todo se desactiva con "reducir movimiento" del sistema.
   ========================================================================== */
(function (SP) {
  "use strict";
  // true si el visitante pidió "reducir movimiento" en su sistema
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Barra de progreso ---------- */
  function scrollProgress() {
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    // Como mucho una actualización por cuadro, aunque el scroll dispare
    // decenas de eventos por segundo (ticking evita trabajo repetido).
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.setProperty("--progress", max > 0 ? (window.scrollY / max).toFixed(4) : 0);
      ticking = false;
    };
    window.addEventListener("scroll", () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Inclinación del hero ---------- */
  function heroTilt() {
    const visual = document.querySelector(".hero__visual");
    const tilt = visual && visual.querySelector(".hero__tilt");
    if (!tilt || !window.matchMedia("(pointer: fine)").matches) return;

    const MAX = 8; // grados
    visual.addEventListener("pointermove", (e) => {
      const r = visual.getBoundingClientRect();
      // Posición del puntero de -0.5 (izquierda/arriba) a 0.5 (derecha/abajo)
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      tilt.style.setProperty("--rx", (x * MAX).toFixed(2) + "deg");
      tilt.style.setProperty("--ry", (-y * MAX).toFixed(2) + "deg");
    });
    visual.addEventListener("pointerleave", () => {
      tilt.style.setProperty("--rx", "0deg");
      tilt.style.setProperty("--ry", "0deg");
    });
  }

  /* ---------- Carrusel de aliados ---------- */
  function partnersMarquee() {
    document.querySelectorAll('.partners__track[data-mount="partners"]').forEach((track) => {
      if (!track.children.length) return;
      // Copia de los logos para que el bucle no tenga saltos (oculta a lectores de pantalla)
      Array.from(track.children).forEach((logo) => {
        const clone = logo.cloneNode(true);
        clone.setAttribute("aria-hidden", "true");
        clone.tabIndex = -1;
        track.appendChild(clone);
      });
      // Envoltura con overflow oculto y bordes difuminados (animations.css)
      const viewport = document.createElement("div");
      viewport.className = "partners__viewport";
      track.parentNode.insertBefore(viewport, track);
      viewport.appendChild(track);
      track.classList.add("is-marquee");
    });
  }

  SP.components.motion = {
    init() {
      partnersMarquee(); // también con movimiento reducido: el CSS lo muestra estático
      if (reduced) return;
      scrollProgress();
      heroTilt();
    },
  };
})(window.SP);
