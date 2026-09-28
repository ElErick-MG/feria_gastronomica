/* ============================================================
   js/reglas.js — Feria Gastronómica | Conjunto Carmencita
   ============================================================
   Módulo autocontenido para la gestión de las Reglas del Evento:
     · Catálogo inmutable de directrices, fecha, hora y dinámicas
     · Inyección dinámica del modal en el DOM (sin ensuciar index.html)
     · Control de animaciones con GSAP y bloqueo de scroll
     · Delegación de eventos para apertura, cierre y tecla Escape
   ============================================================ */

/** Catálogo oficial de reglas y datos del evento */
export const REGLAS_INFO = {
  titulo: "Feria Gastronómica Internacional",
  comunidad: "Conjunto Carmencita",
  fecha: "3 de octubre",
  hora: "13h00",
  lugar: "Conjunto Carmencita",
  dinamica: "La actividad consiste en una exposición gastronómica por grupos. Los grupos serán de 4 integrantes y estarán conformados por personas de diferentes familias. A cada grupo se le asignará un país al azar.",
  tiktokGuia: "https://vt.tiktok.com/ZSq4oYRWN/",
  requisitos: [
    { icon: "🗺️", texto: "Información sobre su cultura y ubicación." },
    { icon: "🍲", texto: "Comida típica en pequeñas porciones para degustación." },
    { icon: "🎨", texto: "Decoración relacionada con el país." },
    { icon: "👘", texto: "Vestimenta representativa, de ser posible. <em>(No es obligatorio)</em>" },
    { icon: "👥", texto: "Exposición en la que participen todos los integrantes." }
  ],
  criterios: "Se tomará en cuenta la creatividad, organización, presentación, conocimiento del país e integración familiar."
};

let modalEl = null;

/** Genera la plantilla HTML del modal a partir de los datos */
function renderModalTemplate() {
  const r = REGLAS_INFO;
  return `
    <div class="modal-card">
      <button class="modal-close" data-cerrar-reglas aria-label="Cerrar ventana de reglas">&times;</button>
      
      <div class="modal-header">
        <span class="modal-badge">🌍 ${r.comunidad}</span>
        <h2 id="reglasTitulo" class="modal-titulo">${r.titulo}</h2>
      </div>

      <!-- Metadatos clave del evento -->
      <div class="modal-info-grid">
        <div class="modal-info-item">
          <span class="modal-info-icon">📅</span>
          <div>
            <small>Fecha</small>
            <strong>${r.fecha}</strong>
          </div>
        </div>
        <div class="modal-info-item">
          <span class="modal-info-icon">⏰</span>
          <div>
            <small>Hora</small>
            <strong>${r.hora}</strong>
          </div>
        </div>
        <div class="modal-info-item">
          <span class="modal-info-icon">📍</span>
          <div>
            <small>Lugar</small>
            <strong>${r.lugar}</strong>
          </div>
        </div>
      </div>

      <!-- Dinámica principal -->
      <div class="modal-banner-dinamica">
        <p>La actividad consiste en una <strong>exposición gastronómica por grupos</strong>. Los grupos serán de <strong>4 integrantes</strong> y estarán conformados por personas de diferentes familias. A cada grupo se le asignará un país al azar.</p>
      </div>

      <!-- Video Guía de Referencia en TikTok -->
      <a href="${r.tiktokGuia}" target="_blank" rel="noopener noreferrer" class="modal-tiktok-card">
        <div class="modal-tiktok-icon">🎬</div>
        <div class="modal-tiktok-info">
          <strong>Video de guía y referencia en TikTok</strong>
          <small>Mira un ejemplo de cómo organizar los stands y la degustación</small>
        </div>
        <span class="modal-tiktok-badge">Ver video ↗</span>
      </a>

      <!-- Requisitos de la presentación -->
      <div class="modal-seccion">
        <h3 class="modal-subtitulo">📌 Cada grupo deberá preparar una presentación sobre el país asignado, incluyendo:</h3>
        <ul class="modal-puntos">
          ${r.requisitos.map(req => `
            <li>
              <span class="modal-punto-icon">${req.icon}</span>
              <div>${req.texto}</div>
            </li>
          `).join("")}
        </ul>
      </div>

      <!-- Criterios de evaluación -->
      <div class="modal-criterios">
        <div class="modal-criterios-header">
          <span class="modal-criterios-icon">⭐</span>
          <strong>Criterios a tomar en cuenta:</strong>
        </div>
        <p>${r.criterios}</p>
      </div>

      <!-- Botón de acción para cerrar -->
      <button class="modal-btn-ok" data-cerrar-reglas>¡Entendido!</button>
    </div>
  `;
}

/** Garantiza que el elemento modal exista en el DOM */
export function ensureModal() {
  if (modalEl && document.body.contains(modalEl)) return modalEl;

  modalEl = document.getElementById("modalReglas");
  if (!modalEl) {
    modalEl = document.createElement("div");
    modalEl.id = "modalReglas";
    modalEl.className = "modal-overlay";
    modalEl.hidden = true;
    modalEl.setAttribute("role", "dialog");
    modalEl.setAttribute("aria-modal", "true");
    modalEl.setAttribute("aria-labelledby", "reglasTitulo");
    modalEl.innerHTML = renderModalTemplate();
    document.body.appendChild(modalEl);
  }
  return modalEl;
}

/** Abre la ventana flotante de reglas con animación */
export function abrirReglas() {
  const m = ensureModal();
  m.hidden = false;
  document.body.style.overflow = "hidden";

  if (window.gsap) {
    window.gsap.killTweensOf([m, m.querySelector(".modal-card")]);
    window.gsap.fromTo(m, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: "power2.out" });
    const card = m.querySelector(".modal-card");
    if (card) {
      window.gsap.fromTo(card,
        { opacity: 0, scale: 0.9, y: 20 },
        { opacity: 1, scale: 1, y: 0, duration: 0.35, ease: "back.out(1.2)" }
      );
    }
  }
}

/** Cierra la ventana flotante de reglas con animación */
export function cerrarReglas() {
  const m = ensureModal();
  if (m.hidden) return;
  const card = m.querySelector(".modal-card");

  if (window.gsap) {
    window.gsap.killTweensOf([m, card]);
    if (card) {
      window.gsap.to(card, { opacity: 0, scale: 0.92, y: 15, duration: 0.2, ease: "power2.in" });
    }
    window.gsap.to(m, {
      opacity: 0, duration: 0.2, ease: "power2.in", onComplete: () => {
        m.hidden = true;
        document.body.style.overflow = "";
      }
    });
  } else {
    m.hidden = true;
    document.body.style.overflow = "";
  }
}

/** Inicializa listeners de eventos y montaje del modal */
export function initReglas() {
  ensureModal();

  // Delegación de eventos para abrir/cerrar desde cualquier botón o backdrop
  document.addEventListener("click", e => {
    if (e.target.closest("[data-abrir-reglas]")) {
      abrirReglas();
      return;
    }
    if (e.target.closest("[data-cerrar-reglas]")) {
      cerrarReglas();
      return;
    }
    if (e.target.classList.contains("modal-overlay")) {
      cerrarReglas();
      return;
    }
  });

  // Cierre accesible mediante tecla Escape
  window.addEventListener("keydown", e => {
    if (e.key === "Escape") {
      cerrarReglas();
    }
  });
}

// Auto-inicialización cuando el DOM esté listo
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initReglas);
  } else {
    initReglas();
  }
}
