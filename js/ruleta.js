/* ============================================================
   js/ruleta.js — Construcción, animación y giro de la ruleta
   ============================================================ */

import { PAISES } from "./data.js";
import { db, ref, runTransaction } from "./firebase.js";
import { S, $ } from "./app.js";

// ─── Helper: convierte código ISO en emoji de bandera ──────────
const flag = iso =>
  String.fromCodePoint(...[...iso.toUpperCase()].map(c => 127397 + c.charCodeAt()));

// ─── Helper: toast de notificación (importado desde app.js) ────
// Se usa via import circular; se reexporta en app.js correctamente.

/* ------------------------------------------------------------
   buildRueda()
   Genera el SVG de la ruleta con sus sectores coloreados y
   las etiquetas de país + bandera rotadas hacia el centro.
   ------------------------------------------------------------ */
export function buildRueda() {
  const A  = 360 / PAISES.length;
  const pt = (a, r) => [
    200 + r * Math.cos((a * Math.PI) / 180),
    200 + r * Math.sin((a * Math.PI) / 180)
  ];

  $("#rueda").innerHTML =
    PAISES.map((p, i) => {
      const a0 = i * A - 90;
      const [x0, y0] = pt(a0,     190);
      const [x1, y1] = pt(a0 + A, 190);
      return `
        <path
          d="M200 200L${x0} ${y0}A190 190 0 0 1 ${x1} ${y1}Z"
          fill="hsl(${i * A} 62% 42%)"
          stroke="#f6ead6"
          stroke-width="2"
        />
        <g transform="rotate(${a0 + A / 2} 200 200)">
          <text
            x="370" y="200"
            text-anchor="end"
            dominant-baseline="middle"
            fill="#fff"
            font-size="17"
            font-weight="600"
          >${p.n} ${flag(p.iso)}</text>
        </g>`;
    }).join("") +
    `<circle cx="200" cy="200" r="22" fill="#1b0f0a" stroke="#f2a541" stroke-width="4"/>`;
}

/* ------------------------------------------------------------
   animar(res, me)
   Animación GSAP del giro de la ruleta:
   - Gira 6 vueltas completas + la rotación exacta del sector ganador
   - Al terminar: confetti + mensaje personalizado según si el
     participante fue quien giró o si lo hizo un compañero
   ------------------------------------------------------------ */
export function animar(res, me, onDone) {
  S.anim = true;
  $("#btnGirar").disabled = true;
  $("#msgRuleta").textContent = "Girando…";

  const i    = PAISES.findIndex(p => p.id === res.pais);
  const pais = PAISES[i];
  const A    = 360 / PAISES.length;

  gsap.fromTo(
    "#rueda",
    { rotation: 0 },
    {
      rotation: 360 * 6 - (i * A + A / 2) + (Math.random() * A * 0.6 - A * 0.3),
      duration: 6,
      ease: "power3.inOut",
      onComplete() {
        S.anim  = false;
        S.shown = res.pais;

        confetti({ particleCount: 180, spread: 90, origin: { y: .6 } });

        const esc = s => String(s).replace(/[&<>"']/g, c => "&#" + c.charCodeAt() + ";");
        $("#msgRuleta").innerHTML =
          res.giroPor === me.nombre
            ? `🎉 ¡Giraste la ruleta! El país de tu grupo es: <b>${pais.n}</b>`
            : `El usuario <b>${esc(res.giroPor)}</b> ya giró la ruleta y su país correspondiente es: <b>${pais.n}</b>`;

        $("#btnFicha").hidden = false;
        gsap.from("#msgRuleta", { scale: .8, opacity: 0 });

        if (onDone) onDone();
      }
    }
  );
}

/* ------------------------------------------------------------
   girar()
   Transacción atómica en Firebase:
   - Garantiza un único resultado por grupo
   - Excluye países ya asignados a otros grupos
   ------------------------------------------------------------ */
export async function girar() {
  const me = S.parts[S.me];
  S.girando = true;
  $("#btnGirar").disabled = true;

  try {
    await runTransaction(ref(db, "grupos"), cur => {
      cur = cur || {};
      if (cur[me.grupo]?.pais) return cur; // ya girado: no modificar

      const usados = Object.values(cur).map(x => x.pais);
      let libres   = PAISES.filter(p => !usados.includes(p.id));
      if (!libres.length) libres = PAISES; // fallback: reusar si todos asignados

      cur[me.grupo] = {
        pais:    libres[Math.random() * libres.length | 0].id,
        giroPor: me.nombre,
        ts:      Date.now()
      };
      return cur;
    });
  } catch (e) {
    // toast se llama desde app.js para evitar dependencia circular
    console.error("Error al girar:", e);
    if (typeof S.toastFn === "function") S.toastFn("No se pudo girar, intenta de nuevo");
  }

  S.girando = false;
}
