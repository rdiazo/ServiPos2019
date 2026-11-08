/* ==========================================================================
   main.js · punto de entrada (compartido por todas las páginas)
   --------------------------------------------------------------------------
   Orden de arranque:
     1. Layout (header, footer, contacto flotante)
     2. Componentes que generan HTML desde data/ (cada uno ignora la página
        si no encuentra su punto de montaje data-mount="…")
     3. Comportamientos que actúan sobre el HTML ya generado
   Para añadir una sección: crea components/mi-seccion.js con un init(),
   inclúyelo con <script defer> en la página y agrégalo a la lista.
   ========================================================================== */
(function (SP) {
  "use strict";
  const c = SP.components;

  const renderers = [c.layout, c.trust, c.services, c.team, c.diagnostic, c.location, c.contact];
  const behaviors = [c.hydrate, c.theme, c.nav, c.modal, c.status, c.visits, c.motion, c.reveal];

  function boot() {
    [...renderers, ...behaviors].forEach((m) => {
      if (!m) return; // módulo no incluido en esta página
      try { m.init(); } catch (err) { console.error("[ServiPos] Error iniciando módulo:", err); }
    });
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window.SP);
