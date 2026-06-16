# Review pkmedit_web — mejoras (2026-06-10)

Alcance: estructura completa `src/`, capa HTTP (`apiHttp.ts`), storage
(`localDb.ts`), routing (`AppRoutes.tsx`), `package.json`, `.gitignore`,
README, CI, git status. NO leído componente por componente (~200 archivos
de componentes); review de capas core + higiene de repo.

## Veredicto fallas graves

**Ninguna falla grave funcional encontrada en lo revisado.**

Capa HTTP sólida: timeout 60s + AbortController + señal externa + mapeo de
errores con mensaje del backend. IndexedDB correcto. ErrorBoundary presente.
i18n en/es/ja con tests de paridad de claves. Tests con MSW + thresholds por
archivo. CI con lint + type-check + coverage + build. Arquitectura
(components/core/query/services/state) consistente con el modelo draft.

Lo más riesgoso hoy no es código: es trabajo sin commitear (P0).

## Mejoras

### P0

1. **Commitear el WIP.** 7 archivos modificados + ~25 archivos de test nuevos
   untracked (`api.test.ts`, `apiHttp.test.ts`, `draftChanges.test.ts`, etc.
   - cambios en `localDb.ts`, `revertWorkspaceChange.ts`, `handlers.ts`,
     `vite.config.ts`). Riesgo de pérdida + CI no los cubre. Commitear o
     stashear ya.

### P1

2. **Junk trackeado en git.** `public/.DS_Store`, `public/assets/.DS_Store`,
   `tsconfig.tsbuildinfo` están commiteados (el `.gitignore` los cubre pero
   entraron antes). Fix:
   `git rm --cached public/.DS_Store public/assets/.DS_Store tsconfig.tsbuildinfo`
3. **Deps mal ubicadas.** `vite` y `@vitejs/plugin-react` en `dependencies`;
   son build tools → `devDependencies`.

### P2

4. **Routing solo por estado.** `AppRoutes.tsx` resuelve vista por
   `uiStore.focusedEditor`; refresh pierde la vista activa y no hay
   deep-links. Si molesta en uso real: persistir en hash/query param.
5. **`?api=` sin validar.** El query param se persiste a localStorage como
   base URL sin chequear formato. Herramienta LAN = riesgo bajo, pero validar
   `http(s)://` antes de guardar es barato.
6. **Timeout único 60s.** Export ZIP grande podría superar 60s; permitir
   override por request en `requestJson`/`requestBlob`.
7. `coverage/` viejo en disco (ignorado, pero confunde al navegar). Borrar.

## Nota cross-repo

`pkmedit_backend/AGENTS.md` describe este frontend con rutas viejas
(`web/src/lib/...`) y stack stale ("bundled en NRO"). Corregir allá (ver
review del backend). _Resuelto el 2026-06-10 en el backend._

## Cierre (2026-06-10)

- 1: WIP commiteado en dos partes — `refactor(services)` (callbacks de
  revert como objeto) + `test` (suites de toda la capa services, MSW
  handlers nombrados, fake-indexeddb, coverage de services).
- 2: `.DS_Store` ×2 y `tsconfig.tsbuildinfo` destrackeados.
- 3: `vite` y `@vitejs/plugin-react` movidos a devDependencies.
- 4: descartado por decisión — perder la vista al refrescar no molesta.
- 5: `?api=` y el valor almacenado se validan como URL http(s) absoluta;
  inválido → default, sin persistir.
- 6: `timeoutMs` por request en la capa HTTP; exports usan 300s.
- 7: `coverage/` local borrado (ya estaba ignorado).

Extra: `npm run format` repo-wide reveló ~70 archivos sin formatear →
commit `style:` dedicado; el re-wrap empujó `statCalc.ts` sobre max-lines
y la tabla de naturalezas se reemplazó por la derivación aritmética
(commit `refactor(utils)`).
