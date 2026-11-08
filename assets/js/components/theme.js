/* ==========================================================================
   components/theme.js · botón de modo claro / oscuro
   --------------------------------------------------------------------------
   Prioridad: elección del botón en esta visita → hora del dispositivo
   (de día oscuro, de noche claro; la regla vive en assets/js/theme-init.js,
   que aplica el tema antes de pintar).
   Si el visitante no tocó el botón, el tema cambia solo al pasar la hora
   límite con la página abierta.
   ========================================================================== */
(function (SP) {
  "use strict";
  const T = window.SPTheme;

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#0a0f1c" : "#f8fafc");
  }

  SP.components.theme = {
    init() {
      apply(T.manual() || T.clockTheme());

      document.querySelectorAll("[data-theme-toggle]").forEach((btn) =>
        btn.addEventListener("click", () => {
          const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
          apply(next);
          try { sessionStorage.setItem(T.KEY, next); } catch (e) { /* modo privado: solo hasta recargar */ }
        })
      );

      // Revisa la hora cada minuto (p. ej. a las 6:00 pm pasa a claro)
      setInterval(() => { if (!T.manual()) apply(T.clockTheme()); }, 60000);
    },
  };
})(window.SP);
