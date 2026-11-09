/* ==========================================================================
   components/team.js · fichas del equipo
   --------------------------------------------------------------------------
   Montaje: <div class="team__grid" data-mount="team" data-filter="featured"></div>
     data-filter="featured" → solo los marcados como featured (portada)
     sin data-filter        → equipo completo (nosotros.html)
   Datos:   data/team.js
   ========================================================================== */
(function (SP) {
  "use strict";
  const { esc } = SP.utils;

  /** Ficha de una persona del equipo (foto, nombre, cargo y especialidad). */
  function card(m) {
    return (
      '<article class="card card--interactive member reveal">' +
      '<div class="member__photo"><img src="' + m.photo + '" alt="' + esc(m.name) + ", " + esc(m.role) + '" loading="lazy" width="284" height="284"></div>' +
      '<div class="member__body">' +
      '<h3 class="member__name">' + esc(m.name) + "</h3>" +
      '<p class="member__role">' + esc(m.role) + "</p>" +
      (m.skill ? '<span class="tag tag--primary member__skill">' + esc(m.skill) + "</span>" : "") +
      "</div></article>"
    );
  }

  SP.components.team = {
    init() {
      document.querySelectorAll('[data-mount="team"]').forEach((mount) => {
        // En la portada (data-filter="featured") solo los destacados; en Nosotros, todos
        const list = mount.dataset.filter === "featured" ? SP.data.team.filter((m) => m.featured) : SP.data.team;
        mount.innerHTML = list.map(card).join("");
      });
    },
  };
})(window.SP);
