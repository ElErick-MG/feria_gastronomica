/* ============================================================
   js/firebase.js — Configuración e inicialización de Firebase
   ============================================================

   ┌─ NOTA DE SEGURIDAD ─────────────────────────────────────────┐
   │ La configuración de Firebase para apps WEB es PÚBLICA por   │
   │ diseño de Google. No contiene secretos; es el equivalente   │
   │ de un ID de proyecto. La seguridad real proviene de:        │
   │                                                             │
   │  ✅ Firebase Security Rules (firebase.rules.json)           │
   │  ✅ Restricciones de dominio en la API Key                  │
   │     → Firebase Console → Proyecto → Configuración →        │
   │       Aplicaciones → Restricciones de clave de API          │
   │  ✅ Firebase App Check (opcional, para producción avanzada) │
   │                                                             │
   │ Referencia oficial:                                         │
   │ https://firebase.google.com/docs/projects/api-keys          │
   └─────────────────────────────────────────────────────────────┘

   ⚠️  Reemplaza los valores de firebaseConfig con los de tu
       proyecto en https://console.firebase.google.com/
   ============================================================ */

import { initializeApp }                              from "https://www.gstatic.com/firebasejs/12.19.0/firebase-app.js";
import { getDatabase, ref, onValue, get, set, remove, runTransaction }
                                                      from "https://www.gstatic.com/firebasejs/12.19.0/firebase-database.js";
import { getAuth, signInAnonymously, onAuthStateChanged }
                                                      from "https://www.gstatic.com/firebasejs/12.19.0/firebase-auth.js";

// ─── Credenciales del proyecto Firebase ───────────────────────
// Estas van en js/firebase.js (no en .env para apps estáticas sin bundler).
// Protege la API Key restringiendo dominios en Firebase Console.
const firebaseConfig = {
  apiKey:            "AIzaSyAR0QWL_0WkS4SPSg59DgNo-mKA4xDqYI4",
  authDomain:        "feriagastronomica-4d1e6.firebaseapp.com",
  databaseURL:       "https://feriagastronomica-4d1e6-default-rtdb.firebaseio.com",
  projectId:         "feriagastronomica-4d1e6",
  storageBucket:     "feriagastronomica-4d1e6.firebasestorage.app",
  messagingSenderId: "571902333559",
  appId:             "1:571902333559:web:cf562663461af9e767ec72",
  measurementId:     "G-T9T66Q91WZ"  // Analytics no se usa en la app, pero no hace daño
};

// ─── Inicialización ────────────────────────────────────────────
const app  = initializeApp(firebaseConfig);
const db   = getDatabase(app);
const auth = getAuth(app);

// ─── Exportaciones ─────────────────────────────────────────────
export { db, auth, ref, onValue, get, set, remove, runTransaction, signInAnonymously, onAuthStateChanged };
