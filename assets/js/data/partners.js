/* ==========================================================================
   data/partners.js · aliados comerciales y métricas de confianza
   ========================================================================== */
window.SP.data.partners = [
  { name: "Credicard", logo: "assets/img/partners/credicards.png", url: "https://www.credicard.com.ve/" },
  { name: "Centerm", logo: "assets/img/partners/cer.jpg", url: "https://pos.centerm.com/" },
  { name: "BNC", logo: "assets/img/partners/bnc.png", url: "https://www.bncenlinea.com/" },
  { name: "Latin Pagos", logo: "assets/img/partners/larin.jpg", url: "https://www.latin-pagos.com/" },
  { name: "PAX", logo: "assets/img/partners/opax.jpg", url: "https://www.paxtechnology.com/" },
  { name: "Feitian", logo: "assets/img/partners/feitin.jpg", url: "https://portal.ftsafe.com/" },
];

/* Barra de confianza. value numérico → se anima contando.
   TODO: confirmar la cifra de equipos atendidos. */
window.SP.data.stats = [
  { prefix: "+", value: 10, suffix: "", label: "Años de experiencia técnica" },
  { prefix: "+", value: 1000, suffix: "", label: "Equipos e instalaciones atendidas" },
  { prefix: "", value: 100, suffix: "%", label: "Cobertura del Sistema Financiero Nacional" },
  { prefix: "", value: 6, suffix: "", label: "Aliados comerciales y fabricantes" },
];
