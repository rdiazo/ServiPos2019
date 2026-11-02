/* ==========================================================================
   components/theme.js · modo claro / oscuro
   --------------------------------------------------------------------------
   Prioridad: elección guardada del usuario → preferencia del sistema.
   El <head> de cada página aplica el tema antes de pintar (evita parpadeo);
   este módulo solo gestiona el botón y los cambios del sistema.
   ========================================================================== */
(function (SP) {
  "use strict";
  const KEY = "sp-theme";
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  function stored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0f1c" : "#f8fafc");
  }

  SP.components.theme = {
    init() {
      apply(stored() || (media.matches ? "dark" : "light"));

      document.querySelectorAll("[data-theme-toggle]").forEach((btn) =>
        btn.addEventListener("click", () => {
          const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
          apply(next);
          try { localStorage.setItem(KEY, next); } catch (e) { /* modo privado: solo para esta visita */ }
        })
      );

      // Si el usuario nunca eligió, seguimos al sistema en vivo
      media.addEventListener("change", (e) => { if (!stored()) apply(e.matches ? "dark" : "light"); });
    },
  };
})(window.SP);
