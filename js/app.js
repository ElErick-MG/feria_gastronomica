/* ============================================================
   js/app.js — Feria Gastronómica | Conjunto Carmencita
   ============================================================
   Punto de entrada principal. Gestiona:
     · Estado global (S)
     · Listeners de Firebase en tiempo real
     · Algoritmo de balanceo y registro
     · Render por pantalla (enrutador)
     · Todos los eventos del DOM
     · Inicio de la aplicación
   ============================================================ */

import { PAISES } from "./data.js";
import { db, auth, ref, onValue, get, set, remove, runTransaction, signInAnonymously } from "./firebase.js";
import { buildRueda, animar, girar } from "./ruleta.js";
import "./reglas.js";

/* ===== 1. UTILIDADES ===== */
export const $ = s => document.querySelector(s);

const LETRAS = "ABCDEFGHIJ".split("");

/* ===== ADMIN: verificación segura contra Firebase =====
   El PIN ya NO vive en el código fuente. Se almacena en el
   nodo /admin/pin de Firebase (bloqueado por Security Rules).
   El administrador debe crear ese nodo manualmente desde
   Firebase Console antes del evento.

   Pasos para configurar:
     1. Ve a Firebase Console → Realtime Database
     2. Crea el nodo: /admin/pin = "TU_PIN_SECRETO"
     3. Las Security Rules ya bloquean escritura y lectura
        pública a /admin — solo este flujo lo lee con Auth.
   ================================================== */

