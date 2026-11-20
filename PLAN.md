# Plan técnico — Chispa Learn

> Traduce `SPEC.md` a arquitectura. Responde *cómo* se construye; el SPEC dice *qué* se construye.

## 1. Arquitectura

- **Frontend / SSR:** TanStack Start + React 19 + Vite 8 + Tailwind 4. Rutas en `src/routes/`; layout autenticado en `src/routes/_authenticated/`.
- **Datos y auth:** Supabase (Postgres + Auth + Storage). Cliente compartido en `src/integrations/supabase/client.ts`, cliente servidor con service role en `client.server.ts`.
- **Migraciones:** `supabase/migrations/` (historia de Supabase) y `drizzle/migrations/` (snapshots). `drizzle/schema.ts` se dejó vacío a propósito: no editar.
- **Reglas puras:** `src/lib/` (`logros-calculo.ts`, `grafo.ts`, `chispa.ts`). No conocen la base de datos.
- **Efectos y acceso a datos:** `src/lib/logros.ts`, `src/lib/temas.functions.ts`, hooks en `src/hooks/`.
- **Tests:** Vitest (`@vitest/coverage-v8`). Hay un test inicial en `src/lib/logros-calculo.test.ts`.

## 2. Dónde vive cada regla

| Regla | Ubicación |
|---|---|
| RN-01 a RN-03 | `src/routes/_authenticated/route.tsx`, `src/integrations/supabase/auth-middleware.ts` |
| RN-04, RN-07 | `src/routes/_authenticated/inicio.tsx`, `src/lib/temas.functions.ts` |
| RN-05, RN-06, RN-36 | `src/lib/temas.functions.ts` (servidor / edge function) |
| RN-08 a RN-15 | `src/lib/sesion-activa.tsx`, `src/routes/_authenticated/sesion.tsx` |
| RN-16, RN-17 | `src/routes/_authenticated/sesion.tsx` (Web Speech API + tabla `study_sessions`) |
| RN-18 | `src/routes/_authenticated/historial.tsx` |
| RN-19, RN-20 | `src/routes/_authenticated/biblioteca.tsx`, tablas `topic_tags` / `tags` |
| RN-21 a RN-25 | `src/lib/logros-calculo.ts` (puro) + `src/lib/logros.ts` (persistencia) |
| RN-27 a RN-32 | `src/lib/grafo.ts`, `src/routes/_authenticated/grafo.tsx`, tabla `topic_links` |
| RN-33 a RN-35 | Rutas `tema.$id.tsx`, `e.$id.tsx`, `comunidad.tsx`, componentes de comentarios e invitaciones |
| RN-38 | `AGENTS.md` y `.cursor/rules/` |

## 3. Modelo de datos (tablas existentes)

`profiles`, `topics`, `tags`, `topic_tags`, `study_sessions`, `streaks`, `achievements`, `user_achievements`, `topic_links`, `ratings`, `comments`, `reports`, `invitations`.
Auth y usuarios los administra Supabase; las politicas RLS limitan lecturas entre usuarios (ver migración `0000_tighten_cross_user_read_policies.sql`).

## 4. Partes difíciles

1. **Tiempo:** `endsAt` evita derivas, pero hay que definir alerta al volver de pestaña inactiva (RN-11) sin duplicar sonido.
2. **Rachas:** zona horaria y sesiones abandonadas (P01, P02) hoy bloquean una regla cerrada.
3. **Grafo:** el cálculo es O(n²); con muchos temas habrá que limitar nodos o mover el cálculo a servidor.
4. **Transcripción:** Web Speech API no está en todos los navegadores; hace falta fallback (P05).
5. **IA:** la key vive solo en servidor y los temas generados necesitan validación (RN-05, RN-06).
6. **Secretos:** el repo original versionaba `.env`; la copia lo elimina y usa `.env.example` (RN-36).

## 5. Estrategia de pruebas

- **Puro primero:** ampliar `logros-calculo.test.ts` con casos límite de RN-21 a RN-25.
- **Grafo:** tests de `clavePar`, normalización y Supresión de enlaces ignorados (RN-27 a RN-32).
- **Sesión:** tests del cálculo de restante a partir de `endsAt` y de la pausa/reanude.
- **Ciclo:** tester escribe el test → debe fallar → desarrollador implementa sin tocar el test → revisor compara con SPEC → commit.

## 6. Decisiones pendientes que impactan el plan

P01, P02 (rachas), P05 (transcripción) y P06 (sesiones simultáneas). Hasta que se respondan, esas reglas quedan marcadas como pendientes en el SPEC y no se implementan suposiciones.
