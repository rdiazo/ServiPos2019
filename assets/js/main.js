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
  const c = SP.components; // cada archivo de components/ se registra aquí

  // 1-2. Generan HTML. layout va primero porque crea el header y el footer
  //      donde otros módulos buscan elementos (estado, contador…).
  const renderers = [c.layout, c.trust, c.services, c.team, c.diagnostic, c.location, c.contact];
  // 3. Actúan sobre el HTML ya generado. hydrate va primero (pone íconos y
  //    enlaces) y reveal al final (observa todo lo que quedó con .reveal).
  const behaviors = [c.hydrate, c.theme, c.nav, c.modal, c.status, c.visits, c.motion, c.reveal];

  /** Inicia cada módulo en orden. Un error en uno se registra en la consola
      sin detener a los demás (el resto del sitio sigue funcionando). */
  function boot() {
    [...renderers, ...behaviors].forEach((m) => {
      if (!m) return; // módulo no incluido en esta página
      try { m.init(); } catch (err) { console.error("[ServiPos] Error iniciando módulo:", err); }
    });
  }

  // Los <script defer> se ejecutan con el HTML ya leído, pero por si este
  // archivo se carga de otra forma, espera al DOM cuando haga falta.
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window.SP);
