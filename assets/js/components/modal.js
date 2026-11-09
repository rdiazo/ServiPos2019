/* ==========================================================================
   components/modal.js · ventana modal reutilizable + textos legales
   --------------------------------------------------------------------------
   SP.modal.open(htmlString, { label })  → abre el modal con ese contenido
   SP.modal.close()
   Accesible: foco atrapado, Esc para cerrar, devuelve el foco al origen.
   ========================================================================== */
(function (SP) {
  "use strict";
  // root: contenedor · dialog: la ventana · body: su contenido · lastFocus: a dónde volver al cerrar
  let root, dialog, body, lastFocus;

  // Elementos que pueden recibir foco con Tab (para mantenerlo dentro del modal)
  const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])';

  /* Textos legales breves. TODO: revisar con asesoría legal. */
  const LEGAL = {
    privacidad:
      "<h2>Privacidad</h2><p style='margin-top:14px'>Los datos que nos envías (nombre, teléfono, correo y detalles del equipo) se usan únicamente para responder tu solicitud, o coordinar el servicio técnico. No los compartimos con terceros ajenos a la prestación del servicio. Puedes pedir su corrección o eliminación escribiendo a <strong>" +
      SP.config.contact.email + "</strong>.</p>",
    terminos:
      "<h2>Términos</h2><p style='margin-top:14px'>La información de este sitio es referencial. Precios, tiempos de respuesta y alcance de cada servicio se confirman por escrito al momento de la cotización o del contrato de mantenimiento. Las marcas mencionadas pertenecen a sus respectivos titulares.</p>",
  };

  /** Crea el modal la primera vez que se usa (no existe en el HTML). */
  function build() {
    root = document.createElement("div");
    root.className = "modal";
    root.hidden = true;
    root.innerHTML =
      '<div class="modal__backdrop" data-modal-close></div>' +
      '<div class="modal__dialog" role="dialog" aria-modal="true">' +
      '<button class="icon-btn modal__close" type="button" data-modal-close aria-label="Cerrar">' + SP.icon("x") + "</button>" +
      '<div data-modal-body></div></div>';
    document.body.appendChild(root);
    dialog = root.querySelector(".modal__dialog");
    body = root.querySelector("[data-modal-body]");

    root.addEventListener("click", (e) => { if (e.target.closest("[data-modal-close]")) close(); });
    root.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
      // Trampa de foco: con Tab al final vuelve al inicio, y viceversa,
      // para que el teclado no se "escape" a la página de atrás.
      if (e.key !== "Tab") return;
      const items = dialog.querySelectorAll(FOCUSABLE);
      const first = items[0], last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
  }

  /** Abre el modal con el HTML dado. opts.label = nombre accesible.
      Bloquea el scroll de la página y lleva el foco al botón cerrar. */
  function open(html, opts) {
    if (!root) build();
    lastFocus = document.activeElement;
    body.innerHTML = html;
    dialog.setAttribute("aria-label", (opts && opts.label) || "Detalle");
    root.hidden = false;
    document.body.style.overflow = "hidden";
    dialog.querySelector(".modal__close").focus();
  }

  /** Cierra el modal, restaura el scroll y devuelve el foco a donde estaba. */
  function close() {
    if (!root || root.hidden) return;
    root.hidden = true;
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  SP.modal = { open, close };

  /* Cualquier enlace con data-legal="privacidad|terminos" abre su texto. */
  SP.components.modal = {
    init() {
      document.addEventListener("click", (e) => {
        const link = e.target.closest("[data-legal]");
        if (!link) return;
        e.preventDefault();
        open(LEGAL[link.dataset.legal], { label: link.textContent });
      });
    },
  };
})(window.SP);
