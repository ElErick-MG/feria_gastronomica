# 📖 Contexto General del Proyecto — Feria Gastronómica

> **Documento maestro de arquitectura, lógica de negocio y directrices técnicas.**
> Diseñado para desarrolladores y **Agentes IA** que colaboren en el mantenimiento, extensión o refactorización del proyecto.

---

## 1. 📌 Resumen Ejecutivo y Propósito

* **Nombre del Proyecto:** Feria Gastronómica (Conjunto Carmencita).
* **Objetivo:** Aplicación web interactiva, responsiva y en tiempo real para coordinar la dinámica de integración comunitaria donde los participantes se registran, son asignados equitativamente a grupos gastronómicos, esperan la apertura del evento, realizan un sorteo animado de países mediante una ruleta sincronizada y reciben la ficha cultural y culinaria del país que deben cocinar.
* **Modelo de Despliegue:** **Firebase Hosting** (Frontend 100% estático, sin servidor intermediario ni build step).
* **Backend y Persistencia:** **Firebase Realtime Database** + **Firebase Anonymous Authentication**.

---

## 2. 🛠️ Stack Tecnológico y Decisiones de Arquitectura

| Capa / Herramienta | Tecnología | Justificación y Rol en el Proyecto |
|---|---|---|
| **Estructura** | HTML5 Semántico | Pantallas estructuradas como secciones (`.screen`) con soporte de accesibilidad. |
| **Estilos** | CSS3 Vanilla (`styles.css`) | Variables CSS personalizadas, paleta gastronómica en tema oscuro, layout Flexbox y CSS Grid. **No usa frameworks externos como Tailwind o Bootstrap**. |
| **Lógica Frontend** | JavaScript Nativo (ES Modules) | Código modular (`import`/`export`) cargado nativamente por los navegadores modernos (`<script type="module">`). Sin bundlers (Webpack/Vite/Parcel). |
| **Animaciones** | GSAP 3 (CDN) | Física de giro de la ruleta con inercia (`power3.inOut`), transiciones de entrada entre pantallas y levitación continua de elementos flotantes. |
| **Efectos Visuales** | Canvas-Confetti (CDN) | Efecto de celebración al revelarse el país ganador. |
| **Base de Datos** | Firebase Realtime Database (SDK 12.19.0) | Sincronización en vivo entre múltiples navegadores y dispositivos sin necesidad de WebSockets propios. |
| **Seguridad / Auth** | Firebase Anonymous Auth | Identificación anónima para permitir escrituras controladas y validar el PIN de administración contra el nodo seguro `/admin/pin`. |
| **Hosting** | Firebase Hosting | Distribución global en CDN, SSL automático y soporte de fallback con `404.html`. |

---

## 3. 📂 Arquitectura de Archivos y Responsabilidades

```
feria_gastronomica/
├── index.html              # Estructura de las 7 pantallas, inputs y modales.
├── styles.css              # Variables de diseño, componentes UI y animaciones CSS.
├── 404.html                # Página estática de fallback para Firebase Hosting.
├── firebase.json           # Configuración de Hosting (sitio: "feriagastronomica", public: ".").
├── .firebaserc             # Proyecto predeterminado ("feriagastronomica-4d1e6").
├── firebase.rules.json     # Reglas de seguridad y validaciones para Realtime Database.
├── .env.example            # Plantilla referencial de variables.
├── .gitignore              # Ignora .firebase/, logs, editores (.vscode/) y secretos.
├── docs/
│   └── contextoProyecto.md # (Este archivo) Documentación maestra de contexto para Agentes IA.
├── js/
│   ├── firebase.js         # Inicialización del SDK, Firebase Auth anónimo y exports de DB.
│   ├── data.js             # Catálogo inmutable de los 10 países con recetas y datos culturales.
│   ├── ruleta.js           # Renderizado SVG dinámico de la ruleta, animación GSAP y transacción de giro.
│   └── app.js              # Enrutador, estado global 'S', listeners en vivo, balanceo y eventos DOM.
└── README.md               # Documentación pública para GitHub y guía de replicación.
```

