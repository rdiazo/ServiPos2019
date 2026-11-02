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
      $$("[data-icon]").forEach((el) => {
        el.outerHTML = SP.icon(el.dataset.icon);
      });
      $$("[data-wa]").forEach((a) => {
        a.href = waLink(a.dataset.waText);
      });
      $$("[data-mail]").forEach((a) => {
        a.href = mailLink(a.dataset.mailSubject);
      });
      $$("[data-config]").forEach((el) => {
        const value = el.dataset.config.split(".").reduce((o, k) => (o ? o[k] : ""), SP.config);
        if (value) el.textContent = value;
      });
    },
  };
})(window.SP);
