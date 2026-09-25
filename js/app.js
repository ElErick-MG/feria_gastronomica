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
  S.cupo    → límite de participantes (configurable por Admin en Firebase)
  S.parts   → snapshot de /participantes
  S.grupos  → snapshot de /grupos
  S.me      → slug del participante actual
  S.nombre  → nombre completo del participante actual
  S.view    → id de la pantalla actualmente visible
  S.stage   → etapa del participante: "grupo" | "ruleta" | "ficha"
  S.anim    → true mientras la animación de la ruleta está corriendo
  S.girando → true mientras se espera la transacción de giro
  S.shown   → id del país que ya se animó (evita reanimar al mismo país)
  S.toastFn → referencia al toast para usarse en ruleta.js sin import circular
*/
export const S = {
  cupo: 30, parts: {}, grupos: {},
  me: null, nombre: "", view: null,
  stage: "grupo", anim: false, girando: false, shown: null,
  toastFn: toast
};

/* ===== 3. NAVEGACIÓN ENTRE PANTALLAS ===== */
/**
 * show(id) — Muestra la pantalla con el id indicado.
 * Usa GSAP para una transición de entrada suave.
 * No hace nada si la pantalla ya está visible.
 */
function show(id) {
  if (S.view === id) return;
  S.view = id;
  document.querySelectorAll(".screen").forEach(s => s.hidden = s.id !== id);
  gsap.fromTo("#" + id, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: .5, ease: "power2.out" });
}

/* ===== 4. LISTENERS EN TIEMPO REAL (Firebase) ===== */
// Cada listener actualiza el estado local y dispara render() automáticamente.

onValue(ref(db, "config/cupo"),  s => { S.cupo   = s.val() ?? 30; render(); });
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

  const r = await runTransaction(ref(db, "participantes"), cur => {
    cur = cur || {};
    if (cur[key]) return cur;                          // ya registrado: no duplicar
    if (Object.keys(cur).length >= S.cupo) return;     // cupo lleno: abortar transacción

    const same = {}, tot = {};
    LETRAS.forEach(l => same[l] = tot[l] = 0);
    Object.values(cur).forEach(p => {
      tot[p.grupo]++;
      if (p.cocina === cocina) same[p.grupo]++;
    });

    // Ordenar grupos: primero los de menor concentración del mismo tipo,
    // desempate por tamaño total → grupo más equilibrado
    const g = [...LETRAS].sort((a, b) => same[a] - same[b] || tot[a] - tot[b])[0];

    cur[key] = { nombre: S.nombre, cocina, grupo: g, ts: Date.now() };
    return cur;
  });

  if (!r.committed) return toast("El cupo de participantes ya está completo");

  S.parts = r.snapshot.val();
  S.me    = key;
  S.stage = "grupo";
  render();
}

/* ===== 6. RENDER (enrutador de pantallas) ===== */
/**
 * render() — Punto único de decisión: según S.me, S.stage y el estado
 * de Firebase, muestra la pantalla correcta para el participante actual.
 */
function render() {
  if (S.view === "s-admin") return renderAdmin();

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

  const total = Object.keys(S.parts).length;
  const lleno = total >= S.cupo;

  // Letra del grupo
  $("#gLetra").textContent = me.grupo;

  // Lista de compañeros en tiempo real
  $("#miembros").innerHTML = Object.values(S.parts)
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
  const g = S.parts[S.me].grupo;

  // Miembros del equipo
  const miembros = Object.values(S.parts).filter(m => m.grupo === g);

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
        <span class="tag ficha-grupo">Grupo ${g}</span>
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

    <!-- ═══ Tu equipo ═══ -->
    <div class="ficha-seccion">
      <h2 class="ficha-seccion-titulo">👥 Tu equipo — Grupo ${g}</h2>
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
    </div>

    <!-- ═══ Platos típicos ═══ -->
    <div class="ficha-seccion">
      <h2 class="ficha-seccion-titulo">🍽️ Platos típicos</h2>
      <div class="ficha-platos">
        ${p.pl.map(x => {
          const [emoji, ...nombre] = x.split(" ");
          return `
            <div class="ficha-plato-card">
              <span class="ficha-plato-emoji">${emoji}</span>
              <span class="ficha-plato-nombre">${nombre.join(" ")}</span>
            </div>`;
        }).join("")}
      </div>
    </div>

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

/** renderAdmin() — Panel de administración */
function renderAdmin() {
  const ps = Object.values(S.parts);

  $("#admResumen").textContent = `${ps.length} / ${S.cupo} participantes registrados`;

  // Solo actualizar el input si el usuario no lo está editando
  if (document.activeElement !== $("#inCupo")) $("#inCupo").value = S.cupo;

  $("#admGrid").innerHTML = LETRAS.map(l => {
    const m = ps.filter(p => p.grupo === l);
    const g = S.grupos[l];
    return `
      <div class="card">
        <h3>Grupo ${l}</h3>
        ${m.length} personas · ${m.filter(p => p.cocina === "si").length} con experiencia<br>
        ${g ? PAISES.find(p => p.id === g.pais).n + " (giró " + esc(g.giroPor) + ")" : "Sin girar"}
      </div>`;
  }).join("");
}

/* ===== 7. EVENTOS DEL DOM ===== */

// ── Intro ──────────────────────────────────────────────────────
$("#btnStart").onclick   = () => show("s-nombre");
$("#linkAdmin").onclick  = async () => {
  const pin = prompt("PIN de administrador");
  if (!pin) return;
  const ok = await verificarAdmin(pin.trim());
  if (ok) {
    show("s-admin");
    renderAdmin();
  } else {
    toast("PIN incorrecto");
  }
};

// ── Admin ──────────────────────────────────────────────────────
$("#btnVolver").onclick  = () => { S.view = null; S.me ? render() : show("s-intro"); };
$("#btnCupo").onclick    = () => {
  const v = +$("#inCupo").value;
  if (v >= 1) set(ref(db, "config/cupo"), v).then(() => toast("Cupo actualizado"));
};
$("#btnReset").onclick   = async () => {
  if (confirm("¿Borrar participantes y sorteos?")) {
    await remove(ref(db, "participantes"));
    await remove(ref(db, "grupos"));
  }
};

// ── Flujo participante ─────────────────────────────────────────
$("#btnRuleta").onclick  = () => { S.stage = "ruleta"; render(); };
$("#btnGirar").onclick   = () => girar();
$("#btnFicha").onclick   = () => { S.stage = "ficha";  render(); };

// ── Navegación: botones de retroceso ───────────────────────────
$("#btnVolverInicio").onclick  = () => show("s-intro");
$("#btnVolverNombre").onclick  = () => show("s-nombre");
$("#btnVolverGrupo").onclick   = () => {
  if (S.anim) return;               // no salir durante la animación de la ruleta
  S.stage = "grupo"; render();
};
$("#btnVolverGrupoF").onclick  = () => { S.stage = "grupo"; render(); };

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
    render();
  } else {
    show("s-cocina");
  }
};

/* ===== 8. INICIO DE LA APLICACIÓN ===== */
buildRueda();

// Animaciones de entrada en la pantalla de bienvenida
gsap.from("#s-intro > *:not(.float)", {
  y: 40, opacity: 0, stagger: .15, duration: .8, ease: "power3.out"
});

// Emojis flotantes: animación perpetua de levitación
gsap.to(".float", {
  y: -20, repeat: -1, yoyo: true, duration: 2, stagger: .3, ease: "sine.inOut"
});

show("s-intro");
