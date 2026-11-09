/* ==========================================================================
   components/nav.js · comportamiento de la navegación
   --------------------------------------------------------------------------
   · Sombra del header al hacer scroll
   · Abrir/cerrar menú móvil (Esc, clic en enlace, cambio a escritorio)
   · Resalta el enlace activo: la sección visible (inicio) o la página actual
   ========================================================================== */
(function (SP) {
  "use strict";
  const { $, $$ } = SP.utils;

  /** Añade sombra y borde al header en cuanto la página baja 8 px. */
  function headerShadow() {
    const header = $("[data-header]");
    const update = () => header.classList.toggle("is-scrolled", window.scrollY > 8);
    update();
    window.addEventListener("scroll", update, { passive: true }); // passive: no bloquea el scroll
  }

  /** Menú hamburguesa del móvil: alterna ícono ☰/✕, se cierra al elegir un
      enlace, con Esc o al agrandar la ventana a tamaño escritorio. */
  function mobileMenu() {
    const btn = $("[data-menu-toggle]");
    const menu = $("[data-mobile-menu]");
    const set = (open) => {
      menu.classList.toggle("is-open", open);
      btn.setAttribute("aria-expanded", String(open));
      btn.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
      btn.innerHTML = SP.icon(open ? "x" : "menu");
    };
    btn.addEventListener("click", () => set(!menu.classList.contains("is-open")));
    menu.addEventListener("click", (e) => { if (e.target.closest("a")) set(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
    window.matchMedia("(min-width: 960px)").addEventListener("change", () => set(false));
  }

  /** Resalta en el menú dónde está el visitante:
      · Páginas internas → el enlace a la página actual.
      · Inicio → el enlace de la sección que ocupa el centro de la pantalla. */
  function activeLinks() {
    const links = $$(".nav__link");
    const page = location.pathname.split("/").pop() || "index.html";

    // Páginas internas: marca el enlace cuyo archivo coincide
    links.forEach((a) => {
      const file = a.getAttribute("href").split("#")[0];
      if (file && file === page) a.classList.add("is-active");
    });
    if (!SP.utils.isHome()) return;

    // Inicio: marca la sección visible
    const map = new Map();
    links.forEach((a) => {
      const id = a.getAttribute("href");
      if (id.startsWith("#") && $(id)) map.set($(id), a);
    });
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (!en.isIntersecting) return;
        links.forEach((l) => l.classList.remove("is-active"));
        map.get(en.target).classList.add("is-active");
      }),
      { rootMargin: "-45% 0px -50% 0px" } // franja estrecha en el centro de la pantalla
    );
    map.forEach((_, section) => io.observe(section));
  }

  SP.components.nav = {
    init() {
      headerShadow();
      mobileMenu();
      activeLinks();
    },
  };
})(window.SP);
