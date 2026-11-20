# TAS — Tareas del proyecto

> Ordenadas por dependencias. Estado final: todas las tareas están cerradas con tests automatizados y/o verificación manual en el deploy; los detalles están en `INFORME_DE_PRUEBAS.md`.

| ID | Tarea | Agente | RN / HU | Depende de | Estado |
|---|---|---|---|---|---|
| T01 | Andamiaje del repo: estructura, lint/format, Vitest, `.env.example`, `.gitignore` sin secretos | backend | RN-36 | — | Hecho |
| T02 | Documentos fuente, SPEC numerado, PLAN y este TAS | analista / arquitecto / revisor | todas | T01 | Hecho |
| T03 | Reglas de logros: tests puros y cálculo de estadísticas | tester → backend → revisor | RN-21 a RN-25 / HU-09 | T02 | Hecho — 10 tests |
| T04 | Grafo: normalización, claves de par y supresión de ignorados | tester → backend → revisor | RN-27 a RN-32 / HU-10, HU-11 | T02 | Hecho — 7 tests |
| T05 | Sesión: cálculo de restante desde `endsAt`, pausa y restauración | tester → frontend → revisor | RN-08 a RN-15 / HU-04 a HU-06 | T02 | Hecho — verificación manual |
| T06 | Persistencia de explicación e historial por usuario | tester → backend → revisor | RN-16 a RN-18 / HU-07 | T05 | Hecho — verificación manual |
| T07 | Biblioteca con búsqueda por título y etiquetas | tester → frontend → revisor | RN-19, RN-20 / HU-08 | T02 | Hecho — verificación manual |
| T08 | Rachas: definir zona horaria y sesiones que cuentan | analista → arquitecto → revisor | RN-26 / D21, D22 | T02 | Hecho — tests de `actualizarRacha` |
| T09 | Generación de temas con IA en servidor + validación | tester → backend → revisor | RN-05, RN-06 / HU-03 | T02 | Hecho — requiere key de servidor |
| T10 | Comunidad: publicar, comentar, calificar y reportar | tester → backend/frontend → revisor | RN-33, RN-34 / HU-12 | T06 | Hecho — verificación manual |
| T11 | Invitaciones entre usuarios | tester → frontend → revisor | RN-35 / HU-13 | T02 | Hecho — verificación manual |
| T12 | Accesibilidad: fallback cuando no hay Web Speech API | tester → frontend → revisor | RN-16 / D25 | T06 | Hecho — aviso + campo editable |
| T13 | Límite de nodos del grafo o cálculo en servidor | arquitecto → revisor | RN-27 | T04 | Cerrado — se acepta cálculo en cliente; mejora futura si crece el volumen |
| T14 | Verificación final: build, tests y revisión del SPEC | revisor | todas | T03 a T13 | Hecho — ver `INFORME_DE_PRUEBAS.md` |

## Ciclo de cada tarea

1. El **tester** escribe tests desde el criterio de aceptación del SPEC y los corre: deben fallar.
2. El **desarrollador** implementa hasta que pasen, sin modificar los tests. Si un test le parece incorrecto, lo reporta.
3. El **revisor** compara implementación, tests y SPEC; aprueba o rechaza con findings.
4. Con aprobación: **commit** y se marca la tarea como hecha en este archivo.

> No se agrega una tarea nueva sin RN o HU que la justifique. No se marca como hecha una tarea sin revisor.
