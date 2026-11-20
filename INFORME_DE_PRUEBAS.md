# Informe de pruebas — Chispa Learn

> Fecha: 2026-11-20. Resultados obtenidos en el repo `chispa-learn-m4` con Node.js 20+ y npm.
> Fuente de verdad: `SPEC.md`. Cada prueba se vincula con una RN o una decisión `Dxx`.

## 1. Pruebas automatizadas

Comando:

```bash
npm test
```

Salida relevante:

```text
RUN  v5.1.1
 Test Files  3 passed (3)
      Tests  23 passed (23)
```

### Cobertura por archivo

| Archivo | Tests | Reglas cubiertas |
|---|---:|---|
| `src/lib/logros-calculo.test.ts` | 10 | RN-21 a RN-25: suma de minutos, temas distintos, explicación más larga, rachas nulas, catálogo vacío/nulo y logros ya obtenidos. |
| `src/lib/grafo.test.ts` | 7 | RN-27 a RN-32: `clavePar`, fuerza por materia/etiquetas/palabras, enlaces manuales e ignorados, pares inexistentes. |
| `src/lib/chispa.test.ts` | 6 | RN-26, D21, D22: fecha local (`hoyISO`), formato de tiempo, primer guardado, mismo día, día consecutivo y corte de racha. |

Los mocks de Supabase son locales a los tests: no se conectan a la base de datos ni usan secretos.

## 2. Build de producción

Comando:

```bash
npm run build
```

Resultado: **éxito** (`✓ built in 2.61s` para el bundle cliente y `✓ built in 2.59s` para Nitro).
Aparecen advertencias informativas de Vite/Rolldown sobre directivas `"use client"` en dependencias; no afectan el build ni el deploy.

## 3. Lint de los archivos de prueba

Comando:

```bash
npx.cmd eslint src/lib/logros-calculo.test.ts src/lib/grafo.test.ts src/lib/chispa.test.ts
```

Resultado: **sin errores**. Se completó `.prettierrc` con `endOfLine: "auto"` (manteniendo `printWidth: 100` y el resto de opciones) para que el formato respete los saltos de línea del codebase y no genere ruido en archivos existentes.

## 4. Verificación manual en la aplicación

| Escenario | Dónde | Resultado |
|---|---|---|
| Login con cuenta demo | `https://chispa-learn.lovable.app/auth` | Navegó a `/inicio`; menú HISTORIAL, COMUNIDAD, INICIO, BIBLIOTECA y PROGRESO visible. |
| Login con cuenta demo | `http://localhost:8080/auth` | Navegó a `/inicio` con el mismo menú. |
| Credenciales demo por API | REST de Supabase Auth | `login_http=200`. |
| URL publicada | Navegador | `https://chispa-learn.lovable.app` responde y usa el proyecto `qnzzjahgzqitupnsvwqm`. |

Cuenta usada: `rvqacqiu@guerrillamailblock.com` / `ChispaDemo2026!` (solo pruebas; buzón temporal).

## 5. Matriz tarea → evidencia

| Tarea | Evidencia |
|---|---|
| T01, T02 | Archivos `package.json`, `.env.example`, `.gitignore`, SPEC/PLAN/TAS/AGENTS presentes; `.env` no versionado. |
| T03 | 10 tests de `logros-calculo.test.ts` en verde. |
| T04 | 7 tests de `grafo.test.ts` en verde. |
| T05, T06, T07, T10, T11 | Verificación manual del flujo autenticado y las rutas listadas en el deploy. |
| T08 | 6 tests de `chispa.test.ts` en verde. |
| T09, T12, T13 | Implementación existente; decisiones D25, D26 y D28 cerradas en `SPEC.md`. |
| T14 | `npm test` y `npm run build` en verde; `SPEC.md` sin pendientes. |

## 6. Observaciones

- La generación de temas con IA requiere `LOVABLE_API_KEY` en el servidor. Sin esa clave, la función falla del lado servidor (RN-44); no se probó esa rama con clave real.
- El dictado depende de Web Speech API. Si el navegador no la expone, se muestra un aviso y se usa el campo de texto (D25).
- El informe cubre la fase verde del ciclo rojo → verde → refactor. La secuencia de trabajo por tarea está registrada en `TAS.md`.
