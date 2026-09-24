# Prompt Reestructurado

**Rol del Modelo:** Actúa como un Desarrollador Web Frontend Senior y Diseñador UX/UI experto.

**Objetivo:** Desarrollar una aplicación web interactiva, modular y visualmente atractiva utilizando **HTML5, CSS3 y JavaScript vanilla**, integrando **Firebase Realtime Database** (o Firestore) para la sincronización multiusuario en tiempo real desde múltiples dispositivos, **GSAP** para animaciones avanzadas y **Canvas-Confetti** para efectos de celebración. La aplicación gestionará el registro, balanceo de equipos en 10 grupos para un evento gastronómico, una sala de espera dinámica y un sorteo de países mediante una ruleta interactiva con fichas culturales detalladas.

---

### 1. Especificaciones de Roles y Configuración Global

- **Modo Administrador (Admin):**
- Permitir configurar o modificar en Firebase el cupo límite total de participantes (valor por defecto: 30 participantes, editable a cualquier valor).
- Panel o control accesible para visualizar el progreso general del llenado de grupos y estado del sorteo en tiempo real.

- **Modo Participante:**
- Acceso e identificación única mediante su **nombre registrado**.
- Persistencia y sincronización de sesión: Si un participante ya registrado ingresa su nombre desde cualquier dispositivo, el sistema consulta Firebase y recupera automáticamente su estado y progreso (grupo asignado, estado de espera, ruleta o país asignado).

---

### 2. Flujo del Usuario Paso a Paso

- **Paso 1: Pantalla de Bienvenida (Intro)**
- Título destacado: `"Conjunto Carmencita - Feria Gastronómica"`.
- Diseño inmersivo, temática gastronómica, micro-animaciones de entrada con **GSAP** y botón de inicio/ingreso.

- **Paso 2: Identificación del Participante**
- Campo de texto para ingresar el nombre completo.
- Si el nombre ya existe en la base de datos de Firebase, redirigir inmediatamente a su vista de progreso actual.

- **Paso 3: Evaluación de Habilidades Culinarias**
- Pregunta obligatoria: _«¿Tiene experiencia en la cocina?»_.
- Opciones exclusivas de selección única: **"Sí"** o **"No"**.

- **Paso 4: Asignación Equitativa de Grupo**
- Distribución en **10 grupos designados con letras (Grupo A, Grupo B, Grupo C, ..., Grupo J)**.
- **Lógica de Balanceo:** El algoritmo debe consultar la base de datos y repartir a los usuarios mezclando equitativamente a quienes respondieron "Sí" con quienes respondieron "No", asegurando que ningún grupo concentre solo expertos o solo novatos.
- Mostrar al usuario el grupo al que fue asignado y la lista de compañeros de su grupo registrados hasta el momento (actualizada en vivo vía Firebase).

- **Paso 5: Sala de Espera y Verificación de Cupos**
- Barra de progreso visual e indicador dinámico sincronizado en tiempo real: `X / [Meta ADMIN] participantes registrados`.
- El proceso de selección de países permanece bloqueado para todos los clientes hasta que se complete el total de participantes fijado por el Administrador.

- **Paso 6: Sorteo de Países con Ruleta Interactiva**
- Ruleta interactiva animada con **GSAP** (física de aceleración y desaceleración fluida) con un listado de países conocidos y variados.
- **Lógica de Sincronización y Giro Grupal:**
- Cualquier integrante del grupo puede accionar el giro de la ruleta para definir el país de todo su equipo.
- Al detenerse la ruleta, disparar animación de celebración con **Canvas-Confetti** y persistir en Firebase el país asignado y el nombre de quien giró.
- Si otro integrante del mismo grupo ingresa a la plataforma posteriormente (o ya estaba en pantalla), el sistema detecta el cambio en Firebase, reproduce la animación del giro y despliega el mensaje explícito:
  _«El usuario [Nombre del Integrante] ya giró la ruleta y su país correspondiente es: [Nombre del País]»_.

- **Paso 7: Ficha Gastronómica y Cultural del País Asignado**
- Vista detallada del país que le tocó investigar y cocinar al grupo.
- Contenido dinámico obligatorio por país:
- Nombre oficial y bandera/emblema.
- Galería visual con fotos representativas de sugerencias de platos típicos.
- Breve reseña histórica de su gastronomía.
- Rasgos culturales distintivos (qué los caracteriza).
- Población y datos curiosos/relevantes.

- Diseño editorial limpio, lectura ágil (cards, badges, tipografía balanceada) y enfoque dinámico que motive al equipo para la feria.

---

### 3. Persistencia y Sincronización de Datos (Firebase)

- Implementar integración con **Firebase Realtime Database** (o Firestore) mediante CDN/SDK Web para garantizar la concurrencia entre múltiples usuarios y dispositivos en Vercel:
- Estructura de nodos clara:
- `/config`: Límite de cupos fijado por el ADMIN y estado general del evento.
- `/participantes`: Lista completa de usuarios registrados, respuesta de cocina y grupo asignado.
- `/grupos`: Estado de la ruleta por grupo (si ya se giró, quién la giró y el país resultante).
- `/paises`: Catálogo de países disponibles e información gastronómica/cultural asociada.

- Uso de listeners en tiempo real (`onValue` o `onSnapshot`) para actualizar automáticamente la sala de espera y el estado de la ruleta en los dispositivos de todos los participantes conectados sin recargar la página.

---

### 4. Reglas Técnicas y Criterios de Calidad

1. **Tecnologías:** HTML5 semántico, CSS3 moderno (Flexbox, Grid, variables CSS), JavaScript Vanilla estructurado, **Firebase SDK Web (vía CDN)**, **GSAP (vía CDN)** para animaciones de interfaz y física de la ruleta, y **Canvas-Confetti (vía CDN)** para efectos visuales.
2. **Arquitectura Limpia (Separación de Responsabilidades):**

- Estructura semántica clara (HTML).
- Estilos modulares y mantenibles (CSS).
- Lógica desacoplada en JavaScript: módulo de conexión y listeners de Firebase, algoritmo de distribución balanceada, controlador de ruleta con GSAP y renderizador de interfaz (sin duplicidad de código, principio DRY).

3. **Experiencia de Usuario (UX/UI):**

- Diseño moderno, responsivo (optimizado para móviles, tablets y escritorio).
- Animaciones fluidas impulsadas por GSAP en transiciones de pantalla, interacciones de botones y giro de ruleta.

4. **Rendimiento:**

- Código optimizado, manipulación eficiente del DOM, cero lag en animaciones y sincronización ligera en tiempo real.

5. **Estructura del Código:**

- Devolver el código completo, comentado y listo para ser desplegado en Vercel (con el objeto `firebaseConfig` listo para colocar las credenciales del proyecto).
