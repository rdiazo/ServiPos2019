/* ==========================================================================
   components/status.js · indicador "abierto / cerrado" en vivo
   --------------------------------------------------------------------------
   Calcula la hora de Venezuela (config.hours.timezoneOffset) sin importar la
   zona del visitante y actualiza todo elemento [data-status]:
     <span class="status" data-status><span class="status__dot"></span>
       <span data-status-text></span></span>
   ========================================================================== */
(function (SP) {
  "use strict";
  const DAYS = ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"];

  function localNow() {
    const now = new Date();
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    return new Date(utc + SP.config.hours.timezoneOffset * 3600000);
  }

  function fmtHour(h) {
    const suffix = h >= 12 ? "pm" : "am";
    return ((h + 11) % 12) + 1 + ":00 " + suffix;
  }

  /* Devuelve { open: bool, text: string } */
  function compute() {
    const h = SP.config.hours;
    const now = localNow();
    const day = now.getDay();
    const hour = now.getHours() + now.getMinutes() / 60;
    const workday = h.days.includes(day);

    if (workday && hour >= h.open && hour < h.close) {
      return { open: true, text: "Centro de soporte operativo hoy en Maracay · hasta las " + fmtHour(h.close) };
    }
    // Próxima apertura
    let next = 0;
    for (let i = 0; i < 8; i++) {
      const d = (day + i) % 7;
      if (h.days.includes(d) && (i > 0 || hour < h.open)) { next = i; break; }
    }
    const when = next === 0 ? "hoy" : next === 1 ? "mañana" : "el " + DAYS[(day + next) % 7];
    return { open: false, text: "Fuera de horario · abrimos " + when + " a las " + fmtHour(h.open) + " (WhatsApp disponible)" };
  }

  function render() {
    const s = compute();
    document.querySelectorAll("[data-status]").forEach((el) => {
      el.classList.toggle("is-open", s.open);
      const t = el.querySelector("[data-status-text]");
      if (t) t.textContent = s.text;
    });
  }

  SP.components.status = {
    init() {
      render();
      setInterval(render, 60000);
    },
  };
})(window.SP);
