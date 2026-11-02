/* ==========================================================================
   config.js · ⭐ datos de la empresa (EDITAR AQUÍ)
   --------------------------------------------------------------------------
   Todo lo que cambia con el tiempo (teléfonos, WhatsApp, correo, horario,
   dirección, endpoint de formularios) vive en este archivo. Ninguna otra
   parte del sitio tiene estos datos escritos a mano.
   Fuente: servipos2019.com (noviembre 2026).
   ========================================================================== */
window.SP = window.SP || { data: {}, components: {} };

window.SP.config = {
  company: {
    name: "ServiPos 2019",
    legalName: "SERVIPOS 2019, C.A.",
    rif: "", // TODO: colocar el RIF (J-XXXXXXXX-X) para mostrarlo en el footer
    tagline: "Experiencia, probidad y cuidado minucioso.",
    foundedYearsExperience: 10,
  },

  contact: {
    // Número de WhatsApp en formato internacional, solo dígitos (sin + ni espacios)
    whatsapp: "584125393188",
    // Mensaje por defecto al abrir WhatsApp desde botones genéricos
    whatsappDefault: "Hola ServiPos 2019, necesito soporte técnico para mi equipo.",
    email: "servipos2019@servipos2019.com",
    phones: [
      // TODO: ajustar las etiquetas a la función real de cada línea
      { label: "Principal · WhatsApp", number: "+58 412 539 31 88" },
      { label: "Móvil", number: "+58 412 744 62 00" },
      { label: "Oficina", number: "+58 243 233 12 59" },
      { label: "Móvil", number: "+58 412 558 83 91" },
    ],
    address: {
      line1: "Av. Bolívar, C.C. Global, PB, Pasillo D, Local 15",
      city: "Maracay, Edo. Aragua",
      country: "Venezuela",
      // Texto usado para el mapa embebido y el enlace "Cómo llegar"
      mapQuery: "Centro Comercial Global, Avenida Bolívar, Maracay, Aragua, Venezuela",
    },
  },

  /* Horario de atención (hora de Venezuela, UTC-4).
     days: 0 = domingo … 6 = sábado. Alimenta el indicador "Abierto ahora". */
  hours: {
    label: "Lun – Vie · 8:00 am – 5:00 pm",
    timezoneOffset: -4,
    days: [1, 2, 3, 4, 5],
    open: 8,
    close: 17,
  },

  social: {
    youtube: "https://www.youtube.com/channel/UCGtkyM32H0Lfc2HWBxpNJyA/",
    instagram: "", // TODO: añadir si existe
  },

  /* Formularios (diagnóstico y contacto).
     Sin endpoint: se abre WhatsApp / correo con el mensaje redactado.
     Con endpoint (Formspree, Google Apps Script, API propia): se envía un
     POST multipart/form-data con todos los campos + "tipo". */
  forms: {
    endpoint: "",
  },

  /* Navegación principal. "href" que empieza por "#" = salto suave dentro
     de la página de inicio; desde otras páginas se resuelve a index.html#… */
  nav: [
    { label: "Servicios", href: "#servicios" },
    { label: "Nosotros", href: "nosotros.html" },
    { label: "Ubicación", href: "#ubicacion" },
    { label: "Contacto", href: "contacto.html" },
  ],
};
