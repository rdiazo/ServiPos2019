/* ==========================================================================
   components/hydrate.js · completa atributos declarativos del HTML
   --------------------------------------------------------------------------
   Permite escribir HTML limpio sin repetir SVGs ni números de contacto:
     <span data-icon="pin"></span>          → inserta el ícono
     <a data-wa data-wa-text="Hola…">       → href de WhatsApp (texto opcional)
     <a data-mail data-mail-subject="…">    → href mailto al correo corporativo
     <span data-config="contact.email">     → texto desde config.js
   ========================================================================== */
(function (SP) {
  "use strict";
  const { $$, waLink, mailLink } = SP.utils;

  SP.components.hydrate = {
    init() {
      // <span data-icon="pin"> → se reemplaza por el <svg> del ícono
      $$("[data-icon]").forEach((el) => {
        el.outerHTML = SP.icon(el.dataset.icon);
      });
      // <a data-wa data-wa-text="…"> → enlace de WhatsApp con ese mensaje
      $$("[data-wa]").forEach((a) => {
        a.href = waLink(a.dataset.waText);
      });
      // <a data-mail data-mail-subject="…"> → mailto: al correo corporativo
      $$("[data-mail]").forEach((a) => {
        a.href = mailLink(a.dataset.mailSubject);
      });
      // <span data-config="contact.email"> → texto leído de config.js
      // ("contact.email" se recorre como SP.config.contact.email)
      $$("[data-config]").forEach((el) => {
        const value = el.dataset.config.split(".").reduce((o, k) => (o ? o[k] : ""), SP.config);
        if (value) el.textContent = value;
      });
    },
  };
})(window.SP);
