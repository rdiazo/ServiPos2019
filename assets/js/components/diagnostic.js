/* ==========================================================================
   components/diagnostic.js · diagnóstico rápido por pasos
   --------------------------------------------------------------------------
   Montaje: <div data-mount="diagnostic"></div>
   Flujo:   1 Equipo → 2 Problema → 3 Contacto → 4 Resumen y envío
   Envío:   abre WhatsApp con el mensaje armado (o correo). Si hay
            config.forms.endpoint, además registra la solicitud allí.
   API:     SP.diagnostic.preselect("pos" | "atm" | "supplies")
            (la usa la ficha de servicios para saltar aquí)
   Para añadir equipos o problemas: edita EQUIPMENT abajo.
   ========================================================================== */
(function (SP) {
  "use strict";
  const { esc, waLink, mailLink, toast, submitToEndpoint } = SP.utils;
  const icon = SP.icon;

  /* ---------- Opciones por tipo de equipo ---------- */
  const EQUIPMENT = {
    pos: {
      label: "Punto de Venta", icon: "pos",
      question: "¿Qué problema presenta el punto de venta?",
      problems: ["No enciende / no carga", "No imprime", "No lee tarjetas", "Sin comunicación / no conecta", "Pantalla o teclado dañado", "Mantenimiento preventivo", "Instalación / programación", "Otro"],
    },
    atm: {
      label: "Cajero Automático", icon: "atm",
      question: "¿Qué problema presenta el cajero?",
      problems: ["No dispensa efectivo", "Falla de lectora de tarjetas", "Falla de impresora de recibos", "Fuera de servicio / sin comunicación", "Instalación o cambio de módulo", "Mantenimiento preventivo", "Otro"],
    },
    supplies: {
      label: "Requiero Suministros", icon: "roll",
      question: "¿Qué necesitas?",
      problems: ["Rollos de papel térmico", "Repuestos / partes", "Baterías o cargadores", "Otro suministro"],
    },
  };

  const state = { step: 1, equipment: null, problem: null };
  let root;

  /* ---------- Plantilla ---------- */
  function template() {
    const equipmentOptions = Object.entries(EQUIPMENT)
      .map(([id, e]) => '<button class="option" type="button" aria-pressed="false" data-equipment="' + id + '">' + icon(e.icon) + esc(e.label) + "</button>")
      .join("");

    return (
      '<form class="card diag__card" novalidate data-diag-form>' +
      '<div class="stepper" aria-hidden="true">' + [1, 2, 3, 4].map(() => '<div class="stepper__bar"><span></span></div>').join("") + "</div>" +

      // Paso 1
      '<fieldset class="step is-active" data-step="1" style="border:0;padding:0">' +
      '<span class="step__count">Paso 1 de 4</span>' +
      '<legend class="sr-only">Tipo de equipo</legend>' +
      '<h3 class="step__title">¿Qué tipo de equipo presenta la falla?</h3>' +
      '<div class="option-grid option-grid--3">' + equipmentOptions + "</div>" +
      "</fieldset>" +

      // Paso 2
      '<fieldset class="step" data-step="2" style="border:0;padding:0">' +
      '<span class="step__count">Paso 2 de 4</span>' +
      '<h3 class="step__title" data-problem-title></h3>' +
      '<div class="option-grid option-grid--2" role="radiogroup" data-problems></div>' +
      '<div class="field" style="margin-top:16px"><label for="d-details">Detalles <span class="hint">(opcional: marca, modelo, banco, cantidad…)</span></label>' +
      '<textarea class="textarea" id="d-details" name="details" rows="3" placeholder="Ej.: PAX D210 del BNC, no imprime desde ayer"></textarea></div>' +
      '<div class="step__nav"><button class="btn btn--ghost" type="button" data-prev>' + icon("arrowLeft") + "Atrás</button>" +
      '<button class="btn btn--primary" type="button" data-next disabled>Continuar' + icon("arrowRight") + "</button></div>" +
      "</fieldset>" +

      // Paso 3
      '<fieldset class="step" data-step="3" style="border:0;padding:0">' +
      '<span class="step__count">Paso 3 de 4</span>' +
      '<h3 class="step__title">¿A quién contactamos?</h3>' +
      '<div class="form-grid form-grid--2">' +
      field("d-name", "name", "Nombre y apellido", "text", "name", true) +
      field("d-phone", "phone", "Teléfono / WhatsApp", "tel", "tel", true, "0412 000 00 00") +
      field("d-company", "company", "Comercio o empresa", "text", "organization", false) +
      field("d-city", "city", "Ciudad", "text", "address-level2", false, "Maracay") +
      "</div>" +
      '<div class="step__nav"><button class="btn btn--ghost" type="button" data-prev>' + icon("arrowLeft") + "Atrás</button>" +
      '<button class="btn btn--primary" type="button" data-next>Revisar solicitud' + icon("arrowRight") + "</button></div>" +
      "</fieldset>" +

      // Paso 4
      '<div class="step" data-step="4">' +
      '<span class="step__count">Paso 4 de 4</span>' +
      '<h3 class="step__title">Confirma y envía</h3>' +
      '<dl class="summary" data-summary></dl>' +
      '<button class="btn btn--whatsapp btn--lg btn--block" type="submit">' + icon("whatsapp") + "Enviar a WhatsApp del técnico de guardia</button>" +
      '<div class="diag__alt"><button class="btn btn--ghost btn--sm" type="button" data-prev>' + icon("arrowLeft") + "Editar</button>" +
      '<a class="btn btn--ghost btn--sm" href="#" data-send-mail>' + icon("mail") + "Prefiero enviarlo por correo</a></div>" +
      "</div>" +
      "</form>"
    );
  }

  function field(id, name, label, type, autocomplete, required, placeholder) {
    return (
      '<div class="field"><label for="' + id + '">' + label + (required ? " *" : "") + "</label>" +
      '<input class="input" id="' + id + '" name="' + name + '" type="' + type + '" autocomplete="' + autocomplete + '"' +
      (required ? " required" : "") + (placeholder ? ' placeholder="' + placeholder + '"' : "") + ">" +
      '<span class="error-msg">Este campo es obligatorio</span></div>'
    );
  }

  /* ---------- Navegación entre pasos ---------- */
  function go(step) {
    state.step = step;
    root.querySelectorAll(".step").forEach((el) => el.classList.toggle("is-active", +el.dataset.step === step));
    root.querySelectorAll(".stepper__bar").forEach((bar, i) => bar.classList.toggle("is-done", i < step));
    if (step === 4) renderSummary();
    const focusTarget = root.querySelector('.step.is-active button, .step.is-active input');
    if (focusTarget && step > 1) focusTarget.focus({ preventScroll: true });
  }

  function selectEquipment(id) {
    state.equipment = id;
    state.problem = null;
    root.querySelectorAll("[data-equipment]").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.equipment === id)));
    const eq = EQUIPMENT[id];
    root.querySelector("[data-problem-title]").textContent = eq.question;
    root.querySelector("[data-problems]").innerHTML = eq.problems
      .map((p) => '<button class="option" type="button" role="radio" aria-checked="false" data-problem="' + esc(p) + '">' + esc(p) + "</button>")
      .join("");
    root.querySelector('[data-step="2"] [data-next]').disabled = true;
    go(2);
  }

  function validateContact() {
    let ok = true;
    root.querySelectorAll('[data-step="3"] [required]').forEach((input) => {
      const valid = input.value.trim().length > 1;
      input.closest(".field").classList.toggle("has-error", !valid);
      if (!valid && ok) { input.focus(); ok = false; }
    });
    return ok;
  }

  /* ---------- Resumen y mensaje ---------- */
  function values() {
    const f = root.querySelector("[data-diag-form]");
    return {
      equipo: EQUIPMENT[state.equipment].label,
      problema: state.problem,
      detalles: f.details.value.trim(),
      nombre: f.name.value.trim(),
      telefono: f.phone.value.trim(),
      empresa: f.company.value.trim(),
      ciudad: f.city.value.trim(),
    };
  }

  function renderSummary() {
    const v = values();
    const rows = [["Equipo", v.equipo], ["Problema", v.problema], ["Detalles", v.detalles], ["Contacto", v.nombre + " · " + v.telefono], ["Comercio", v.empresa], ["Ciudad", v.ciudad]];
    root.querySelector("[data-summary]").innerHTML = rows
      .filter((r) => r[1])
      .map((r) => "<div><dt>" + r[0] + "</dt><dd>" + esc(r[1]) + "</dd></div>")
      .join("");
  }

  function message() {
    const v = values();
    return [
      "*Solicitud de soporte técnico · ServiPos 2019*",
      "• Equipo: " + v.equipo,
      "• Problema: " + v.problema,
      v.detalles && "• Detalles: " + v.detalles,
      "• Nombre: " + v.nombre,
      "• Teléfono: " + v.telefono,
      v.empresa && "• Comercio: " + v.empresa,
      v.ciudad && "• Ciudad: " + v.ciudad,
    ].filter(Boolean).join("\n");
  }

  async function register() {
    try {
      const fd = new FormData();
      Object.entries(values()).forEach(([k, v]) => fd.append(k, v));
      await submitToEndpoint("diagnostico", fd);
    } catch (e) {
      console.warn("[diagnóstico] No se pudo registrar en el endpoint:", e);
    }
  }

  /* ---------- Eventos ---------- */
  function bind() {
    root.addEventListener("click", (e) => {
      const eq = e.target.closest("[data-equipment]");
      if (eq) return selectEquipment(eq.dataset.equipment);

      const pr = e.target.closest("[data-problem]");
      if (pr) {
        state.problem = pr.dataset.problem;
        root.querySelectorAll("[data-problem]").forEach((b) => b.setAttribute("aria-checked", String(b === pr)));
        root.querySelector('[data-step="2"] [data-next]').disabled = false;
        return;
      }
      if (e.target.closest("[data-prev]")) return go(state.step - 1);
      if (e.target.closest("[data-next]")) {
        if (state.step === 3 && !validateContact()) return;
        return go(state.step + 1);
      }
      if (e.target.closest("[data-send-mail]")) {
        e.preventDefault();
        register();
        window.location.href = mailLink("Solicitud de soporte: " + values().equipo, message().replace(/\*/g, ""));
      }
    });

    root.querySelector("[data-diag-form]").addEventListener("submit", (e) => {
      e.preventDefault();
      register();
      window.open(waLink(message()), "_blank", "noopener");
      toast("¡Listo! Te atenderemos por WhatsApp en breve.");
    });

    // Quita el error al escribir
    root.addEventListener("input", (e) => {
      const f = e.target.closest(".field");
      if (f) f.classList.remove("has-error");
    });
  }

  SP.diagnostic = {
    preselect(id) {
      if (!root || !EQUIPMENT[id]) return;
      selectEquipment(id);
      document.getElementById("diagnostico").scrollIntoView({ behavior: "smooth" });
    },
  };

  SP.components.diagnostic = {
    init() {
      root = document.querySelector('[data-mount="diagnostic"]');
      if (!root) return;
      root.innerHTML = template();
      bind();
      go(1);
    },
  };
})(window.SP);