### Detalle de Módulos JavaScript (`js/`):
1. **[js/firebase.js](file:///d:/levantamientoProyectos/feria_gastronomica/js/firebase.js):**
   * Configura las credenciales públicas de Firebase Web.
   * Exporta instancias de `db`, `auth` y los métodos necesarios (`ref`, `onValue`, `get`, `set`, `remove`, `runTransaction`, `signInAnonymously`).
2. **[js/data.js](file:///d:/levantamientoProyectos/feria_gastronomica/js/data.js):**
   * Arreglo inmutable `PAISES` con 10 elementos.
   * Cada objeto contiene: `id`, `iso` (para banderas en `flagcdn.com`), `n` (nombre), `of` (nombre oficial), `pl` (platos típicos con emoji), `h` (historia gastronómica), `k` (características), `p` (población) y `d` (dato curioso).
3. **[js/ruleta.js](file:///d:/levantamientoProyectos/feria_gastronomica/js/ruleta.js):**
   * `buildRueda()`: Dibuja un `<svg>` con sectores angulares (`360 / PAISES.length`), cálculo trigonométrico (`Math.cos`, `Math.sin`), etiquetas de texto orientadas y banderas.
   * `animar(res, me, onDone)`: Ejecuta animación GSAP de 6 vueltas completas + sector específico con inercia, dispara confeti y muestra mensaje contextual.
   * `girar()`: Transacción atómica en Firebase (`grupos`) que garantiza que un solo miembro fije el país de su grupo, excluyendo países ya tomados.
4. **[js/app.js](file:///d:/levantamientoProyectos/feria_gastronomica/js/app.js):**
   * Mantiene el estado reactivo `S`.
   * Registra listeners en tiempo real (`onValue`) para `config/cupo`, `participantes` y `grupos`.
   * Ejecuta el **algoritmo de balanceo** de equipos al registrar un participante.
   * Controla la navegación entre vistas mediante la función `show(id)` y el enrutador `render()`.
   * Administra la autenticación anónima y verificación segura del PIN de administrador.

---

## 4. 🔄 Flujo de Usuario y Máquina de Estados

La aplicación funciona como una SPA (Single Page Application) controlada por la función `show(id)` en `js/app.js`:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              PANTALLAS                                 │
│                                                                        │
│  [s-intro]  ──(Comenzar)──>  [s-nombre]  ──(Ingresar)──>  [s-cocina]   │
│     │                           │                            │         │
│     │ (Admin PIN)               │ (Si ya existe)             │ (Sí/No) │
│     ▼                           ▼                            ▼         │
│  [s-admin]                   [s-grupo] <─────────────────────┘         │
│                                 │                                      │
│                                 │ (Cupo lleno)                         │
│                                 ▼                                      │
│                             [s-ruleta] ──(Girar/Resultado)──> [s-ficha]│
└────────────────────────────────────────────────────────────────────────┘
```

### Pantallas (`.screen` en HTML):
1. **`s-intro` (Bienvenida):** Portada visual con emojis animados flotantes y accesos a "Empezar" o al panel de administrador.
2. **`s-nombre` (Identificación):** Formulario para ingresar nombre completo. Si el participante ya existe en la base de datos (según slug normalizado), se recupera su sesión y se redirige de inmediato a `s-grupo`.
3. **`s-cocina` (Habilidad Culinaria):** Pregunta binaria: ¿Tienes experiencia cocinando? (`Sí` o `No`).
4. **`s-grupo` (Sala de Espera y Asignación):**
   * Muestra la letra del grupo asignado (A a J).
   * Lista en vivo de los compañeros de equipo con tags de experiencia.
   * Barra de progreso animada indicando `inscritos / cupo`.
   * Botón de ruleta deshabilitado hasta que se complete el cupo configurado.
5. **`s-ruleta` (Sorteo Sincronizado):** Ruleta SVG interactiva. Cualquier miembro del grupo puede girar; el resultado se sincroniza en Firebase y dispara la animación simultáneamente en los dispositivos de todos los integrantes.
6. **`s-ficha` (Resultado Gastronómico):** Muestra bandera del país, platos recomendados, historia, datos culturales y curiosidades para orientar el trabajo culinario del equipo.
7. **`s-admin` (Panel de Administración):** Solo accesible mediante PIN. Permite monitorear grupos, modificar el cupo del evento en vivo y reiniciar la base de datos.

---

## 5. 🧠 Algoritmos Clave del Negocio

### A. Algoritmo de Balanceo Equitativo de Grupos
* **Ubicación:** Función `registrar(cocina)` en `js/app.js`.
* **Problema que resuelve:** Evitar que un grupo quede compuesto solo por expertos en cocina o solo por principiantes, o que los grupos tengan cantidades de miembros desproporcionadas.
* **Mecanismo:**
  1. Utiliza `runTransaction` sobre `/participantes` para garantizar atomicidad y evitar colisiones si varios usuarios se inscriben al mismo milisegundo.
  2. Inicializa contadores para los 10 grupos (`A` a `J`):
     * `tot[grupo]`: número total de miembros.
     * `same[grupo]`: número de miembros con el mismo perfil culinario (`cocina === "si"` o `"no"`).
  3. Ordena los grupos con el criterio:
     ```javascript
     const g = [...LETRAS].sort((a, b) => same[a] - same[b] || tot[a] - tot[b])[0];
     ```
  4. Asigna al participante al grupo con menor concentración de su mismo perfil, desempatando por el grupo más vacío.

### B. Algoritmo de Asignación Exclusiva de Países (Ruleta)
* **Ubicación:** Función `girar()` en `js/ruleta.js`.
* **Problema que resuelve:** Dos grupos distintos no deben tener el mismo país, y solo debe registrarse un giro por grupo.
* **Mecanismo:**
  1. Ejecuta `runTransaction` sobre `/grupos`.
  2. Si `cur[miGrupo]?.pais` ya tiene valor, no hace nada (idempotencia grupal).
  3. Filtra la lista de países disponibles excluyendo los que ya están en uso por otros grupos:
     ```javascript
     const usados = Object.values(cur).map(x => x.pais);
     let libres = PAISES.filter(p => !usados.includes(p.id));
     if (!libres.length) libres = PAISES; // Fallback de seguridad
     ```
  4. Selecciona un país al azar entre los `libres` y guarda `{ pais, giroPor: me.nombre, ts: Date.now() }`.

---

## 6. 🗄️ Modelo de Datos y Seguridad (Firebase Realtime Database)

### Estructura del Árbol JSON:
```json
{
  "config": {
    "cupo": 30
  },
  "participantes": {
    "juan_perez": {
      "nombre": "Juan Pérez",
      "cocina": "si",
      "grupo": "A",
      "ts": 1727142000000
    }
  },
  "grupos": {
    "A": {
      "pais": "mx",
      "giroPor": "Juan Pérez",
      "ts": 1727142500000
    }
  },
  "admin": {
    "pin": "1234"
  }
}
```

### Reglas de Seguridad ([firebase.rules.json](file:///d:/levantamientoProyectos/feria_gastronomica/firebase.rules.json)):
1. **Raíz bloqueada:** `.read: false`, `.write: false`.
2. **`config/cupo`:** Lectura pública (`.read: true`), escritura restringida a usuarios con Firebase Auth (`auth != null`).
3. **`participantes`:** Lectura pública (para ver el progreso de la sala de espera). Escritura requiere `auth != null`. Validación estricta que exige nombre entre 3 y 100 caracteres, cocina `"si"` o `"no"`, grupo de texto y timestamp numérico.
4. **`grupos`:** Lectura pública (para sincronizar la ruleta entre todos). Escritura requiere `auth != null` y estructura válida.
5. **`admin/pin`:** **Lectura restringida exclusivamente a usuarios autenticados** (`auth != null`). Escritura bloqueada (`.write: false`) para evitar manipulación remota desde el cliente.

---

## 7. 🚀 Operaciones y DevOps (Firebase Hosting)

* **Publicación de cambios:**
  Al no tener compilador ni build step, para enviar cambios a producción se ejecuta:
  ```bash
  firebase deploy --only hosting
  ```
* **Publicación de reglas de base de datos:**
  ```bash
  firebase deploy --only database
  ```
* **Flujo con Git:**
  1. Pruebas locales (abrir en navegador o Live Server).
  2. Despliegue a Firebase: `firebase deploy --only hosting`.
  3. Commit y push a GitHub:
     ```bash
     git add .
     git commit -m "feat/fix: descripción"
     git push origin main
     ```

---

## 8. 🤖 Directrices Estrictas para Agentes IA (Guía de Mantenimiento)

Cuando un agente IA trabaje en este repositorio, **DEBE CUMPLIR** las siguientes reglas:

1. **NO introducir Bundlers ni Node Build Tools:** No convertir el proyecto a Webpack, Vite, React o Next.js a menos que el usuario lo solicite explícitamente. Debe mantenerse en Vanilla JS (ES Modules nativos) accesible para cualquier navegador.
2. **NO Hardcodear el PIN de Admin en el Código Fuente:** El PIN vive en `/admin/pin` de Firebase y se valida mediante `verificarAdmin()` con `signInAnonymously()`. No reintroducir variables como `const ADMIN_PIN = "..."` en JavaScript.
3. **Respetar la Atomicidad en Firebase:** Cualquier operación que involucre cupo, asignación de grupos o giros de ruleta DEBE usar `runTransaction`. Modificar estos valores con `set()` simple introduciría condiciones de carrera críticas.
4. **Mantener la Modularidad de `js/`:** No reincorporar scripts masivos en `index.html`. Cada responsabilidad debe permanecer en su módulo correspondiente (`firebase.js`, `data.js`, `ruleta.js`, `app.js`).
5. **Estilos y Diseño:** No añadir clases de utilidades ni instalar TailwindCSS a menos que el usuario lo pida. Todas las clases visuales deben ubicarse en `styles.css` respetando el sistema de diseño oscuro y cálido.
6. **Seguridad en `.gitignore`:** Asegurar siempre que archivos temporales de Firebase (`.firebase/`), logs de depuración (`firebase-debug.log`), llaves de servicio (`serviceAccountKey.json`) y entornos `.env` permanezcan ignorados.
