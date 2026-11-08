/* ==========================================================================
   components/reveal.js · aparición suave al hacer scroll
   --------------------------------------------------------------------------
   Añade la clase .reveal a cualquier elemento para que aparezca al entrar en
   pantalla. Los hermanos se escalonan automáticamente (60 ms entre cada uno).
   ========================================================================== */
(function (SP) {
  "use strict";

  SP.components.reveal = {
    init() {
      const items = document.querySelectorAll(".reveal");
      if (!("IntersectionObserver" in window)) {
        items.forEach((el) => el.classList.add("is-visible"));
        return;
      }
      const io = new IntersectionObserver(
        (entries) => entries.forEach((en) => {
          if (!en.isIntersecting) return;
          const siblings = Array.from(en.target.parentElement.children).filter((c) => c.classList.contains("reveal"));
          en.target.style.transitionDelay = Math.min(siblings.indexOf(en.target), 6) * 60 + "ms";
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }),
        { threshold: 0, rootMargin: "0px 0px -40px 0px" } // threshold 0: también aparecen los elementos más altos que la pantalla
      );
      items.forEach((el) => io.observe(el));
    },
  };
})(window.SP);