async function verificarAdmin(pinIngresado) {
  try {
    // 1. Autenticación anónima (Firebase Auth)
    const { user } = await signInAnonymously(auth);
    if (!user) return false;

    // 2. Leer el PIN desde Firebase (nodo /admin/pin)
    //    Las Security Rules permiten leerlo solo si el usuario está autenticado.
    const snap = await get(ref(db, "admin/pin"));
    if (!snap.exists()) {
      toast("⚠️ PIN de admin no configurado en Firebase");
      return false;
    }

    // 3. Comparación en el cliente (el nodo está protegido por Auth en las Rules)
    return snap.val() === pinIngresado;
  } catch (err) {
    console.error("[Admin Auth]", err);
    toast("Error al verificar credenciales");
    return false;
  }
}
const esc       = s => String(s).replace(/[&<>"']/g, c => "&#" + c.charCodeAt() + ";");
const slug      = s => s.toLowerCase()
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .replace(/[^a-z0-9]+/g, "_")
                        .replace(/^_|_$/, "");

const toast = t => {
  const e = $("#toast");
  e.textContent = t;
  e.hidden = false;
  setTimeout(() => e.hidden = true, 3000);
};

/* ===== 2. ESTADO GLOBAL ===== */
/*
  S.cupo       → límite total de participantes (= numGrupos × maxPorGrupo)
  S.numGrupos  → cantidad de grupos activos (1–10)
  S.maxPorGrupo→ máx. integrantes por grupo (global)
  S.letras     → letras activas derivadas de numGrupos
  S.parts      → snapshot de /participantes
  S.grupos     → snapshot de /grupos
  S.me         → slug del participante actual
  S.nombre     → nombre completo del participante actual
  S.view       → id de la pantalla actualmente visible
  S.stage      → etapa del participante: "grupo" | "ruleta" | "ficha"
  S.anim       → true mientras la animación de la ruleta está corriendo
  S.girando    → true mientras se espera la transacción de giro
  S.shown      → id del país que ya se animó (evita reanimar al mismo país)
  S.toastFn    → referencia al toast para usarse en ruleta.js sin import circular
*/
export const S = {
  cupo: 30, numGrupos: 10, maxPorGrupo: 3,
  get letras() { return "ABCDEFGHIJ".slice(0, this.numGrupos).split(""); },
  parts: {}, grupos: {},
  me: null, nombre: "", view: null,
  stage: "grupo", anim: false, girando: false, shown: null,
  fromAdmin: false,
  fromCatalogo: false,
  partFiltro: "todos",
  toastFn: toast
};

/* ===== 3. NAVEGACIÓN ENTRE PANTALLAS E HISTORIAL DEL NAVEGADOR ===== */

let ultimoIntentoSalida = 0;

/**
 * show(id) — Muestra la pantalla en el DOM con animación GSAP.
 * No hace nada si la pantalla ya está visible.
 */
function show(id) {
  if (S.view === id) return;
  S.view = id;
  document.querySelectorAll(".screen").forEach(s => {
    if (s.id !== id) {
      s.hidden = true;
      // Limpiar transforms residuales de pantallas ocultas
      gsap.set(s, { clearProps: "transform,opacity" });
    }
  });
  const el = document.getElementById(id);
  el.hidden = false;
  gsap.fromTo(el, { opacity: 0, y: 24 }, {
    opacity: 1, y: 0, duration: .4, ease: "power2.out",
    onComplete() {
      // Eliminar el transform inline residual (translateY(0px))
      // que GSAP deja al terminar la animación. Sin esto, el
      // transform crea un nuevo stacking context / compositing
      // layer que invalida el hit-test de los botones hijos en
      // Chrome, Firefox y Edge en producción.
      gsap.set(el, { clearProps: "transform" });
    }
  });
}

/**
 * aplicarVista(screenId, extra) — Sincroniza el estado lógico y renderiza
 * la sección correspondiente sin alterar la pila de historial.
 */
function aplicarVista(screenId, extra = {}) {
  // Sincronizar flag de administrador
  if (extra.fromAdmin !== undefined) {
    S.fromAdmin = !!extra.fromAdmin;
  } else if (screenId !== "s-ficha") {
    S.fromAdmin = false;
  }

  // Sincronizar flag de catálogo de países de participante
  if (extra.fromCatalogo !== undefined) {
    S.fromCatalogo = !!extra.fromCatalogo;
  } else if (screenId !== "s-ficha") {
    S.fromCatalogo = false;
  }

  if (screenId === "s-intro") {
    show("s-intro");
  } else if (screenId === "s-nombre") {
    show("s-nombre");
    if (S.nombre && $("#inNombre")) $("#inNombre").value = S.nombre;
  } else if (screenId === "s-cocina") {
    show("s-cocina");
  } else if (screenId === "s-grupo") {
    S.stage = "grupo";
    const me = S.parts[S.me];
    if (me) {
      renderGrupo(me);
    } else {
      show("s-grupo");
    }
  } else if (screenId === "s-ruleta") {
    S.stage = "ruleta";
    const me = S.parts[S.me];
    if (me) {
      renderRuleta(me, S.grupos[me.grupo]);
    } else {
      show("s-ruleta");
    }
  } else if (screenId === "s-paises") {
    renderPaisesParticipante();
  } else if (screenId === "s-ficha") {
    if (extra.fromAdmin && extra.pais) {
      renderFicha({ pais: extra.pais, fromAdmin: true });
    } else if (extra.fromCatalogo && extra.pais) {
      renderFicha({ pais: extra.pais, fromCatalogo: true });
    } else {
      S.stage = "ficha";
      const me = S.parts[S.me];
      const res = me ? S.grupos[me.grupo] : (extra.pais ? { pais: extra.pais } : null);
      if (res) {
        renderFicha(res);
      } else {
        show("s-ficha");
      }
    }
  } else if (screenId === "s-admin") {
    if (extra.adminTab) S.adminTab = extra.adminTab;
    show("s-admin");
    renderAdmin();
  }
}

/**
 * navegar(screenId, extra, replace) — Registra la sección en el historial
 * del navegador (window.history) y renderiza la pantalla correspondiente.
 */
function navegar(screenId, extra = {}, replace = false) {
  const state = { screen: screenId, ...extra };
  if (replace) {
    history.replaceState(state, "", window.location.pathname);
  } else {
    history.pushState(state, "", window.location.pathname);
  }
  aplicarVista(screenId, extra);
}

/**
 * retroceder(fallbackScreen, fallbackExtra) — Retrocede en el historial
 * del navegador o utiliza el fallback si no hay estados previos.
 */
function retroceder(fallbackScreen = "s-intro", fallbackExtra = {}) {
  if (window.history.state && !window.history.state.root) {
    window.history.back();
  } else {
    navegar(fallbackScreen, fallbackExtra, true);
  }
}

/**
 * Listener de popstate — Controla el botón Atrás del navegador y
 * gestos táctiles nativos en móviles (swipe-to-back de Android/iOS).
 */
window.addEventListener("popstate", e => {
  // Guard: No interrumpir la ruleta mientras gira
  if (S.anim) {
    history.pushState({ screen: "s-ruleta", stage: "ruleta" }, "", window.location.pathname);
    toast("⏳ Espera a que termine el giro de la ruleta...");
    return;
  }

  const state = e.state;

  // Prevención de salida accidental en la vista inicial
  if (!state || state.root || state.screen === "s-intro") {
    const ahora = Date.now();
    if (ahora - ultimoIntentoSalida < 2500) {
      // Segundo intento dentro del tiempo límite: permitir salida
      return;
    }
    ultimoIntentoSalida = ahora;
    // Retener el estado inicial en el historial
    history.pushState({ screen: "s-intro", step: 1 }, "", window.location.pathname);
    aplicarVista("s-intro");
    toast("👋 Presiona atrás otra vez para salir");
    return;
  }

  // Restaurar la sección correspondiente al estado del historial
  aplicarVista(state.screen, state);
});

/* ===== 4. LISTENERS EN TIEMPO REAL (Firebase) ===== */
// Cada listener actualiza el estado local y dispara render() automáticamente.

onValue(ref(db, "config/numGrupos"),   s => {
  S.numGrupos   = s.val() ?? 10;
  S.cupo        = S.numGrupos * S.maxPorGrupo;
  render();
});
onValue(ref(db, "config/maxPorGrupo"), s => {
  S.maxPorGrupo = s.val() ?? 3;
  S.cupo        = S.numGrupos * S.maxPorGrupo;
  render();
});
onValue(ref(db, "participantes"), s => { S.parts  = s.val() || {}; render(); });
onValue(ref(db, "grupos"),        s => { S.grupos = s.val() || {}; render(); });

/* ===== 5. ALGORITMO DE BALANCEO Y REGISTRO ===== */
/**
 * registrar(cocina) — Inscribe al participante actual en el grupo más adecuado.
 *
 * Usa runTransaction para operación atómica que:
 *  1. Verifica si el participante ya existe (idempotente)
 *  2. Verifica si hay cupo disponible
 *  3. Calcula el grupo con menos participantes del mismo perfil (si/no)
 *     desempatando por tamaño total del grupo
 */
async function registrar(cocina) {
  const key = slug(S.nombre);

  try {
    const r = await runTransaction(ref(db, "participantes"), cur => {
      cur = cur || {};
      if (cur[key]) return cur;                              // ya registrado: no duplicar

      const letrasActivas = S.letras;
      const cupoTotal     = S.numGrupos * S.maxPorGrupo;
      
      // Solo contar participantes en grupos activos contra el cupo total
      const activos = Object.values(cur).filter(p => letrasActivas.includes(p.grupo));
      if (activos.length >= cupoTotal) return;     // cupo lleno en grupos activos: abortar

      const same = {}, tot = {};
      letrasActivas.forEach(l => same[l] = tot[l] = 0);
      Object.values(cur).forEach(p => {
        if (!letrasActivas.includes(p.grupo)) return;        // ignorar grupos eliminados
        tot[p.grupo]++;
        if (p.cocina === cocina) same[p.grupo]++;
      });

      // Solo considerar grupos con espacio disponible
      const disponibles = letrasActivas.filter(l => tot[l] < S.maxPorGrupo);
      if (!disponibles.length) return;                       // todos llenos: abortar

      // Ordenar: menor concentración del mismo tipo, desempate por tamaño total
      const g = disponibles.sort((a, b) => same[a] - same[b] || tot[a] - tot[b])[0];

      cur[key] = { nombre: S.nombre, cocina, grupo: g, ts: Date.now() };
      return cur;
    });

    if (!r.committed) return toast("El cupo de participantes ya está completo");

    S.parts = r.snapshot.val();
    S.me    = key;
    S.stage = "grupo";
    navegar("s-grupo", { stage: "grupo" }, true);
  } catch (err) {
    console.error("[Registro]", err);
    toast("Error al registrar. Intenta de nuevo.");
  }
}

/** Reasigna automáticamente a un participante si su grupo fue desactivado por el admin */
async function reubicarParticipanteIndividual(key) {
  if (!key) return;
  await runTransaction(ref(db, "participantes"), cur => {
    if (!cur || !cur[key]) return cur;
    const letrasActivas = S.letras;
    if (letrasActivas.includes(cur[key].grupo)) return cur;

    const same = {}, tot = {};
    letrasActivas.forEach(l => same[l] = tot[l] = 0);
    Object.values(cur).forEach(p => {
      if (!letrasActivas.includes(p.grupo)) return;
      tot[p.grupo]++;
      if (p.cocina === cur[key].cocina) same[p.grupo] = (same[p.grupo] || 0) + 1;
    });

    const disponibles = letrasActivas.filter(l => tot[l] < S.maxPorGrupo);
    if (!disponibles.length) return cur;

    const g = disponibles.sort((a, b) => (same[a] || 0) - (same[b] || 0) || tot[a] - tot[b])[0];
    cur[key].grupo = g;
    return cur;
  });
}

/** Reubica a todos los participantes en grupos inactivos hacia los grupos activos con espacio */
async function reubicarTodosLosInactivos() {
  const r = await runTransaction(ref(db, "participantes"), cur => {
    if (!cur) return cur;
    const letrasActivas = S.letras;

    const same = {}, tot = {};
    letrasActivas.forEach(l => same[l] = tot[l] = 0);
    Object.values(cur).forEach(p => {
      if (!letrasActivas.includes(p.grupo)) return;
      tot[p.grupo]++;
      if (p.cocina === "si") same[p.grupo] = (same[p.grupo] || 0) + 1;
    });

    Object.entries(cur).forEach(([key, p]) => {
      if (letrasActivas.includes(p.grupo)) return;

      const disponibles = letrasActivas.filter(l => tot[l] < S.maxPorGrupo);
      if (!disponibles.length) return;

      const g = disponibles.sort((a, b) => {
        const sameA = p.cocina === "si" ? (same[a] || 0) : (tot[a] - (same[a] || 0));
        const sameB = p.cocina === "si" ? (same[b] || 0) : (tot[b] - (same[b] || 0));
        return sameA - sameB || tot[a] - tot[b];
      })[0];

      cur[key].grupo = g;
      tot[g]++;
      if (p.cocina === "si") same[g] = (same[g] || 0) + 1;
    });

    return cur;
  });

  if (r.committed) {
    toast("✅ Participantes reubicados en grupos activos");
  } else {
    toast("⚠️ No se pudo reubicar (verifica el cupo)");
  }
}

/** Elimina del nodo participantes a los integrantes que quedaron en grupos desactivados */
async function eliminarParticipantesInactivos() {
  const psInactivos = Object.entries(S.parts).filter(([_, p]) => !S.letras.includes(p.grupo));
  if (!psInactivos.length) return;

  if (!confirm(`¿Eliminar a los ${psInactivos.length} participantes de los grupos desactivados?`)) return;

  try {
    for (const [key] of psInactivos) {
      await remove(ref(db, `participantes/${key}`));
    }
    toast("🗑️ Participantes inactivos eliminados");
  } catch (err) {
    console.error(err);
    toast("Error al eliminar participantes");
  }
}

/* ===== 6. RENDER (enrutador de pantallas) ===== */
/**
 * render() — Punto único de decisión: según S.me, S.stage y el estado
 * de Firebase, muestra la pantalla correcta para el participante actual.
 */
function render() {
  if (S.view === "s-admin") return renderAdmin();
  if (S.view === "s-paises") return renderPaisesParticipante();
  if (S.view === "s-ficha" && (S.fromCatalogo || S.fromAdmin)) return;

  const me = S.parts[S.me];

  // Si el admin reinició el evento y el participante actual ya no existe
  if (!me) {
    if (S.me) { S.me = null; show("s-intro"); }
    return;
  }

  const res = S.grupos[me.grupo];

  if      (S.stage === "grupo")   renderGrupo(me);
  else if (S.stage === "ruleta")  renderRuleta(me, res);
  else                             renderFicha(res);
}

/* ───────────────────────────────────────────────────────────── */

/** renderGrupo(me) — Paso 4 y 5: grupo asignado + sala de espera */
function renderGrupo(me) {
  show("s-grupo");

  // Si el grupo del participante fue desactivado (el admin redujo los grupos activos)
  if (!S.letras.includes(me.grupo)) {
    reubicarParticipanteIndividual(S.me);
    return;
  }

  // Contar únicamente participantes en grupos activos
  const psActivos = Object.values(S.parts).filter(p => S.letras.includes(p.grupo));
  const total = psActivos.length;
  const lleno = total >= S.cupo;

  // Letra del grupo
  $("#gLetra").textContent = me.grupo;

  // Lista de compañeros en tiempo real
  $("#miembros").innerHTML = psActivos
    .filter(p => p.grupo === me.grupo)
    .map(p =>
      `<li>${esc(p.nombre)}<span class="tag">${p.cocina === "si" ? "👨‍🍳 Con experiencia" : "🌱 Novato"}</span></li>`
    ).join("");

  // Barra de progreso animada
  gsap.to("#barra", { width: Math.min(100, total / S.cupo * 100) + "%", duration: .6 });
  $("#progTxt").textContent = `${total} / ${S.cupo} participantes registrados`;

  // Botón de ruleta: bloqueado hasta completar el cupo
  const b = $("#btnRuleta");
  b.disabled    = !lleno;
  b.textContent = lleno ? "¡Ir a la ruleta!" : "Esperando a los demás…";
}

/** renderRuleta(me, res) — Paso 6: ruleta interactiva */
function renderRuleta(me, res) {
  show("s-ruleta");

  // Si un compañero ya giró y el resultado no se ha animado en este dispositivo
  if (res && res.pais && S.shown !== res.pais && !S.anim) {
    animar(res, me);
  } else if (!res) {
    // Nadie ha girado aún: habilitar botón si no hay giro en curso
    $("#btnGirar").disabled = S.girando;
  }
}

/** renderFicha(res) — Paso 7: ficha gastronómica del país (versión mejorada) */
function renderFicha(res) {
  show("s-ficha");

  const p = PAISES.find(x => x.id === res.pais);
  const esAdmin = !!(res && res.fromAdmin);
  const esCatalogo = !!(res && res.fromCatalogo);

  // Determinar grupo y miembros
  let g = null;
  let miembros = [];

  if (esAdmin || esCatalogo) {
    const asignado = Object.entries(S.grupos || {}).find(([letra, d]) => d && d.pais === p.id);
    if (asignado) {
      g = asignado[0];
      miembros = Object.values(S.parts || {}).filter(m => m.grupo === g);
    }
  } else if (S.me && S.parts && S.parts[S.me]) {
    g = S.parts[S.me].grupo;
    miembros = Object.values(S.parts || {}).filter(m => m.grupo === g);
  }

  // Configurar botón de retroceso según origen
  const btnBack = $("#btnVolverGrupoF");
  if (btnBack) {
    if (esAdmin) {
      btnBack.textContent = "← Volver al panel de administración";
      btnBack.onclick = () => retroceder("s-admin");
    } else if (esCatalogo) {
      btnBack.textContent = "← Volver a las fichas de países";
      btnBack.onclick = () => retroceder("s-paises");
    } else {
      btnBack.textContent = "← Volver al grupo";
      btnBack.onclick = () => retroceder("s-grupo");
    }
  }

  // Links externos generados dinámicamente
  const enlaces = [
    { icon: "📖", label: "Gastronomía en Wikipedia",      url: `https://es.wikipedia.org/wiki/${p.wiki}` },
    { icon: "🎬", label: "Recetas en YouTube",             url: `https://www.youtube.com/results?search_query=recetas+de+${encodeURIComponent(p.n)}+faciles` },
    { icon: "🔍", label: "Explorar en Google",             url: `https://www.google.com/search?q=gastronomía+tradicional+de+${encodeURIComponent(p.n)}` },
    { icon: "🍴", label: "Recetas en Cookpad",             url: `https://cookpad.com/buscar/${encodeURIComponent('recetas ' + p.n)}` }
  ];

  $("#ficha").innerHTML = `
    <!-- ═══ Hero: imagen + bandera + nombre ═══ -->
    <div class="ficha-hero">
      <img class="ficha-hero-img" src="${p.img}" alt="Gastronomía de ${p.n}" loading="lazy">
      <div class="ficha-hero-overlay">
        <img class="ficha-bandera" src="https://flagcdn.com/w160/${p.iso}.png" alt="Bandera de ${p.n}">
        <h1 class="ficha-titulo">${p.n}</h1>
        <p class="ficha-oficial">${p.of}</p>
        ${g
          ? `<span class="tag ficha-grupo">Grupo ${g}</span>`
          : `<span class="tag ficha-grupo" style="background:rgba(242,165,65,.18);border:1px solid rgba(242,165,65,.35)">🌍 Catálogo general</span>`
        }
      </div>
    </div>

    <!-- ═══ Datos rápidos ═══ -->
    <div class="ficha-datos">
      <div class="ficha-dato">
        <span class="ficha-dato-icon">🏛️</span>
        <div><small>Capital</small><strong>${p.cap}</strong></div>
      </div>
      <div class="ficha-dato">
        <span class="ficha-dato-icon">🌍</span>
        <div><small>Continente</small><strong>${p.con}</strong></div>
      </div>
      <div class="ficha-dato">
        <span class="ficha-dato-icon">🗣️</span>
        <div><small>Idioma</small><strong>${p.lang}</strong></div>
      </div>
      <div class="ficha-dato">
        <span class="ficha-dato-icon">💰</span>
        <div><small>Moneda</small><strong>${p.mon}</strong></div>
      </div>
      <div class="ficha-dato">
        <span class="ficha-dato-icon">👥</span>
        <div><small>Población</small><strong>${p.p}</strong></div>
      </div>
    </div>

    <!-- ═══ Equipo / Asignación ═══ -->
    <div class="ficha-seccion">
      ${g ? `
        <h2 class="ficha-seccion-titulo">${
          esAdmin
            ? `👥 Grupo asignado — Grupo ${g}`
            : (g === (S.parts[S.me]?.grupo) ? `👥 Tu equipo — Grupo ${g}` : `👥 Grupo asignado — Grupo ${g}`)
        }</h2>
        <p class="ficha-equipo-sub">${miembros.length} integrantes cocinando ${p.n}</p>
        <div class="ficha-equipo">
          ${miembros.map(m => {
            const esYo = slug(m.nombre) === S.me;
            return `
              <div class="ficha-miembro${esYo ? ' ficha-miembro-yo' : ''}">
                <span class="ficha-miembro-avatar">${m.nombre.charAt(0).toUpperCase()}</span>
                <div class="ficha-miembro-info">
                  <strong>${esc(m.nombre)}${esYo ? ' (Tú)' : ''}</strong>
                  <span class="tag">${m.cocina === "si" ? "👨‍🍳 Con experiencia" : "🌱 Novato"}</span>
                </div>
              </div>`;
          }).join("")}
        </div>
      ` : `
        <h2 class="ficha-seccion-titulo">👥 Estado de asignación</h2>
        <p class="ficha-equipo-sub">Este país aún no ha sido asignado a ningún grupo en el sorteo de la ruleta.</p>
        <div style="background:rgba(255,255,255,.04);border-radius:12px;padding:.9rem 1.2rem;display:flex;align-items:center;gap:.7rem">
          <span style="font-size:1.6rem">🎲</span>
          <div>
            <strong style="color:var(--a);display:block;font-size:.9rem">Disponible para ser seleccionado</strong>
            <small style="color:var(--mut);font-size:.78rem">Aparecerá en el sorteo de ruleta para los próximos grupos participantes.</small>
          </div>
        </div>
      `}
    </div>

    <!-- ═══ Platos típicos ═══ -->
    <div class="ficha-seccion">
      <h2 class="ficha-seccion-titulo">🍽️ Platos típicos</h2>
      <div class="ficha-platos">
        ${(p.platos || p.pl.map(x => {
          const [emoji, ...nombre] = x.split(" ");
          return { emoji, nombre: nombre.join(" "), desc: "", img: "" };
        })).map(plato => `
          <div class="ficha-plato-card">
            ${plato.img ? `
              <div class="ficha-plato-img-wrap">
                <img class="ficha-plato-img" src="${plato.img}" alt="${esc(plato.nombre)}" loading="lazy" onerror="this.parentElement.style.display='none'">
                <span class="ficha-plato-badge">${plato.emoji || '🍽️'}</span>
              </div>
            ` : `<span class="ficha-plato-emoji">${plato.emoji || '🍽️'}</span>`}
            <div class="ficha-plato-body">
              <h3 class="ficha-plato-nombre">${esc(plato.nombre)}</h3>
              ${plato.desc ? `<p class="ficha-plato-desc">${esc(plato.desc)}</p>` : ''}
            </div>
          </div>
        `).join("")}
      </div>
    </div>

    <!-- ═══ Zonas de mayor relevancia ═══ -->
    ${p.zonas && p.zonas.length ? `
      <div class="ficha-seccion">
        <h2 class="ficha-seccion-titulo">📍 Zonas y regiones de mayor relevancia</h2>
        <div class="ficha-zonas">
          ${p.zonas.map(z => `
            <div class="ficha-zona-card">
              <div class="ficha-zona-img-wrap">
                <img class="ficha-zona-img" src="${z.img}" alt="${esc(z.nombre)}" loading="lazy" onerror="this.parentElement.style.display='none'">
                <span class="ficha-zona-tag">${esc(z.tipo)}</span>
              </div>
              <div class="ficha-zona-body">
                <h3 class="ficha-zona-nombre">${esc(z.nombre)}</h3>
                <p class="ficha-zona-desc">${esc(z.desc)}</p>
              </div>
            </div>
          `).join("")}
        </div>
      </div>
    ` : ''}

    <!-- ═══ Ingredientes estrella ═══ -->
    <div class="ficha-seccion">
      <h2 class="ficha-seccion-titulo">🧂 Ingredientes estrella</h2>
      <div class="ficha-ingredientes">
        ${p.ing.map(i => `<span class="ficha-pill">${i}</span>`).join("")}
      </div>
    </div>

    <!-- ═══ Historia gastronómica ═══ -->
    <div class="ficha-seccion ficha-card-decorada">
      <div class="ficha-card-icono">📜</div>
      <h2 class="ficha-seccion-titulo">Historia de su gastronomía</h2>
      <p>${p.h}</p>
    </div>

    <!-- ═══ Qué los caracteriza ═══ -->
    <div class="ficha-seccion ficha-card-decorada">
      <div class="ficha-card-icono">✨</div>
      <h2 class="ficha-seccion-titulo">Qué los caracteriza</h2>
      <p>${p.k}</p>
    </div>

    <!-- ═══ Tip para la feria ═══ -->
    <div class="ficha-tip">
      <div class="ficha-tip-header">
        <span class="ficha-tip-icon">👨‍🍳</span>
        <h2>Tip para la feria</h2>
      </div>
      <p>${p.tip}</p>
    </div>

    <!-- ═══ Dato curioso ═══ -->
    <div class="ficha-curiosidad">
      <span class="ficha-curiosidad-icon">💡</span>
      <div>
        <strong>¿Sabías que…?</strong>
        <p>${p.d}</p>
      </div>
    </div>

    <!-- ═══ Explora más ═══ -->
    <div class="ficha-seccion">
      <h2 class="ficha-seccion-titulo">🔗 Investiga más sobre ${p.n}</h2>
      <div class="ficha-links">
        ${enlaces.map(l => `
          <a class="ficha-link" href="${l.url}" target="_blank" rel="noopener noreferrer">
            <span class="ficha-link-icon">${l.icon}</span>
            <span class="ficha-link-label">${l.label}</span>
            <span class="ficha-link-arrow">↗</span>
          </a>`).join("")}
      </div>
    </div>

    <!-- ═══ Call to action ═══ -->
    <div class="ficha-cta">
      <p>🎉 ¡Investiguen, elijan su plato y a cocinar para la feria!</p>
    </div>`;

  gsap.from("#ficha > *", { y: 30, opacity: 0, stagger: .1, duration: .6 });
  confetti({ particleCount: 80, spread: 70, origin: { y: .2 } });
}

/**
 * crearPaisCardHTML(p, opts) — Componente de tarjeta de país reutilizable.
 * Garantiza consistencia visual y de datos entre el panel Admin y la vista de Participantes.
 */
function crearPaisCardHTML(p, { isParticipant = false, miGrupo = null } = {}) {
  const asignado = Object.entries(S.grupos || {}).find(([letra, d]) => d && d.pais === p.id);
  const letraGrupo = asignado ? asignado[0] : null;
  const cantMiembros = letraGrupo ? Object.values(S.parts || {}).filter(m => m.grupo === letraGrupo).length : 0;

  let statusClass = "status-libre";
  let statusHTML = "<span>⚪ Disponible en ruleta</span>";

  if (isParticipant) {
    if (letraGrupo && letraGrupo === miGrupo) {
      statusClass = "status-propio";
      statusHTML = `<span>⭐ ¡Asignado a tu <strong>Grupo ${letraGrupo}</strong>!</span>`;
    } else if (letraGrupo) {
      statusClass = "status-asignado";
      statusHTML = `<span>🔒 Asignado a <strong>Grupo ${letraGrupo}</strong></span>`;
    } else {
      statusClass = "status-libre";
      statusHTML = `<span>🎲 Disponible para tu grupo</span>`;
    }
  } else {
    if (letraGrupo) {
      statusClass = "status-asignado";
      statusHTML = `<span>🟢 Asignado a <strong>Grupo ${letraGrupo}</strong> (${cantMiembros} miembros)</span>`;
    } else {
      statusClass = "status-libre";
      statusHTML = `<span>⚪ Disponible en ruleta</span>`;
    }
  }

  return `
    <div class="adm-pais-card" data-ver-pais="${p.id}" style="cursor:pointer">
      <div class="adm-pais-img-wrap">
        <img class="adm-pais-img" src="${p.img}" alt="${esc(p.n)}" loading="lazy" onerror="this.style.opacity='0.4'">
        <img class="adm-pais-flag-float" src="https://flagcdn.com/w80/${p.iso}.png" alt="Bandera de ${p.n}">
        <span class="adm-pais-con-pill">${esc(p.con)}</span>
      </div>
      <div class="adm-pais-body">
        <div class="adm-pais-title-row">
          <h3 class="adm-pais-name">${esc(p.n)}</h3>
          <span class="adm-pais-cap">🏛️ ${esc(p.cap)}</span>
        </div>
        <p class="adm-pais-oficial">${esc(p.of)}</p>

        <div class="adm-pais-status-pill ${statusClass}">
          ${statusHTML}
        </div>

        <div class="adm-pais-platos-mini">
          ${(p.platos || []).map(plato => `
            <span class="adm-plato-mini-tag">${plato.emoji || '🍽️'} ${esc(plato.nombre)}</span>
          `).join("")}
        </div>

        <button type="button" class="adm-btn-ver-pais" data-ver-pais="${p.id}">
          📖 Ver ficha completa
        </button>
      </div>
    </div>`;
}

/** renderPaisesParticipante() — Catálogo de países interactivo para los participantes */
function renderPaisesParticipante() {
  show("s-paises");

  S.partFiltro = S.partFiltro || "todos";

  // Actualizar botones de filtro para participantes
  document.querySelectorAll("#paisesFiltrosPart .adm-filtro-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filtroPart === S.partFiltro);
  });

  const me = S.parts[S.me];
  const miGrupo = me ? me.grupo : null;

  const filtrados = PAISES.filter(p => {
    if (S.partFiltro === "todos") return true;
    return p.con.toLowerCase().includes(S.partFiltro.toLowerCase());
  });

  const grid = $("#paisesGrid");
  if (grid) {
    grid.innerHTML = filtrados.map(p => crearPaisCardHTML(p, { isParticipant: true, miGrupo })).join("");
  }
}

/** renderAdmin() — Panel de administración con pestañas de grupos y catálogo de países */
function renderAdmin() {
  const psActivos   = Object.values(S.parts).filter(p => S.letras.includes(p.grupo));
  const psInactivos = Object.values(S.parts).filter(p => !S.letras.includes(p.grupo));
  const total       = psActivos.length;
  const cupoTotal   = S.numGrupos * S.maxPorGrupo;

  // Estado de pestañas y filtros por defecto
  S.adminTab    = S.adminTab || "grupos";
  S.adminFiltro = S.adminFiltro || "todos";

  // Resumen superior
  $(".adm-resumen").textContent = psInactivos.length
    ? `${total} / ${cupoTotal} participantes en grupos activos (${psInactivos.length} en grupos desactivados)`
    : `${total} / ${cupoTotal} participantes registrados`;

  // Actualizar clases activas en botones de pestañas y visibilidad de paneles
  document.querySelectorAll(".adm-nav-tab").forEach(tab => {
    tab.classList.toggle("active", tab.dataset.admTab === S.adminTab);
  });
  const secGrupos = $("#secAdmGrupos");
  const secPaises = $("#secAdmPaises");
  if (secGrupos) secGrupos.hidden = S.adminTab !== "grupos";
  if (secPaises) secPaises.hidden = S.adminTab !== "paises";

  // ── Pestaña 1: Grupos y Configuración ──
  if (S.adminTab === "grupos") {
    $("#admNumGrupos").textContent   = S.numGrupos;
    $("#admMaxPorGrupo").textContent = S.maxPorGrupo;
    $("#admCupoCalc").textContent    =
      `Cupo total calculado: ${S.numGrupos} grupos × ${S.maxPorGrupo} integrantes = ${cupoTotal} personas`;

    // Aviso si existen participantes en grupos desactivados
    const inactivosNotice = $("#admInactivosNotice");
    if (inactivosNotice) {
      inactivosNotice.innerHTML = psInactivos.length ? `
        <div class="adm-inactivos-box">
          <div class="adm-inactivos-header">
            <span style="font-size:1.3rem">⚠️</span>
            <div>
              <strong>${psInactivos.length} participante(s) en grupos desactivados</strong>
              <small style="display:block;color:var(--mut);margin-top:.2rem">Al tener ${S.numGrupos} grupos activos (A–${S.letras[S.letras.length - 1]}), estos participantes no están en ningún grupo activo: ${psInactivos.map(p => `<strong>${esc(p.nombre)}</strong> [Grupo ${p.grupo}]`).join(", ")}</small>
            </div>
          </div>
          <div class="row" style="margin-top:.5rem;justify-content:flex-start;gap:.5rem">
            <button id="btnReubicarInactivos" class="adm-btn-reubicar">🔄 Reubicar en grupos activos</button>
            <button id="btnEliminarInactivos" class="adm-btn-eliminar-huerfanos">🗑️ Eliminar huérfanos</button>
          </div>
        </div>
      ` : "";
    }

    // Grid de grupos con diseño enriquecido
    $("#admGrid").innerHTML = S.letras.map(l => {
      const miembros  = psActivos.filter(p => p.grupo === l);
      const expertos  = miembros.filter(p => p.cocina === "si").length;
      const novatos   = miembros.length - expertos;
      const sorteo    = S.grupos[l];
      const lleno     = miembros.length >= S.maxPorGrupo;
      const pais      = sorteo ? PAISES.find(p => p.id === sorteo.pais) : null;

      return `
        <div class="adm-card">
          <div class="adm-card-header">
            <span class="adm-card-letra">${l}</span>
            <span class="adm-card-badge ${lleno ? 'adm-badge-full' : 'adm-badge-open'}">
              ${lleno ? 'Completo' : `${miembros.length}/${S.maxPorGrupo}`}
            </span>
          </div>
          <div class="adm-card-stats">
            <span>👨‍🍳 ${expertos} exp.</span>
            <span>🌱 ${novatos} nov.</span>
          </div>
          <ul class="adm-card-lista">
            ${miembros.length
              ? miembros.map(m =>
                  `<li><span class="adm-miembro-dot">●</span>${esc(m.nombre)}</li>`
                ).join("")
              : '<li class="adm-card-vacio">Sin integrantes</li>'
            }
          </ul>
          <div class="adm-card-footer">
            ${pais
              ? `<img src="https://flagcdn.com/w40/${pais.iso}.png" class="adm-pais-flag" alt="">
                 <span class="adm-pais-nombre">${pais.n}</span>
                 <button class="adm-btn-card-ficha" data-ver-pais="${pais.id}" title="Ver ficha de ${pais.n}">Ficha ↗</button>`
              : '<span class="adm-sin-sorteo">⏳ Sin sorteo</span>'
            }
          </div>
        </div>`;
    }).join("");
  }

  // ── Pestaña 2: Catálogo de Fichas de Países ──
  if (S.adminTab === "paises") {
    // Actualizar botones de filtro
    document.querySelectorAll(".adm-filtro-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.filtro === S.adminFiltro);
    });

    const filtrados = PAISES.filter(p => {
      if (S.adminFiltro === "todos") return true;
      return p.con.toLowerCase().includes(S.adminFiltro.toLowerCase());
    });

    $("#admPaisesGrid").innerHTML = filtrados.map(p => crearPaisCardHTML(p, { isParticipant: false })).join("");
  }
}

