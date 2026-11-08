/* ==========================================================================
   data/services.js · los 3 pilares de servicio
   --------------------------------------------------------------------------
   Cada servicio genera una tarjeta en #servicios y su ficha técnica (modal).
   "id" se usa también en el diagnóstico rápido (data/diagnostic en
   components/diagnostic.js) para preseleccionar el equipo.
   ========================================================================== */
window.SP.data.services = [
  {
    id: "pos",
    icon: "pos",
    title: "Puntos de Venta (POS)",
    summary: "Soporte técnico, venta de POS, reparación multimarca, programación y mantenimiento preventivo.",
    highlights: ["Venta de equipos POS", "Reparación multimarca", "Mantenimiento preventivo"],
    specs: {
      includes: [
        "Diagnóstico de fallas de hardware y comunicación",
        "Reparación de tarjeta lógica, teclado, pantalla, impresora y lector de chip/banda",
        "Programación, actualización y configuración del terminal",
        "Venta de equipos POS con instalación y puesta en marcha en el comercio",
        "Planes de mantenimiento preventivo por contrato",
      ],
      brands: ["PAX", "Centerm", "Feitian", "Otras marcas"],
      forWho: "Comercios, cadenas y entidades bancarias.",
    },
  },
  {
    id: "atm",
    icon: "atm",
    title: "Cajeros Automáticos (ATM)",
    summary: "Mantenimiento correctivo, instalación de módulos, calibración y adecuación operativa.",
    highlights: ["Mantenimiento correctivo", "Instalación de módulos", "Calibración"],
    specs: {
      includes: [
        "Instalación y adecuación operativa del cajero",
        "Mantenimiento correctivo y preventivo",
        "Instalación y sustitución de módulos (dispensador, lectora, impresora)",
        "Calibración y pruebas de funcionamiento",
        "Soporte en sitio para entidades bancarias",
      ],
      brands: ["Multimarca"],
      forWho: "Bancos y operadores de cajeros automáticos.",
    },
  },
  {
    id: "supplies",
    icon: "roll",
    title: "Suministros y Partes",
    summary: "Venta de consumibles (rollos de papel térmico) y repuestos originales certificados.",
    highlights: ["Rollos de papel térmico", "Repuestos originales", "Stock permanente"],
    specs: {
      includes: [
        "Rollos de papel térmico para POS",
        "Partes, piezas y repuestos originales certificados por el fabricante",
        "Baterías, cargadores, teclados y pantallas",
        "Stock disponible en nuestra sede de Maracay",
        "Precios estables por convenio semestral",
      ],
      brands: ["Originales de fábrica"],
      forWho: "Comercios, técnicos e instituciones.",
    },
  },
];
