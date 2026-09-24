<div align="center">

# 🍽️ Conjunto Carmencita — Feria Gastronómica

### _Registra tu equipo · Gira la ruleta · Descubre qué país cocinarán juntos_

[![Firebase](https://img.shields.io/badge/Firebase-Realtime_DB-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Firebase Auth](https://img.shields.io/badge/Firebase-Auth_Anónimo-FF6F00?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/docs/auth/web/anonymous-auth)
[![Firebase Hosting](https://img.shields.io/badge/Deploy-Firebase_Hosting-0288D1?style=for-the-badge&logo=firebase&logoColor=white)](https://firebase.google.com/docs/hosting)
[![GSAP](https://img.shields.io/badge/GSAP-Animations-88CE02?style=for-the-badge&logo=greensock&logoColor=black)](https://gsap.com/)
[![Vanilla JS](https://img.shields.io/badge/JavaScript-Vanilla_ES_Modules-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Semántico-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-Moderno-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![Security](https://img.shields.io/badge/Security-Firebase_Rules-4CAF50?style=for-the-badge&logo=shield&logoColor=white)](#-seguridad)

</div>

---

## ✨ ¿Qué es esto?

Aplicación web interactiva y multidispositivo para gestionar **eventos gastronómicos grupales**. Permite registrar participantes, balancear equipos automáticamente, gestionar una sala de espera en tiempo real y realizar un **sorteo de países mediante una ruleta animada**, todo sincronizado en Firebase para que múltiples personas interactúen simultáneamente desde cualquier dispositivo.

> 🎯 Diseñada para el evento del **Conjunto Carmencita**, donde cada grupo descubrirá un país del mundo y preparará su gastronomía para la feria.

---

## 🚀 Flujo del Usuario

```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│  1. 🏠 Bienvenida     →  Pantalla inmersiva con micro-animaciones │
│  2. 👤 Identificación →  Ingresa tu nombre (reconexión automática)│
│  3. 🍳 Habilidades    →  ¿Tienes experiencia en cocina? Sí / No  │
│  4. 👥 Asignación     →  Algoritmo balanceado → Grupo A–J        │
│  5. ⏳ Sala de Espera →  Barra en tiempo real · X/30 inscritos   │
│  6. 🎡 Ruleta         →  Giro grupal · Animación GSAP · Confetti │
│  7. 🌍 Ficha País     →  Historia, platos típicos, cultura, datos │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🌍 Países del Sorteo

| 🏳️ | País | Platos representativos |
|---|---|---|
| 🇲🇽 | México | Tacos al pastor, Tamales, Mole poblano |
| 🇮🇹 | Italia | Pizza napoletana, Pasta carbonara, Tiramisú |
| 🇵🇪 | Perú | Ceviche, Lomo saltado, Ají de gallina |
| 🇯🇵 | Japón | Sushi, Ramen, Takoyaki |
| 🇮🇳 | India | Biryani, Tikka masala, Samosas |
| 🇪🇸 | España | Paella, Tortilla española, Gazpacho |
| 🇫🇷 | Francia | Croissant, Ratatouille, Crepas |
| 🇨🇴 | Colombia | Bandeja paisa, Arepas, Ajiaco |
| 🇬🇷 | Grecia | Moussaka, Souvlaki, Ensalada griega |
| 🇲🇦 | Marruecos | Tajín de cordero, Cuscús, Pastela |

---

## 🛠️ Tech Stack

| Tecnología | Uso |
|---|---|
| **HTML5 semántico** | Estructura de pantallas y componentes |
| **CSS3** (Flexbox + Grid + variables) | Diseño responsivo, tema oscuro gastronómico |
| **JavaScript Vanilla (ES Modules)** | Lógica de negocio, estado y renderizado |
| **Firebase Realtime Database** | Sincronización en tiempo real entre dispositivos |
| **Firebase Auth (Anonymous)** | Autenticación anónima para proteger el panel admin |
| **GSAP 3** | Animaciones de transición, ruleta (física de giro) |
| **Canvas-Confetti** | Efecto de celebración al revelar el país |

---

## 📁 Estructura del Proyecto

```
feria_gastronomica/
├── index.html              # Estructura HTML semántica principal
├── styles.css              # Estilos globales y diseño responsivo
├── firebase.json           # Configuración de Firebase Hosting
├── .firebaserc             # Alias del proyecto activo de Firebase
├── firebase.rules.json     # Reglas de seguridad de Firebase Realtime DB
├── 404.html                # Página de error fallback para Hosting
├── .env.example            # Plantilla de variables de entorno (referencia)
├── .gitignore              # Excluye caches (.firebase/), logs y archivos sensibles
├── js/
│   ├── firebase.js         # Configuración Firebase, Auth Anónimo y exports DB
│   ├── data.js             # Catálogo de países con info gastronómica/cultural
│   ├── ruleta.js           # Construcción SVG, animación GSAP y giro grupal
│   └── app.js              # Estado global, listeners en tiempo real y UI
└── README.md
```

---

## ⚙️ Configuración de Firebase

### 1. Credenciales en `js/firebase.js`

Reemplaza los valores con los de tu proyecto en [Firebase Console](https://console.firebase.google.com/):

```js
const firebaseConfig = {
  apiKey:      "TU_API_KEY",
  authDomain:  "TU_PROYECTO.firebaseapp.com",
  databaseURL: "https://TU_PROYECTO-default-rtdb.firebaseio.com",
  projectId:   "TU_PROYECTO",
  appId:       "TU_APP_ID"
};
```

> 💡 La configuración de Firebase Web es **pública por diseño de Google** — es un ID de proyecto, no un secreto.
> La seguridad real proviene de las Firebase Security Rules y Firebase Auth.
> [Ver documentación oficial](https://firebase.google.com/docs/projects/api-keys)

### 2. Estructura de nodos en Firebase

```
/
├── config/
│   └── cupo              # Límite de participantes (default: 30) — solo admin puede editar
├── participantes/
│   └── {slug_nombre}     # { nombre, cocina, grupo, ts }
├── grupos/
│   └── {A–J}             # { pais, giroPor, ts }
└── admin/
    └── pin               # PIN del administrador — solo legible con Firebase Auth ✅
```

---

## 🔐 Seguridad

### Modelo de seguridad implementado

| Capa | Mecanismo | Estado |
|---|---|---|
| **Admin PIN** | Almacenado en Firebase, nunca en el código fuente | ✅ |
| **Autenticación** | Firebase Anonymous Auth — requerida para escribir en DB y leer el PIN | ✅ |
| **Firebase Rules** | Validación estricta de estructura en cada nodo | ✅ |
| **Nodo `/admin`** | Solo legible con Auth activo, escritura completamente bloqueada | ✅ |
| **Git** | `.gitignore` excluye `.env` y archivos con credenciales | ✅ |
| **API Key** | Restricción por dominio recomendada (opcional, post-deploy) | ⚙️ Opcional |

### Pasos de configuración de seguridad (obligatorios)

**Paso 1 — Activar Firebase Anonymous Auth**
```
Firebase Console → Authentication → Sign-in method → Anonymous → Activar
```

**Paso 2 — Publicar las Security Rules**
```
Firebase Console → Realtime Database → Rules
→ Pegar el contenido de firebase.rules.json → Publicar
```

**Paso 3 — Crear el nodo del PIN de administrador**
```
Firebase Console → Realtime Database
→ (+) Agregar nodo: admin/pin = "TU_PIN_SECRETO"
```
> El PIN puede ser cualquier texto. Solo se almacena en Firebase, nunca en el código fuente.

**Paso 4 — Restringir la API Key por dominio (recomendado en producción)**
```
Google Cloud Console → APIs & Services → Credentials
→ Tu API Key → Restricciones de aplicaciones → Referentes HTTP (sitios web)
→ Agregar:
    https://tu-proyecto.web.app/*
    https://tu-proyecto.firebaseapp.com/*
    https://localhost:* (para pruebas locales)
```
> Firebase Hosting te asigna automáticamente los dominios `.web.app` y `.firebaseapp.com` sin costo alguno.

---

## 🔐 Roles

| Rol | Acceso | Funciones |
|---|---|---|
| **Participante** | Nombre completo | Registro, sala de espera, ruleta, ficha del país |
| **Administrador** | PIN verificado en Firebase | Ver progreso de grupos, editar cupo, reiniciar evento |

---

## 🧠 Algoritmo de Balanceo

El sistema distribuye participantes en **10 grupos (A–J)** de forma equitativa mediante una **transacción atómica en Firebase** que:

1. Cuenta cuántos participantes con experiencia (`Sí`) y sin experiencia (`No`) hay en cada grupo
2. Asigna al grupo con **menos personas del mismo perfil**, desempatando por tamaño total
3. Garantiza que ningún grupo concentre solo expertos o solo novatos
4. Es resistente a condiciones de carrera (múltiples registros simultáneos)

---

## 🎡 Lógica de la Ruleta

- **Cualquier integrante** del grupo puede girar la ruleta para todo el equipo
- La transacción Firebase garantiza **un único resultado por grupo**
- Los países ya asignados a otros grupos **quedan excluidos** del sorteo
- Todos los dispositivos conectados ven la animación en tiempo real (Firebase listeners)

---

## 🚀 Despliegue en Firebase Hosting

El proyecto está configurado para desplegarse de forma directa y gratuita en **Firebase Hosting**.

### Requisitos previos
Tener instalado Firebase CLI en tu sistema:
```bash
npm install -g firebase-tools
firebase login
```

### Despliegue inicial o completo
```bash
# Desplegar hosting y reglas de base de datos
firebase deploy
```

---

## 🔄 ¿Cómo subir cambios a la web (Deploy)?

Al ser una aplicación con despliegue manual desde la terminal, **no se actualiza sola al guardar localmente**. Cada vez que realices cambios en el diseño o la lógica:

```bash
# 1. Probar localmente en tu navegador (Live Server o abriendo index.html)

# 2. Desplegar los cambios a Firebase Hosting (tarda ~10 seg)
firebase deploy --only hosting

# 3. Guardar el historial en tu repositorio de GitHub
git add .
git commit -m "Descripción de los cambios realizados"
git push origin main
```

> 💡 **Nota:** Tras hacer deploy, abre el enlace en tu navegador y presiona `Ctrl + F5` (o `Cmd + Shift + R` en Mac) para forzar la recarga ignorando la caché.

---

## 📋 Guía de Duplicación del Proyecto (Desde Cero)

Si deseas duplicar este proyecto para otro evento o entorno, sigue estos pasos:

### 1. Clonar el repositorio
```bash
git clone https://github.com/TU_USUARIO/feria_gastronomica.git
cd feria_gastronomica
```

### 2. Crear proyecto en Firebase
1. Ve a [Firebase Console](https://console.firebase.google.com/) y haz clic en **"Crear un proyecto"**.
2. En el menú lateral, ve a **Build / Compilación**:
   - **Authentication** → Activa el proveedor de inicio de sesión **Anónimo**.
   - **Realtime Database** → Crea una base de datos en la región más cercana (ej. `us-central1`).
   - **Hosting** → Haz clic en "Comenzar" para inicializar el servicio de Hosting.

### 3. Configurar tus credenciales
Edita el archivo `js/firebase.js` con las credenciales de tu nuevo proyecto web de Firebase:
```javascript
const firebaseConfig = {
  apiKey: "TU_API_KEY",
  authDomain: "TU_PROYECTO.firebaseapp.com",
  databaseURL: "https://TU_PROYECTO-default-rtdb.firebaseio.com",
  projectId: "TU_PROYECTO",
  storageBucket: "TU_PROYECTO.firebasestorage.app",
  messagingSenderId: "TU_SENDER_ID",
  appId: "TU_APP_ID"
};
```

### 4. Configurar reglas de seguridad y PIN Admin en Firebase
1. En la consola de Firebase → **Realtime Database** → pestaña **Reglas**:
   - Pega el contenido de `firebase.rules.json` y presiona **Publicar**.
2. En la pestaña **Datos**:
   - Agrega el nodo del PIN: `admin/pin = "tu_pin_deseado"`.

### 5. Vincular y Desplegar
```bash
# Asociar tu proyecto de Firebase
firebase use --add

# Desplegar a la web
firebase deploy
```

---

## 🌐 Alternativa: Despliegue en Vercel

Si prefieres alojar el frontend en Vercel:
1. Conecta tu repositorio en [vercel.com](https://vercel.com).
2. Como es un proyecto 100% estático (HTML/CSS/JS nativo), Vercel lo detecta y publica automáticamente sin configuración adicional.

---

## 📱 Compatibilidad

- ✅ Móviles, tablets y escritorio (diseño responsivo)
- ✅ Modo de movimiento reducido (`prefers-reduced-motion`)
- ✅ Accesibilidad básica (focus visible, aria-labels, alt en imágenes)
- ✅ Múltiples dispositivos simultáneos vía Firebase Real-time listeners
- ✅ Reconexión automática: si ya te registraste, retomas donde lo dejaste

---

<div align="center">

**Hecho con 🍴 para el Conjunto Carmencita**

_¡Que empiece la feria!_ 🎉

</div>
