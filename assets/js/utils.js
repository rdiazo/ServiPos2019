/* ==========================================================================
   utils.js · helpers compartidos + set de íconos lineales
   --------------------------------------------------------------------------
   SP.icon(nombre)        → string <svg> (trazo fino, hereda currentColor)
   SP.utils.waLink(texto) → URL de WhatsApp con el mensaje codificado
   SP.utils.toast(texto)  → aviso breve en pantalla
   Para añadir un ícono: agrega su contenido <path> en ICONS (viewBox 24x24).
   ========================================================================== */
(function (SP) {
  "use strict";

  /* ---------- Íconos (estilo outline, stroke 1.6) ---------- */
  const ICONS = {
    pos: '<rect x="6" y="2.5" width="12" height="19" rx="2.5"/><rect x="8.5" y="5" width="7" height="5" rx="1"/><path d="M9 13.5h.01M12 13.5h.01M15 13.5h.01M9 16.5h.01M12 16.5h.01M15 16.5h.01M10 19h4"/>',
    atm: '<rect x="3" y="3" width="18" height="11" rx="2"/><path d="M7 14v6.5h10V14M9.5 17.5h5M7 6.5h10M7 9.5h4"/>',
    roll: '<path d="M6 4h10a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3H6"/><ellipse cx="6" cy="7" rx="2" ry="3"/><path d="M8 10v10l2-1.2 2 1.2 2-1.2 2 1.2V10M10.5 13.5h3M10.5 16h3"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0 5 5L21 12.6a6 6 0 0 1-7.7 1.6L6.8 20.7a2 2 0 0 1-2.8-2.8l6.5-6.5A6 6 0 0 1 12 3.7z"/>',
    shield: '<path d="M12 3 4.5 6v5.5c0 4.6 3.2 8.4 7.5 9.5 4.3-1.1 7.5-4.9 7.5-9.5V6z"/><path d="m9 12 2 2 4-4"/>',
    bolt: '<path d="M13 2.5 4.5 13.5H12l-1 8 8.5-11H12z"/>',
    pin: '<path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>',
    phone: '<path d="M5 3.5h3.2l1.6 4-2 1.3a10.5 10.5 0 0 0 5.4 5.4l1.3-2 4 1.6V17a2 2 0 0 1-2 2A15.5 15.5 0 0 1 3 5.5a2 2 0 0 1 2-2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="m3.5 7 8.5 6 8.5-6"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15.5" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    users: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.6a3.5 3.5 0 0 1 0 6.8M18.5 14.5A6.5 6.5 0 0 1 21.5 20"/>',
    userPlus: '<circle cx="10" cy="8" r="4"/><path d="M3 20.5a7 7 0 0 1 12.5-4.3M19 14v6M16 17h6"/>',
    building: '<path d="M4 21V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v16M16 9h2a2 2 0 0 1 2 2v10M2.5 21h19M8 7h4M8 11h4M8 15h4"/>',
    briefcase: '<rect x="3" y="7" width="18" height="13" rx="2.5"/><path d="M8.5 7V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2M3 12.5h18"/>',
    chip: '<rect x="6" y="6" width="12" height="12" rx="2"/><rect x="9.5" y="9.5" width="5" height="5" rx="1"/><path d="M9 2.5V6M15 2.5V6M9 18v3.5M15 18v3.5M2.5 9H6M2.5 15H6M18 9h3.5M18 15h3.5"/>',
    settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-2.9 1.2V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-2.9-1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.7 1.7 0 0 0 3 14.1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.2-2.9l-.1-.1A2 2 0 1 1 7 4.3l.1.1a1.7 1.7 0 0 0 2.9-1.2V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 2.9 1.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0 1.2 2.9h.1a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    checkCircle: '<circle cx="12" cy="12" r="9"/><path d="m8 12.3 2.8 2.8L16.2 9.6"/>',
    arrowRight: '<path d="M5 12h14M13 6l6 6-6 6"/>',
    arrowLeft: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4"/>',
    moon: '<path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h10"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    route: '<circle cx="6" cy="19" r="2.5"/><circle cx="18" cy="5" r="2.5"/><path d="M8.5 19H16a3.5 3.5 0 0 0 0-7H8a3.5 3.5 0 0 1 0-7h7.5"/>',
    youtube: '<rect x="2.5" y="5" width="19" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/>',
    message: '<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H9l-5 4.5z"/>',
  };
  /* WhatsApp se dibuja relleno (es marca, no ícono lineal) */
  const WHATSAPP =
    '<svg class="i-whatsapp" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.04 2a9.9 9.9 0 0 0-8.5 15l-1.4 5 5.2-1.36A9.9 9.9 0 1 0 12.04 2zm0 18.1a8.2 8.2 0 0 1-4.2-1.15l-.3-.18-3.1.8.83-3-.2-.31a8.2 8.2 0 1 1 6.97 3.84zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.14.16-.29.19-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.23-1.46-1.37-1.7-.14-.25-.02-.38.11-.5.11-.11.25-.29.37-.43.12-.15.16-.25.25-.41.08-.17.04-.31-.02-.43-.06-.13-.55-1.34-.76-1.83-.2-.48-.4-.42-.55-.42h-.47a.9.9 0 0 0-.65.31c-.23.25-.86.84-.86 2.05 0 1.2.88 2.37 1 2.54.12.16 1.73 2.64 4.2 3.7.58.25 1.04.4 1.4.52.59.19 1.12.16 1.54.1.47-.07 1.46-.6 1.66-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.17-.47-.29z"/></svg>';

  /* Cada ícono lleva la clase i-<nombre> para poder animarlo (animations.css) */
  SP.icon = function (name) {
    if (name === "whatsapp") return WHATSAPP;
    const body = ICONS[name];
    if (!body) return "";
    return '<svg class="i-' + name + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + body + "</svg>";
  };

  /* Logo vectorizado: insignia "SP" con las tres luces del original.
     mono = true → versión monocromática (hereda currentColor).
     Las piezas llevan clases (brand__plate, brand__letters, brand__light,
     brand__shine) para animarlas desde animations.css. Las transformaciones
     del dibujo van en <g> padres para no chocar con las de CSS. */
  SP.logoMark = function (mono) {
    const plate = mono ? "currentColor" : "var(--logo-plate)";
    const lights = mono ? ["currentColor", "currentColor", "currentColor"] : ["#ef4444", "#f5c518", "#22c55e"];
    const lightOpacity = mono ? ' opacity=".55"' : "";
    const plateRect = '<rect x="6" y="3" width="36" height="42" rx="9"/>';
    const light = (x, i) => '<rect class="brand__light" style="--n:' + i + '" x="' + x + '" y="33" width="6.5" height="5" rx="1.2" fill="' + lights[i] + '"/>';
    return (
      '<svg class="brand__mark' + (mono ? " brand__mark--mono" : "") + '" viewBox="0 0 48 48" aria-hidden="true">' +
      (mono ? "" : '<defs><clipPath id="sp-plate-clip"><g transform="rotate(-8 24 24)">' + plateRect + "</g></clipPath></defs>") +
      '<g transform="rotate(-8 24 24)"><g class="brand__plate" style="fill:' + plate + '">' + plateRect + "</g></g>" +
      '<g class="brand__letters"><text x="24" y="27" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="19" fill="' + (mono ? "var(--surface)" : "#fff") + '" transform="rotate(-8 24 24)">SP</text></g>' +
      '<g transform="rotate(-8 24 24)"' + lightOpacity + ">" + light(12, 0) + light(20.75, 1) + light(29.5, 2) + "</g>" +
      // Destello diagonal que cruza la placa (solo versión a color)
      (mono ? "" : '<g clip-path="url(#sp-plate-clip)"><g class="brand__shine"><rect x="4" y="-10" width="7" height="70" fill="#fff" opacity=".28" transform="rotate(24 24 24)"/></g></g>') +
      "</svg>"
    );
  };

  /* ---------- Helpers ---------- */
  const utils = {
    $: (sel, root) => (root || document).querySelector(sel),
    $$: (sel, root) => Array.from((root || document).querySelectorAll(sel)),

    /* Escapa texto antes de insertarlo como HTML */
    esc(str) {
      return String(str ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
    },

    /* Enlace de WhatsApp con mensaje prellenado */
    waLink(message) {
      const text = message || SP.config.contact.whatsappDefault;
      return "https://wa.me/" + SP.config.contact.whatsapp + "?text=" + encodeURIComponent(text);
    },

    mailLink(subject, body) {
      const q = [];
      if (subject) q.push("subject=" + encodeURIComponent(subject));
      if (body) q.push("body=" + encodeURIComponent(body));
      return "mailto:" + SP.config.contact.email + (q.length ? "?" + q.join("&") : "");
    },

    telLink(number) {
      return "tel:" + number.replace(/[^\d+]/g, "");
    },

    mapEmbed() {
      return "https://www.google.com/maps?q=" + encodeURIComponent(SP.config.contact.address.mapQuery) + "&z=16&output=embed";
    },
    mapDirections() {
      return "https://www.google.com/maps/dir/?api=1&destination=" + encodeURIComponent(SP.config.contact.address.mapQuery);
    },

    /* ¿Estamos en la página de inicio? (para resolver enlaces "#seccion") */
    isHome() {
      return !!document.querySelector("[data-page='home']");
    },
    resolveHref(href) {
      return href.startsWith("#") && !utils.isHome() ? "index.html" + href : href;
    },

    /* Aviso breve en la parte inferior */
    toast(message) {
      let el = document.querySelector(".toast");
      if (!el) {
        el = document.createElement("div");
        el.className = "toast";
        el.setAttribute("role", "status");
        document.body.appendChild(el);
      }
      el.innerHTML = SP.icon("checkCircle") + "<span>" + utils.esc(message) + "</span>";
      requestAnimationFrame(() => el.classList.add("is-visible"));
      clearTimeout(el._t);
      el._t = setTimeout(() => el.classList.remove("is-visible"), 3200);
    },

    /* Envía datos al endpoint configurado. Devuelve true si se envió. */
    async submitToEndpoint(type, formData) {
      const endpoint = SP.config.forms.endpoint;
      if (!endpoint) return false;
      formData.append("tipo", type);
      const res = await fetch(endpoint, { method: "POST", body: formData, headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return true;
    },
  };

  SP.utils = utils;
})(window.SP);