/* ===== 7. EVENTOS DEL DOM ===== */

// ── Intro ──────────────────────────────────────────────────────
$("#btnStart").onclick   = () => navegar("s-nombre");
$("#linkAdmin").onclick  = async () => {
  const pin = prompt("PIN de administrador");
  if (!pin) return;
  const ok = await verificarAdmin(pin.trim());
  if (ok) {
    navegar("s-admin", { adminTab: "grupos" });
  } else {
    toast("PIN incorrecto");
  }
};

// ── Admin ──────────────────────────────────────────────────────
$("#btnVolver").onclick  = () => retroceder("s-intro");

// Event delegation para navegación y acciones del Admin (pestañas, filtros, ver ficha, steppers, reubicar/eliminar)
document.addEventListener("click", e => {
  // Reubicar participantes huérfanos en grupos activos
  if (e.target.closest("#btnReubicarInactivos")) {
    reubicarTodosLosInactivos();
    return;
  }

  // Eliminar participantes huérfanos de grupos inactivos
  if (e.target.closest("#btnEliminarInactivos")) {
    eliminarParticipantesInactivos();
    return;
  }

  // Pestañas del Admin (Grupos vs Catálogo de Fichas)
  const tabBtn = e.target.closest(".adm-nav-tab");
  if (tabBtn) {
    const nuevoTab = tabBtn.dataset.admTab;
    if (nuevoTab !== S.adminTab) {
      navegar("s-admin", { adminTab: nuevoTab });
    }
    return;
  }

  // Filtros de continentes (Participantes)
  const filtroPartBtn = e.target.closest("[data-filtro-part]");
  if (filtroPartBtn) {
    S.partFiltro = filtroPartBtn.dataset.filtroPart;
    renderPaisesParticipante();
    return;
  }

  // Filtros de continentes (Admin)
  const filtroBtn = e.target.closest("[data-filtro]");
  if (filtroBtn) {
    S.adminFiltro = filtroBtn.dataset.filtro;
    renderAdmin();
    return;
  }

  // Ver ficha gastronómica de un país (desde catálogo admin, catálogo participante o tarjeta de grupo)
  const verPaisBtn = e.target.closest("[data-ver-pais]");
  if (verPaisBtn) {
    const paisId = verPaisBtn.dataset.verPais;
    if (S.view === "s-admin") {
      navegar("s-ficha", { fromAdmin: true, pais: paisId });
    } else {
      navegar("s-ficha", { fromCatalogo: true, pais: paisId });
    }
    return;
  }

  // Abrir catálogo de fichas de países desde la sala de espera
  if (e.target.closest("#btnVerPaisesGrupo, .btn-paises-box, [data-ver-catalogo-paises]")) {
    e.preventDefault();
    navegar("s-paises");
    return;
  }

  // Volver desde catálogo de países al grupo
  if (e.target.closest("#btnVolverGrupoP")) {
    e.preventDefault();
    retroceder("s-grupo", { stage: "grupo" });
    return;
  }

  // Volver desde ficha gastronómica
  if (e.target.closest("#btnVolverGrupoF")) {
    e.preventDefault();
    if (S.fromAdmin) {
      retroceder("s-admin");
    } else if (S.fromCatalogo) {
      retroceder("s-paises");
    } else {
      retroceder("s-grupo");
    }
    return;
  }

  // Steppers de configuración
  const btn = e.target.closest(".adm-stepper");
  if (!btn) return;

  if (btn.id === "btnGruposMenos" || btn.id === "btnGruposMas") {
    const delta = btn.id === "btnGruposMas" ? +1 : -1;
    const nuevo = Math.min(10, Math.max(1, S.numGrupos + delta));
    if (nuevo === S.numGrupos) return;
    set(ref(db, "config/numGrupos"), nuevo)
      .then(() => toast(`Grupos activos: ${nuevo} (A–${"ABCDEFGHIJ"[nuevo - 1]})`))
      .catch(() => toast("⚠️ Sin permiso — despliega las reglas de Firebase"));
  }

  if (btn.id === "btnMaxMenos" || btn.id === "btnMaxMas") {
    const delta = btn.id === "btnMaxMas" ? +1 : -1;
    const nuevo = Math.max(1, S.maxPorGrupo + delta);
    if (nuevo === S.maxPorGrupo) return;
    set(ref(db, "config/maxPorGrupo"), nuevo)
      .then(() => toast(`Máx. por grupo: ${nuevo} integrantes`))
      .catch(() => toast("⚠️ Sin permiso — despliega las reglas de Firebase"));
  }
});

