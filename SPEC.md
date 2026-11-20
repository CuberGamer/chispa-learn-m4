# SPEC — Chispa Learn

> **Fuente de verdad del proyecto.** Si el código y este documento discrepan, se corrige el código; para cambiar una regla se actualiza primero `documentos/decisiones.md` y después este archivo.
> Versiones anteriores: commit inicial `docs: spec 1 de chispa learn`.
> Fuentes: `documentos/idea.md`, `documentos/decisiones.md`, `documentos/glosario.md`, `README.md` y código existente.

## 1. Objetivos

1. Permitir que un usuario registrado estudie un tema por su cuenta durante un tiempo limitado y afterwards lo explique con sus palabras.
2. Guardar esa explicación y mostrar historial, estadísticas y logros.
3. Hacer que el aprendizaje sea consistente mediante rachas y una mascota (Chispa) con estados.
4. Permitir descubrir relaciones entre temas estudiados (grafo) y compartir explicaciones con la comunidad.

## 2. Usuarios y roles

| Rol | Permisos |
|---|---|
| Visitante | Ver landing. No puede iniciar sesiones ni guardar. |
| Usuario registrado | Ciclo completo de estudio, biblioteca, perfil, grafo y comunidad. |
| Dueño del producto | Carga temas/etiquetas/logros directamente en base de datos (sin panel propio). |

## 3. Alcance

**Incluido:** autenticación, tema del día/aleatorio/IA, temporizador persistente, explicación escrita o dictada, historial, biblioteca con búsqueda, perfil y logros, grafo, comunidad (público/comentarios/calificación/reporte), invitaciones.

**Fuera de alcance:** cobros, notificaciones push, panel admin, corrección automática de contenido, moderación automática.

## 4. Reglas de negocio (RN)

### Cuentas y acceso

- **RN-01** — Un visitante no puede iniciar una sesión de estudio ni guardar datos.
- **RN-02** — El acceso se hace con email y contraseña mediante Supabase Auth. La sesión se adjunta automáticamente a las consultas del cliente.
- **RN-03** — Todas las pantallas de estudio están detrás de la ruta autenticada; si la sesión vence, se redirige a autenticación.

### Temas

- **RN-04** — En cada sesión se muestra un tema del día común para todos los usuarios y un tema aleatorio.
- **RN-05** — La generación de temas con IA se ejecuta en el servidor; la API key nunca viaja al navegador.
- **RN-06** — Un tema generado por IA solo se muestra si tiene título no duplicado y al menos una etiqueta.
- **RN-07** — Todo contenido visible (temas, etiquetas, mensajes de Chispa) está en español.

### Cronómetro y sesión de estudio

- **RN-08** — Una sesión se inicia con un tema y una duración en minutos; la interfaz ofrece 5, 15 y 30 minutos.
- **RN-09** — El tiempo restante se calcula con un timestamp `endsAt`, nunca con un contador local, para sobrevivir recargas e inactividad.
- **RN-10** — El estado de la sesión se persiste en `localStorage` bajo `chispa-sesion-activa` con tema, duración, restante, pausa, fase y `endsAt`.
- **RN-11** — Al recargar, si `endsAt` ya pasó, la sesión pasa a fase de explicación y suena la alerta; si no, se recalcula el restante.
- **RN-12** — Al iniciar una sesión para el mismo tema que ya estaba guardada en fase temporizador, se restaura en lugar de reiniciarla.
- **RN-13** — Pausar congela el restante y anula `endsAt`; reanudar recalcula `endsAt` desde el restante actual.
- **RN-14** — Al llegar a cero suena una alerta y la sesión pasa a fase de explicación; no se cierra hasta guardar o abandonar.
- **RN-15** — Una sesión guardada en fase de explicación no se restaura al recargar: se limpia el estado local.

### Explicación e historial

