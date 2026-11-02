/* ==========================================================================
   components/services.js · tarjetas de servicio + ficha técnica (modal)
   --------------------------------------------------------------------------
   Montaje: <div class="services__grid" data-mount="services"></div>
   Datos:   data/services.js
   Cada tarjeta abre su ficha; desde la ficha se puede pedir cotización por
   WhatsApp o saltar al diagnóstico con el equipo ya seleccionado.
   ========================================================================== */
(function (SP) {
  "use strict";
  const { esc, waLink } = SP.utils;
  const icon = SP.icon;

  function card(s, i) {
    return (
      '<article class="card card--interactive service reveal">' +
      '<div class="service__top"><span class="icon-badge">' + icon(s.icon) + "</span>" +
      '<span class="service__num">0' + (i + 1) + "</span></div>" +
      "<h3>" + esc(s.title) + "</h3>" +
      "<p>" + esc(s.summary) + "</p>" +
      '<ul class="check-list">' + s.highlights.map((h) => "<li>" + icon("check") + esc(h) + "</li>").join("") + "</ul>" +
      '<div class="service__foot">' +
      '<button class="link-arrow" type="button" data-service="' + s.id + '">Ver especificaciones' + icon("arrowRight") + "</button>" +
      '<a class="btn btn--ghost btn--sm" href="' + waLink("Hola, quisiera una cotización de: " + s.title) + '" target="_blank" rel="noopener">Cotizar</a>' +
      "</div></article>"
    );
  }

  function detail(s) {
    return (
      '<div class="spec-head"><span class="icon-badge">' + icon(s.icon) + "</span>" +
      '<div><span class="eyebrow" style="margin-bottom:4px">Ficha técnica</span><h2 style="font-size:1.5rem">' + esc(s.title) + "</h2></div></div>" +
      "<p>" + esc(s.summary) + "</p>" +
      '<div class="spec-block"><h4>Incluye</h4><ul class="check-list">' +
      s.specs.includes.map((x) => "<li>" + icon("check") + esc(x) + "</li>").join("") + "</ul></div>" +
      '<div class="spec-block"><h4>Marcas y equipos</h4><div class="spec-tags">' +
      s.specs.brands.map((b) => '<span class="tag">' + esc(b) + "</span>").join("") + "</div></div>" +
      '<div class="spec-block"><h4>Ideal para</h4><p>' + esc(s.specs.forWho) + "</p></div>" +
      '<div class="spec-actions">' +
      '<a class="btn btn--whatsapp" href="' + waLink("Hola, quisiera una cotización de: " + s.title) + '" target="_blank" rel="noopener">' + icon("whatsapp") + "Solicitar cotización</a>" +
      '<button class="btn btn--outline" type="button" data-diagnose="' + s.id + '">Diagnosticar una falla</button>' +
      "</div>"
    );
  }

  SP.components.services = {
    init() {
      const mount = document.querySelector('[data-mount="services"]');
      if (!mount) return;
      mount.innerHTML = SP.data.services.map(card).join("");

      document.addEventListener("click", (e) => {
        const open = e.target.closest("[data-service]");
        if (open) {
          const s = SP.data.services.find((x) => x.id === open.dataset.service);
          SP.modal.open(detail(s), { label: s.title });
          return;
        }
        const diag = e.target.closest("[data-diagnose]");
        if (diag) {
          SP.modal.close();
          if (SP.diagnostic) SP.diagnostic.preselect(diag.dataset.diagnose);
        }
      });
    },
  };
})(window.SP);