$("#btnReset").onclick = async () => {
  if (confirm("¿Borrar participantes y sorteos?")) {
    await remove(ref(db, "participantes"));
    await remove(ref(db, "grupos"));
  }
};

// ── Flujo participante ─────────────────────────────────────────
$("#btnRuleta").onclick  = () => navegar("s-ruleta", { stage: "ruleta" });
$("#btnGirar").onclick   = () => girar();
$("#btnFicha").onclick   = () => {
  const me = S.parts[S.me];
  const res = me ? S.grupos[me.grupo] : null;
  navegar("s-ficha", { stage: "ficha", pais: res?.pais });
};

// ── Navegación: botones de retroceso ───────────────────────────
// NOTA: btnVerPaisesGrupo, btnVolverGrupoP y btnVolverGrupoF se manejan
// exclusivamente por event delegation (más arriba) para evitar doble
// navegación y fallos de hit-test con GSAP en producción.
$("#btnVolverInicio").onclick  = () => retroceder("s-intro");
$("#btnVolverNombre").onclick  = () => retroceder("s-nombre");
$("#btnVolverGrupo").onclick   = () => {
  if (S.anim) return; // no salir durante la animación de la ruleta
  retroceder("s-grupo", { stage: "grupo" });
};

// Selección de experiencia en cocina (Sí / No)
// Delegación de eventos: resuelve fallo de tap en Chrome/Edge Android
// donde GSAP transforms en la transición de pantalla causan hit-test
// inválido al asignar onclick directamente a los botones.
document.addEventListener("click", e => {
  const b = e.target.closest("[data-r]");
  if (!b || b.disabled) return;

  // Guard: evitar doble tap mientras se procesa el registro
  const btns = document.querySelectorAll("[data-r]");
  btns.forEach(x => { x.disabled = true; x.style.pointerEvents = "none"; });

  registrar(b.dataset.r).finally(() => {
    btns.forEach(x => { x.disabled = false; x.style.pointerEvents = ""; });
  });
});

