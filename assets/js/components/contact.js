/* ==========================================================================
   components/contact.js · formulario de contacto
   --------------------------------------------------------------------------
   El formulario está escrito en contacto.html (fácil de editar);
   este módulo solo aporta:
     · Validación de campos [required] / type="email"
     · Envío: config.forms.endpoint (POST) o, si no hay endpoint,
       WhatsApp / correo con los datos redactados.
   Para añadir un campo: agrégalo al HTML con name y <label>; se incluye solo.
   ========================================================================== */
(function (SP) {
  "use strict";
  const { $$, waLink, mailLink, submitToEndpoint, toast } = SP.utils;
  const icon = SP.icon;

  /* ---------- Validación ---------- */
  function validate(form) {
    let first = null;
    $$("[required]", form).forEach((input) => {
      let ok = input.type === "checkbox" ? input.checked : input.value.trim() !== "";
      if (ok && input.type === "email") ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      const field = input.closest(".field") || input.closest(".checkbox");
      if (field) field.classList.toggle("has-error", !ok);
      if (!ok && !first) first = input;
    });
    if (first) first.focus();
    return !first;
  }

  /* Convierte el formulario en texto legible usando las etiquetas */
  function toText(form) {
    const lines = ["*" + form.dataset.title + " · ServiPos 2019*"];
    $$("input, select, textarea", form).forEach((el) => {
      if (!el.name || el.type === "checkbox" || !el.value.trim()) return;
      const label = form.querySelector('label[for="' + el.id + '"]');
      const name = label ? label.textContent.replace("*", "").trim() : el.name;
      lines.push("• " + name + ": " + el.value.trim());
    });
    return lines.join("\n");
  }

  /** Reemplaza el formulario por un mensaje de confirmación.
      viaEndpoint = true si los datos ya llegaron al servidor. */
  function success(form, viaEndpoint) {
    form.outerHTML =
      '<div class="card success-box">' +
      '<span class="icon-badge icon-badge--accent">' + icon("check") + "</span>" +
      "<h3>¡Mensaje listo!</h3>" +
      "<p>" + (viaEndpoint
        ? "Recibimos tus datos. Te contactaremos en un máximo de 48 horas hábiles."
        : "Completa el envío en la ventana que se abrió y te responderemos a la brevedad.") +
      "</p>" +
      '<a class="btn btn--outline" href="index.html">' + icon("arrowLeft") + "Volver al inicio</a></div>";
  }

  /* ---------- Envío ---------- */
  function initForm(form) {
    form.addEventListener("input", (e) => {
      const f = e.target.closest(".field, .checkbox");
      if (f) f.classList.remove("has-error");
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!validate(form)) return;

      // ¿Qué botón se pulsó? data-channel="whatsapp" o "email"
      const channel = (e.submitter && e.submitter.dataset.channel) || "whatsapp";
      $$('[type="submit"]', form).forEach((b) => (b.disabled = true)); // evita envíos dobles

      try {
        const sent = await submitToEndpoint("contacto", new FormData(form));
        if (sent) {
          success(form, true);
          return;
        }
      } catch (err) {
        console.warn("[contacto] Falló el endpoint, se usa WhatsApp/correo:", err);
      }

      // Sin endpoint (o si falló): se abre WhatsApp o el correo con los datos
      const text = toText(form);
      if (channel === "email") window.location.href = mailLink(form.dataset.title, text.replace(/\*/g, ""));
      else window.open(waLink(text), "_blank", "noopener");
      toast("Datos listos para enviar");
      success(form, false);
    });
  }

  SP.components.contact = {
    init() {
      $$("form[data-contact-form]").forEach(initForm);
    },
  };
})(window.SP);