- **RN-16** — La explicación puede escribirse o dictarse; si se dicta, la transcripción se muestra editable antes de guardar.
- **RN-17** — La explicación se guarda asociada al usuario, al tema, a la duración y a la fecha.
- **RN-18** — El historial muestra solo las sesiones del usuario autenticado, ordenadas de más reciente a más antigua.

### Biblioteca y temas

- **RN-19** — La biblioteca permite buscar temas por título y por etiqueta.
- **RN-20** — Las etiquetas se normalizan y un tema puede tener varias.

### Estadísticas, rachas y logros

- **RN-21** — Las estadísticas son: cantidad de sesiones, temas distintos, minutos totales, racha actual, racha máxima y longitud de la explicación más larga.
- **RN-22** — Los minutos totales son la suma de `duration_minutes` de las sesiones del usuario.
- **RN-23** — Temas distintos es la cantidad de `topic_id` únicos en las sesiones del usuario.
- **RN-24** — Los logros se evalúan con lógica pura sobre estadísticas y se guardan solo los que el usuario aún no tiene.
- **RN-25** — Reglas de logro: *Primera chispa* ≥1 sesión; *Diez temas* ≥10 temas distintos; *Racha de 7* ≥7 (actual o máxima); *Maratón* ≥300 minutos; *Explicador* ≥1000 caracteres en la explicación más larga.
- **RN-26** — La racha se actualiza solo al guardar una sesión, usando la fecha local del usuario en `YYYY-MM-DD` (D21, D22): si ya guardó hoy no cambia; si la fecha anterior es ayer suma 1; en otro caso reinicia en 1. `longest_streak` conserva el máximo. Una sesión iniciada pero abandonada no cuenta.

### Grafo de temas

- **RN-27** — Cada tema estudiado es un nodo; sus palabras clave se extraen del título y la explicación, normalizando acentos y descartando palabras de menos de 5 caracteres y la lista de vacías.
- **RN-28** — Un enlace automático suma: +3 por materia igual, +2 por etiqueta compartida (máximo 4) y +1 cada dos palabras comunes (máximo 3). Solo se muestra si la fuerza es mayor que cero.
- **RN-29** — Un par de temas se identifica con clave ordenada, de modo que (A,B) y (B,A) son el mismo enlace.
- **RN-30** — Los enlaces manuales y los ignorados se guardan por usuario; un enlace ignorado suprime el automático correspondiente.
- **RN-31** — Los enlaces automáticos se recalculan en cada carga; los manuales e ignorados sobreviven a recargas.
- **RN-32** — Un usuario nunca ve enlaces guardados por otro usuario.

### Comunidad

- **RN-33** — Una explicación puede marcarse como pública; en ese caso es visible por otros usuarios registrados.
- **RN-34** — Los usuarios registrados pueden comentar, calificar y reportar explicaciones públicas.
- **RN-35** — Un usuario puede invitar a otro a estudiar un tema; la invitación aparece en las invitaciones recibidas del destinatario.

### Seguridad y operación

- **RN-36** — Los secretos (keys de Supabase service role, API key de IA, secretos de cron) se leen de variables de entorno; `.env` no se versiona.
- **RN-37** — Las acciones de servidor que usan la service role no se ejecutan desde el navegador.
- **RN-38** — Toda tarea se ejecuta con el ciclo tester → desarrollador → revisor → commit, y el revisor puede rechazar.

### Decisiones operativas cerradas

- **RN-39** — Los reportes de contenido se guardan con motivo y detalle; no hay acción automática ni plazo de revisión en el MVP (D23).
- **RN-40** — La visibilidad de una explicación puede alternarse entre pública y privada desde el historial sin perder el texto (D24).
- **RN-41** — Si el navegador no expone Web Speech API, el dictado se deshabilita con un aviso y la explicación se escribe a mano (D25).
- **RN-42** — Solo existe una sesión activa local a la vez, bajo la clave `chispa-sesion-activa` (D26).
- **RN-43** — Los nombres de logros son identificadores fijos del catálogo; cambiarlos requiere migración y actualización del SPEC (D27).
- **RN-44** — La generación con IA no tiene cupo por usuario: depende de `LOVABLE_API_KEY` en servidor y falla allí si la clave falta (D28).

