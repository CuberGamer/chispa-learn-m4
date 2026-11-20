<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

# Reglamento de Chispa Learn

Este es el repositorio de entrega de Chispa Learn. La aplicación publicada en https://chispa-learn.lovable.app es el deploy de producción; acá vive el código junto con la documentación de ingeniería (SPEC, PLAN, TAS y reglas de agentes).

## Fuente de verdad

- `SPEC.md` es la fuente de verdad. Lo que no está ahí, no se implementa.
- Los cambios de negocio se escriben primero en `documentos/decisiones.md`, luego en `SPEC.md` y recién después en código.
- `documentos/idea.md`, `documentos/glosario.md` y `documentos/preguntas-abiertas.md` son las fuentes; `PLAN.md` dice cómo se construye; `TAS.md` dice en qué orden.

## Stack

React 19 + TanStack Start/Router + Vite 8 + Tailwind 4 + TypeScript. Supabase (Postgres/Auth/Storage) con migraciones en `supabase/migrations/`; Drizzle solo para snapshots. Tests con Vitest. Reglas puras en `src/lib/`.

## Reglas universales

1. Leer `SPEC.md` y `documentos/glosario.md` antes de actuar.
2. No inventar reglas de negocio. Si falta información, frenar y preguntar o registrar una entrada en `preguntas-abiertas.md`.
3. Un equipo de trabajo por vez; no tocar archivos fuera del área asignada.
4. Los tests los escribe el tester y deben fallar antes de implementar. El desarrollador no modifica tests.
5. Ningún cambio se considera terminado sin el revisor; con aprobación se hace commit y se actualiza `TAS.md`.
6. Los secretos van en variables de entorno. `.env` no se versiona; usar `.env.example`.
7. Topic graph links (manual/ignored) persist in topic_links per user; automatic links are computed client-side in src/lib/grafo.ts — why: auto links must recompute from content, manual ones must survive reloads.

## Agentes

Los perfiles están en `.cursor/rules/`. Invocar con `@analista`, `@arquitecto`, `@backend`, `@frontend`, `@tester`, `@revisor`.

| Agente | Responsabilidad | No hace |
|---|---|---|
| `@analista` | Dueño del SPEC; escribe decisiones, glosario e historias | Escribir código |
| `@arquitecto` | Traduce SPEC a PLAN y TAS | Cambiar el SPEC |
| `@backend` | Datos, Supabase, reglas de servidor | Modificar tests |
| `@frontend` | Rutas, componentes y UX | Cambiar reglas de negocio |
| `@tester` | Escribe tests desde el SPEC | Implementar la solución |
| `@revisor` | Aprueba o rechaza contra el SPEC | Implementar directamente |

Las preferencias de navegador (cuándo usar el navegador interno, los perfiles de Chrome y el perfil habitual) están en las instrucciones globales `~/.config/opencode/AGENTS.md` y se aplican también acá.
