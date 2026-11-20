# Idea — Chispa Learn

> Documento fuente. Toda regla de negocio debe terminar en `SPEC.md`. Si algo cambia acá, se actualiza primero este archivo y después el SPEC.

## Problema

La mayoría de la gente "estudia" repasando pasivamente y no practica la explicación. Chispa nace para entrenar el aprendizaje autodidacta con la técnica de *aprender enseñando*: el usuario recibe un tema, investiga por su cuenta con un tiempo límite y después debe explicar lo que aprendió, escribiendo o dictando.

## Usuarios

- **Visitante:** ve la landing, no puede usar el cronómetro ni guardar.
- **Usuario registrado:** usa el ciclo completo (tema → temporizador → explicación → historial) y, en fases posteriores, publica, comenta y califica.
- **Dueño del producto:** carga temas curados, etiquetas y logros;no tiene panel de administración propio (por ahora se hace directo en base de datos).

## Propuesta de valor

Un loop corto y repetible que convierte "leer algo" en "explicarlo con mis palabras", con gamificación liviana (rachas, logros, mascota Chispa) y sin fricción: el tema puede ser aleatorio o creado por el usuario/IA.

## Alcance actual (lo que ya existe en el código)

- Autenticación con Supabase (email/contraseña).
- Tema del día y tema aleatorio; generación de temas con IA desde el servidor.
- Selector de duración y cronómetro persistente con timestamps.
- Explicación por texto o dictado con transcripción del navegador, siempre editable.
- Historial de sesiones, biblioteca con buscador por título y etiquetas.
- Perfil con estadísticas y logros calculados desde reglas puras.
- Grafo de temas: enlaces automáticos calculados en cliente y enlaces manuales/ignorados persistidos por usuario.
- Comunidad: explicaciones públicas, comentarios, calificaciones y reportes.
- Invitaciones a otros usuarios sobre un tema.

## Fuera de alcance por ahora

- Cobros, planes de pago y notificaciones push.
- Corrección automática del contenido de las explicaciones.
- Panel de administración con UI propia.
- Moderación automática de contenido ofensivo (solo reporte manual por ahora).

## Notas

La idea original estaba en `README.md`; ese documento pasó a ser la documentación de uso del proyecto. Las decisiones que se fueron tomando se registran en `decisiones.md` y las dudas sin resolver en `preguntas-abiertas.md`.
