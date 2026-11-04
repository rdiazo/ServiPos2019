/* ==========================================================================
   components/layout.js · header, menú móvil, footer y contacto flotante
   --------------------------------------------------------------------------
   Se renderizan en todas las páginas a partir de SP.config, así un cambio de
   menú o de teléfono se hace una sola vez.
   Puntos de montaje en el HTML:
     <div data-mount="header"></div>   <div data-mount="footer"></div>
   ========================================================================== */
(function (SP) {
  "use strict";
  const { esc, waLink, mailLink, telLink, resolveHref } = SP.utils;
  const icon = SP.icon;

  function brand(mono) {
    return (
      '<a class="brand" href="index.html" aria-label="' + esc(SP.config.company.name) + ' · inicio">' +
      SP.logoMark(mono) +
      '<span class="brand__name">ServiPos<small>2019</small></span></a>'
    );
  }

  function navLinks(cls) {
    return SP.config.nav
      .map((item) => '<li><a class="' + cls + '" href="' + resolveHref(item.href) + '">' + esc(item.label) + "</a></li>")
      .join("");
  }

  function header() {
    return (
      '<a class="skip-link" href="#main">Saltar al contenido</a>' +
      '<header class="site-header" data-header>' +
      '<div class="container">' +
      brand(false) +
      '<nav class="nav" aria-label="Principal"><ul class="nav__list">' + navLinks("nav__link") + "</ul></nav>" +
      '<div class="header-actions">' +
      '<button class="icon-btn theme-toggle" type="button" data-theme-toggle aria-label="Cambiar tema claro/oscuro">' +
      '<span class="icon-moon">' + icon("moon") + '</span><span class="icon-sun">' + icon("sun") + "</span></button>" +
      '<a class="btn btn--primary btn--sm btn--header" href="' + waLink() + '" target="_blank" rel="noopener">' + icon("whatsapp") + "Solicitar Soporte</a>" +
      '<button class="icon-btn menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Abrir menú">' + icon("menu") + "</button>" +
      "</div></div></header>" +
      '<div class="mobile-menu" id="mobile-menu" data-mobile-menu>' +
      "<ul>" + navLinks("") + "</ul>" +
      '<a class="btn btn--primary btn--lg" href="' + waLink() + '" target="_blank" rel="noopener">' + icon("whatsapp") + "Solicitar Soporte</a>" +
      "</div>"
    );
  }

  function footer() {
    const c = SP.config;
    const year = new Date().getFullYear();
    const phones = c.contact.phones
      .slice(0, 2)
      .map((p) => '<li><a href="' + telLink(p.number) + '">' + esc(p.number) + "</a></li>")
      .join("");

    return (
      '<footer class="site-footer"><div class="container">' +
      '<div class="footer-grid">' +
      '<div class="footer-brand">' + brand(true) +
      "<p>Soporte técnico, mantenimiento y suministros para sistemas de pago electrónico en Venezuela.</p></div>" +
      '<div class="footer-col"><h4>Sitio</h4><ul>' + navLinks("") + "</ul></div>" +
      '<div class="footer-col"><h4>Servicios</h4><ul>' +
      SP.data.services.map((s) => '<li><a href="' + resolveHref("#servicios") + '">' + esc(s.title) + "</a></li>").join("") +
      "</ul></div>" +
      '<div class="footer-col"><h4>Contacto</h4><ul>' + phones +
      '<li><a href="' + mailLink() + '">' + esc(c.contact.email) + "</a></li>" +
      "<li>" + esc(c.contact.address.city) + "</li>" +
      (c.social.youtube ? '<li><a href="' + c.social.youtube + '" target="_blank" rel="noopener">YouTube</a></li>' : "") +
      "</ul></div>" +
      "</div>" +
      '<div class="footer-bottom">' +
      "<span>© " + year + " " + esc(c.company.legalName) + (c.company.rif ? " · RIF " + esc(c.company.rif) : "") + "</span>" +
      '<span class="status" data-status><span class="status__dot"></span><span data-status-text>Centro de soporte en Maracay</span></span>' +
      '<span class="visits" data-visits hidden>' + icon("eye") + "<span data-visits-text></span></span>" +
      '<nav class="footer-legal" aria-label="Legal"><a href="#" data-legal="privacidad">Privacidad</a><a href="#" data-legal="terminos">Términos</a></nav>' +
      "</div></div></footer>"
    );
  }

  /* Contacto flotante: un botón pequeño que despliega WhatsApp / correo */
  function fab() {
    return (
      '<div class="fab" data-fab>' +
      '<div class="fab__menu" id="fab-menu" role="menu">' +
      '<a role="menuitem" href="' + waLink() + '" target="_blank" rel="noopener"><span style="color:#25d366">' + icon("whatsapp") + "</span><span>WhatsApp<small>Respuesta inmediata</small></span></a>" +
      '<a role="menuitem" href="' + mailLink("Solicitud de soporte") + '"><span style="color:var(--primary)">' + icon("mail") + "</span><span>Correo<small>" + esc(SP.config.contact.email) + "</small></span></a>" +
      '<a role="menuitem" href="' + telLink(SP.config.contact.phones[0].number) + '"><span style="color:var(--text-muted)">' + icon("phone") + "</span><span>Llamar<small>" + esc(SP.config.contact.phones[0].number) + "</small></span></a>" +
      "</div>" +
      '<button class="fab__toggle" type="button" data-fab-toggle aria-expanded="false" aria-controls="fab-menu" aria-label="Contactar">' +
      icon("whatsapp") + '<span class="fab__label">¿Hablamos?</span><span class="fab__dot"></span></button>' +
      "</div>"
    );
  }

  function initFab() {
    const root = document.querySelector("[data-fab]");
    const toggle = root.querySelector("[data-fab-toggle]");
    const set = (open) => {
      root.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
    };
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      set(!root.classList.contains("is-open"));
    });
    document.addEventListener("click", (e) => { if (!root.contains(e.target)) set(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") set(false); });
  }

  SP.components.layout = {
    init() {
      const h = document.querySelector('[data-mount="header"]');
      const f = document.querySelector('[data-mount="footer"]');
      if (h) h.outerHTML = header();
      if (f) f.outerHTML = footer();
      document.body.insertAdjacentHTML("beforeend", fab());
      initFab();
    },
  };
})(window.SP);
