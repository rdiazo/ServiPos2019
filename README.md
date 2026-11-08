# ServiPos 2019 · Sitio web

Rediseño del sitio de **SERVIPOS 2019, C.A.** (Maracay, Aragua): soporte técnico, mantenimiento y suministros
para Puntos de Venta y Cajeros Automáticos. HTML5 semántico + CSS puro + JavaScript vanilla, sin compilación.

## Cómo verlo

- Doble clic en `index.html` (funciona sin servidor, pero sin contador de visitas), o
- `python tools/dev_server.py 5520` y abrir http://localhost:5520 (incluye el contador de visitas)

## Páginas

| Archivo         | Contenido |
|-----------------|-----------|
| `index.html`    | Landing: hero · métricas · aliados · servicios · por qué nosotros · equipo · diagnóstico rápido · ubicación · banda de contacto |
| `nosotros.html` | Misión y fortaleza · equipo completo · aliados |
| `contacto.html` | Formulario de contacto para clientes (comercios, bancos, particulares) |

## Estructura

```
assets/
  css/
    base.css         Tokens de diseño (colores claro/oscuro, tipografía, radios), reset, accesibilidad
    layout.css       Contenedor, header fijo, menú móvil, footer, botón flotante de contacto
    components.css   Botones, ghost cards, opciones, formularios, modal, toast, indicador de estado
    sections.css     Un bloque por sección (hero, servicios, equipo, diagnóstico, mapa, contacto…)
    animations.css   Toda la animación: entrada del hero, apariciones al scroll, microinteracciones, carrusel
  img/               Logo original, favicon vectorizado, fotos del equipo, logos de aliados
  js/
    config.js        ⭐ Teléfonos, WhatsApp, correo, dirección, horario, menú, endpoint de formularios
    utils.js         Íconos SVG lineales, logo vectorizado y helpers (WhatsApp, correo, mapa, toast)
    data/            Contenido editable: services · team · partners (+ métricas)
    components/      Un archivo por sección/comportamiento, cada uno con su init()
    main.js          Arranque: layout → secciones con datos → comportamientos
```

Cada componente busca su punto de montaje (`data-mount="…"`) y no hace nada si la página no lo tiene,
así todas las páginas comparten el mismo `main.js`.

## Tareas habituales

| Quiero…                                   | Edito… |
|-------------------------------------------|--------|
| Cambiar WhatsApp, teléfonos, correo, horario | `assets/js/config.js` |
| Añadir o editar un miembro del equipo      | `assets/js/data/team.js` (`featured: true` = aparece en la portada) |
| Cambiar textos/especificaciones de servicios | `assets/js/data/services.js` |
| Cambiar opciones del diagnóstico rápido    | `EQUIPMENT` en `assets/js/components/diagnostic.js` |
| Añadir un campo al formulario de contacto  | Agrega el `<input>` con `name` y `<label>` en `contacto.html`; se envía solo |
| Cambiar colores de marca                   | `:root` y `:root[data-theme="dark"]` en `assets/css/base.css` |
| Animar un elemento al hacer scroll        | Clase `reveal` (+ `data-reveal="left / right / zoom / fade"` opcional) |
| Añadir un ícono                            | `ICONS` en `assets/js/utils.js` y úsalo con `<span data-icon="nombre"></span>` |
| Añadir una página                          | Copia `nosotros.html`, cambia `<main>` y agrega el enlace en `config.nav` |

## Formularios

Sin backend, el **diagnóstico** y el **contacto** abren WhatsApp (o el correo) con el mensaje ya redactado.
Para guardarlos en una base de datos, coloca una URL en `config.forms.endpoint`
(Formspree, Google Apps Script, API propia). Se enviará un `POST multipart/form-data` con todos los campos
y el campo `tipo` (`diagnostico` | `contacto`).

## Contador de visitas

El footer muestra `N visitas · N hoy`. Lo calcula `api/visitas.php` (PHP 7.4+, sin base de datos):
guarda el conteo en `api/data/visitas.json`, protegido por `api/data/.htaccess`.

- Cada navegador suma **1 visita por sesión** (navegar entre páginas o recargar no infla el número).
- Los bots conocidos no suman. "Hoy" se reinicia a medianoche, hora de Venezuela.
- Al publicar, la carpeta `api/data/` debe permitir escritura al servidor (lo normal en SiteGround).
- Para ocultarlo: deja vacío `visits.endpoint` en `config.js`; para quitar "· N hoy": `showToday: false`.
- En local, `tools/dev_server.py` imita el PHP con el mismo archivo.

## Pendiente antes de publicar

- `data/partners.js`: confirmar la cifra "+1,000 equipos atendidos".
- `config.js`: RIF de la empresa y etiqueta real de cada teléfono.
- `components/modal.js`: textos legales breves de privacidad y términos (revisar).
- Especialidades cortas del equipo (`skill` en `data/team.js`) — los cargos son los del sitio actual.
"# ServiPos2019" 
