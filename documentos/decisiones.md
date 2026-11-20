# Decisiones

> Cada decisión se escribe como pregunta + respuesta. `Dxx` se cita desde el SPEC y desde los tests.

| ID | Decisión |
|---|---|
| D01 | El contenido de la app (temas, mensajes de Chispa, etiquetas) es **en español**. |
| D02 | Frontend en React + Vite, sobre TanStack Start/Router; estilos con Tailwind CSS. |
| D03 | Backend y base de datos en Supabase (Postgres + Auth + Storage). Se mantiene Drizzle para migraciones/esquema. |
| D04 | El visitante solo ve la landing: para usar el cronómetro y guardar hay que registrarse. |
| D05 | El cronómetro se guarda en `localStorage` con `endsAt` (timestamp), no con un contador: sobrevive recargas y pestañas inactivas. |
| D06 | Al terminar el tiempo suena una alerta y se pasa a la fase de explicación; la sesión no se cierra hasta guardar o abandonar. |
| D07 | La transcripción por voz siempre se muestra **editable** antes de guardar. |
| D08 | La generación de temas con IA se llama desde el servidor (edge function), nunca desde el frontend, para no exponer la API key. |
| D09 | Los temas generados por IA se validan antes de mostrarse (título no duplicado, al menos una etiqueta). |
| D10 | Las rachas se calculan por días consecutivos de estudio; se guardan `current_streak`, `longest_streak` y `last_study_date`. |
| D11 | Los logros se calculan con **lógica pura** (`src/lib/logros-calculo.ts`) que no conoce la base de datos; se persisten en `user_achievements` solo los nuevos. |
| D12 | Reglas de logro: Primera chispa ≥1 sesión; Diez temas ≥10 temas distintos; Racha de 7 ≥7; Maratón ≥300 minutos; Explicador ≥1000 caracteres. |
| D13 | El grafo calcula enlaces automáticos en el cliente a partir de materia, etiquetas y palabras clave; los enlaces manuales y los "ignorados" se guardan por usuario en `topic_links`. |
| D14 | Una conexión ignorada suprime el enlace automático correspondiente; el par se identifica de forma ordenada (`clavePar`). |
| D15 | Las explicaciones pueden hacerse públicas; otros usuarios pueden verlas, comentarlas, calificarlas y reportarlas. |
| D16 | No hay corrección automática de contenido; la calidad se mide por calificación de pares. |
| D17 | `started_at` en backend para evitar manipulación del cronómetro queda como mejora futura (no en el MVP). |
| D18 | Deploy público en Lovable; la configuración de Supabase se pasa por variables de entorno. |
| D19 | Los secretos nunca se versionan: `.env` se ignora y se entrega `.env.example` con los nombres de variables. |
| D20 | Toda tarea se ejecuta con el ciclo tester → desarrollador → revisor → commit; el revisor puede rechazar. |
| D21 | El "día" de la racha es la fecha **local del usuario** en `YYYY-MM-DD` (`hoyISO`), no UTC. Cierra P01. |
| D22 | Solo cuenta para la racha una sesión **guardada con explicación**; una sesión iniciada y abandonada no la modifica. Cierra P02. |
| D23 | Los reportes se guardan en `content_reports` con motivo y detalle; no hay acción automática ni SLA en el MVP. Cierra P03. |
| D24 | Una explicación puede alternarse entre pública y privada desde el historial en cualquier momento; el texto no se pierde. Cierra P04. |
| D25 | Si el navegador no tiene Web Speech API, se muestra un aviso y se usa el campo de texto editable; no hay servicio externo de transcripción. Cierra P05. |
| D26 | Solo se permite una sesión activa local a la vez (`chispa-sesion-activa`); iniciar otra usa la misma clave y aplica RN-12. Cierra P06. |
| D27 | Los nombres de logros son identificadores fijos del catálogo; renombrarlos exige migración y cambio del SPEC. Cierra P07. |
| D28 | La generación con IA no tiene cupo por usuario: depende de `LOVABLE_API_KEY` en servidor; sin clave falla en servidor y queda deshabilitada en local. Cierra P08. |
