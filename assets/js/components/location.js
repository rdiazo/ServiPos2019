/* ==========================================================================
   components/location.js · datos de contacto + mapa
   --------------------------------------------------------------------------
   Montajes: <ul data-mount="contact-list"></ul>   <div data-mount="map"></div>
   El mapa es un iframe de Google Maps (sin API key). El estilo gris / oscuro
   se logra con el filtro CSS --map-filter (ver base.css), así sigue al tema.
   ========================================================================== */
(function (SP) {
  "use strict";
  const { esc, telLink, mailLink, mapEmbed, mapDirections } = SP.utils;
  const icon = SP.icon;

  function item(href, iconName, title, text, accent) {
    const tag = href ? "a" : "div";
    const attrs = href ? ' href="' + href + '"' + (href.startsWith("http") ? ' target="_blank" rel="noopener"' : "") : "";
    return (
      "<li><" + tag + ' class="contact-item"' + attrs + ">" +
      '<span class="icon-badge' + (accent ? " icon-badge--accent" : "") + '">' + icon(iconName) + "</span>" +
      "<div><strong>" + esc(title) + "</strong><span>" + text + "</span></div></" + tag + "></li>"
    );
  }

  function contactList() {
    const c = SP.config.contact;
    const phones = c.phones.map((p) => '<a href="' + telLink(p.number) + '" style="display:block">' + esc(p.number) + "</a>").join("");
    return (
      item(mapDirections(), "pin", "Dirección", esc(c.address.line1) + "<br>" + esc(c.address.city)) +
      item(null, "clock", "Horario de atención", esc(SP.config.hours.label) + '<br><span class="status" data-status style="margin-top:4px"><span class="status__dot"></span><span data-status-text></span></span>', true) +
      item(null, "phone", "Teléfonos", phones) +
      item(mailLink(), "mail", "Correo corporativo", esc(c.email))
    );
  }

  function map() {
    const a = SP.config.contact.address;
    return (
      '<iframe src="' + mapEmbed() + '" title="Mapa: ' + esc(a.line1) + '" loading="lazy" referrerpolicy="no-referrer-when-downgrade" allowfullscreen></iframe>' +
      '<div class="map__pin"><span class="icon-badge" style="width:34px;height:34px;border-radius:10px">' + icon("pin") + "</span>" +
      "<div><strong>C.C. Global · Local 15</strong>" + esc(a.city) + "</div></div>"
    );
  }

  SP.components.location = {
    init() {
      const list = document.querySelector('[data-mount="contact-list"]');
      const m = document.querySelector('[data-mount="map"]');
      if (list) list.innerHTML = contactList();
      if (m) m.innerHTML = map();
      document.querySelectorAll("[data-directions]").forEach((a) => (a.href = mapDirections()));
    },
  };
})(window.SP);