// Identificación: recupera estado si el nombre ya existe en Firebase
$("#fNombre").onsubmit = async e => {
  e.preventDefault();
  const n = $("#inNombre").value.trim().replace(/\s+/g, " ");
  if (n.length < 3) return toast("Escribe tu nombre completo");

  S.nombre = n;
  const key  = slug(n);
  const snap = await get(ref(db, "participantes/" + key));

  if (snap.exists()) {
    // Participante ya registrado → retomar desde donde lo dejó
    S.parts[key] = snap.val();
    S.me         = key;
    S.stage      = "grupo";
    navegar("s-grupo", { stage: "grupo" });
  } else {
    navegar("s-cocina");
  }
};

/* ===== 8. INICIO DE LA APLICACIÓN ===== */
buildRueda();

// Autenticación anónima al inicio: necesaria para que las escrituras
// en Firebase (registro, giro de ruleta) funcionen para TODOS los
// usuarios, no solo los que pasaron por el flujo de administrador.
// Sin esto, las Security Rules (auth != null) bloquean las transacciones
// silenciosamente y los botones parecen no responder en navegadores
// que no tienen una sesión de auth cacheada de pruebas anteriores.
signInAnonymously(auth).catch(err => console.warn("[Auth Init]", err));

// Inicialización de la pila de historial con retención contra salida accidental
if (!history.state || !history.state.root) {
  history.replaceState({ screen: "s-intro", root: true }, "", window.location.pathname);
  history.pushState({ screen: "s-intro", step: 1 }, "", window.location.pathname);
}

// Animaciones de entrada en la pantalla de bienvenida
gsap.from("#s-intro > *:not(.float):not(.btn-top-reglas)", {
  y: 40, opacity: 0, stagger: .15, duration: .8, ease: "power3.out"
});
gsap.from("#s-intro .btn-top-reglas", {
  opacity: 0, duration: .6, delay: .4, ease: "power2.out"
});

// Emojis flotantes: animación perpetua de levitación
gsap.to(".float", {
  y: -20, repeat: -1, yoyo: true, duration: 2, stagger: .3, ease: "sine.inOut"
});

aplicarVista(history.state?.screen || "s-intro", history.state || {});
