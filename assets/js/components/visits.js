/* ==========================================================================
   components/visits.js · contador de visitas del footer
   --------------------------------------------------------------------------
   Habla con config.visits.endpoint (api/visitas.php):
     · Primera página de la sesión → POST (suma 1 visita)
     · Resto de páginas de la sesión → GET (solo lee)
   Si el endpoint no responde (p. ej. abriendo index.html con doble clic),
   el contador se queda oculto y el resto del sitio funciona igual.
   Marcado: <span class="visits" data-visits hidden>…<span data-visits-text>
   ========================================================================== */
(function (SP) {
  "use strict";
  const KEY = "sp-visit-counted";
  const fmt = (n) => Number(n).toLocaleString("en-US");

  /** ¿Esta pestaña ya sumó su visita? (sessionStorage dura mientras la
      pestaña esté abierta; los try/catch cubren el modo privado). */
  function alreadyCounted() {
    try { return sessionStorage.getItem(KEY) === "1"; } catch (e) { return false; }
  }
  function markCounted() {
    try { sessionStorage.setItem(KEY, "1"); } catch (e) { /* modo privado */ }
  }

  SP.components.visits = {
    async init() {
      const el = document.querySelector("[data-visits]");
      const endpoint = SP.config.visits && SP.config.visits.endpoint;
      // Sin footer, sin endpoint o abierto con doble clic (sin servidor): no hay contador
      if (!el || !endpoint || location.protocol === "file:") return;

      const hit = !alreadyCounted(); // true → POST (suma); false → GET (solo lee)
      try {
        const res = await fetch(endpoint, { method: hit ? "POST" : "GET", headers: { Accept: "application/json" } });
        if (!res.ok) throw new Error("HTTP " + res.status);
        const data = await res.json();
        if (hit) markCounted();

        el.querySelector("[data-visits-text]").textContent =
          fmt(data.total) + (data.total === 1 ? " visita" : " visitas") + (SP.config.visits.showToday ? " · " + fmt(data.hoy) + " hoy" : "");
        el.title = "Visitas totales al sitio";
        el.hidden = false;
      } catch (err) {
        console.info("[visitas] Contador no disponible:", err.message);
      }
    },
  };
})(window.SP);
