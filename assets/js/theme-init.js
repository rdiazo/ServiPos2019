/* ==========================================================================
   theme-init.js · tema según la hora del visitante (se carga en el <head>)
   --------------------------------------------------------------------------
   Se ejecuta antes de pintar la página para que no parpadee.
   Regla por defecto, con el reloj del dispositivo donde se abre el sitio:
     · De día   (6:00 am – 5:59 pm) → tema OSCURO
     · De noche (6:00 pm – 5:59 am) → tema CLARO
   Si el visitante usa el botón ☀/☾, su elección manda durante esa visita
   (sessionStorage); en la próxima visita vuelve a decidir la hora.
   Para cambiar el horario edita DAY_START / DAY_END.
   También activa las animaciones de entrada (clases .js / .is-ready).
   ========================================================================== */
(function () {
  "use strict";
  var DAY_START = 6;  // hora en que empieza el "día" (0–23)
  var DAY_END = 18;   // hora en que empieza la "noche" (0–23)
  var KEY = "sp-theme";
  var root = document.documentElement;

  function clockTheme(date) {
    var h = (date || new Date()).getHours();
    return h >= DAY_START && h < DAY_END ? "dark" : "light";
  }
  function manual() {
    try { return sessionStorage.getItem(KEY); } catch (e) { return null; }
  }

  // Limpia la preferencia permanente que guardaban versiones anteriores
  try { localStorage.removeItem(KEY); } catch (e) { /* almacenamiento bloqueado */ }

  root.setAttribute("data-theme", manual() || clockTheme());

  // API para components/theme.js
  window.SPTheme = { KEY: KEY, clockTheme: clockTheme, manual: manual };

  // Animaciones de entrada (animations.css): .js oculta, .is-ready las dispara
  root.classList.replace("no-js", "js");
  addEventListener("DOMContentLoaded", function () {
    requestAnimationFrame(function () { root.classList.add("is-ready"); });
  });
})();