## 5. Historias de usuario y criterios de aceptación

### HU-01 — Registrarme e ingresar
- **Dado** que soy visitante, **cuando** me registro con email y contraseña, **entonces** puedo acceder a las rutas de estudio (RN-01, RN-02).

### HU-02 — Ver el tema del día
- **Dado** que estoy autenticado, **cuando** entro al inicio, **entonces** veo el tema del día y puedo elegir uno aleatorio (RN-04, RN-07).

### HU-03 — Crear un tema con IA
- **Dado** que estoy autenticado, **cuando** pido crear un tema con una instrucción, **entonces** el servidor genera el tema, lo valida y lo muestra con sus etiquetas (RN-05, RN-06).

### HU-04 — Usar el cronómetro
- **Dado** que elegí tema y duración, **cuando** presiono empezar, **entonces** el temporizador corre usando `endsAt` y sigue correcto tras recargar (RN-08, RN-09, RN-10).

### HU-05 — Pausar y reanudar
- **Dado** que el cronómetro está corriendo, **cuando** pauso y luego reanudo, **entonces** el tiempo restante se conserva y se recalcula el fin (RN-13).

### HU-06 — Terminar y explicar
- **Dado** que el tiempo llegó a cero, **cuando** se activa la alerta, **entonces** paso a la fase de explicación sin perder el tema (RN-14, RN-15).

### HU-07 — Guardar mi explicación
- **Dado** que escribí o dicté mi explicación, **cuando** la guardo, **entonces** queda asociada a mi usuario y tema y aparece en el historial (RN-16, RN-17, RN-18).

### HU-08 — Buscar en la biblioteca
- **Dado** que tengo temas disponibles, **cuando** busco por título o etiqueta, **entonces** veo solo los temas que coinciden (RN-19, RN-20).

### HU-09 — Ver mis estadísticas y logros
- **Dado** que tengo sesiones guardadas, **cuando** abro mi perfil, **entonces** veo sesiones, temas distintos, minutos, rachas y los logros recién desbloqueados (RN-21 a RN-25).

### HU-10 — Explorar el grafo
- **Dado** que estudié varios temas, **cuando** abro el grafo, **entonces** veo nodos y enlaces automáticos calculados desde materia, etiquetas y palabras (RN-27 a RN-29).

### HU-11 — Gestionar enlaces del grafo
- **Dado** que veo un enlace, **cuando** lo marco como manual o lo ignoro, **entonces** se guarda solo para mi usuario y el enlace ignorado deja de mostrarse (RN-30 a RN-32).

### HU-12 — Compartir y opinar
- **Dado** que hice pública una explicación, **cuando** otro usuario la ve, **entonces** puede comentarla, calificarla y reportarla (RN-33, RN-34).

### HU-13 — Invitar a otro usuario
- **Dado** que estoy en un tema, **cuando** invito a otro usuario, **entonces** la invitación aparece en sus invitaciones recibidas (RN-35).

## 6. Casos borde

- Recargar con el tiempo vencido → pasar a explicación y sonar alerta (RN-11).
- Pausar justo al llegar a cero → no debe dejar tiempo negativo (RN-13).
- Dos temas con la misma palabra clave pero distinta materia → no generar enlace por palabras sueltas (RN-28).
- Enlace ignorado por un usuario y manual para otro → cada uno ve el suyo (RN-30, RN-32).
- Logro ya obtenido → no volver a insertarlo (RN-24).
- API key de IA ausente → fallar en servidor, nunca en cliente (RN-36).

## 7. Estado de pendientes

Sin pendientes. Las preguntas P01 a P08 se cerraron con las decisiones D21 a D28 en `documentos/decisiones.md` y se reflejan en RN-26 y RN-39 a RN-44.
