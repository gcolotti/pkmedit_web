# Testing Handbook — Pkmedit Web

Estado del barrido de tests unitarios (Phase 2 del plan de 4 fases).
**Pausado el 2026-06-04 a pedido del usuario.**

---

## Lo que está hecho

### Setup base

- Vitest con `jsdom`, cobertura v8, MSW v2 para fetch
- `@testing-library/react` con `cleanup()` en `afterEach` (en `src/test/setup.ts`)
- ESLint + Prettier ya estaban configurados

### Convención establecida

- **Un test por archivo, en su misma carpeta** (folder-per-file, sin `index.ts` en `core/`)
  - Ejemplo: `core/utils/dxt1/dxt1.ts` → `core/utils/dxt1/dxt1.test.ts`
- Cobertura objetivo: **100% en líneas / funciones / statements**, **90% en ramas** (excepciones por debajo justificadas)
- Exclusiones del gate: `**/types/**`, `**/i18n/locales/**`, `**/wikiDexAssets/**`, `**/*.d.ts`

### Tests escritos: 31 archivos, 436 tests pasando

Todos en `src/core/utils/`. Cobertura 100% líneas/funciones/stmts salvo 4 archivos con ramas duras:

| Archivo             | Stmts | Branches | Ramas faltantes                    |
| ------------------- | ----- | -------- | ---------------------------------- |
| `catalogSearch.ts`  | 100%  | 96%      | línea 61 — comparador `startsWith` |
| `generationData.ts` | 100%  | 88.88%   | líneas 34, 59                      |
| `plusMoveUtils.ts`  | 100%  | 85.71%   | líneas 27, 42                      |
| `raidDisplay.ts`    | 100%  | 97.29%   | líneas 87-88                       |

Estas son ramas muertas en comparadores/early-returns que el código real no ejercita. **Decisión a tomar**: ¿se agrega un test artificial para cubrirlas o se acepta el % actual?

---

## Lo que falta (Phase 2)

Orden recomendado para retomar (de menos a más esfuerzo):

### 1. Cerrar las 4 ramas duras de `core/utils/`

Resolvé la decisión de arriba. Probablemente la salida sea agregar tests target con entradas artificiales.

### 2. `core/state/` (4 stores Zustand + 1 tipos)

- `uiStore.ts`, `shellStore.ts`, `draftStore.ts`, `arceusResearchSlice.ts`, `draftStoreTypes.ts` (smoke)
- Tests típicos: estado inicial, transiciones, selectores derivados

### 3. `core/services/` (25 archivos) — el lote más pesado

- **HTTP / storage**: `apiHttp`, `apiHelpers`, `storage`, `localDb`, `structuralEquality`, `databaseTypes` (tipos)
- **API REST fina**: `api`, `catalogApi`, `databaseApi`, `itemApi`, `pokemonApi`, `saveApi`, `exportApi`
- **Borradores**: `drafts`, `draftChanges`, `draftPathUtils`, `draftPayloads`, `draftSelection`, `arceusResearchDraftChanges`, `arceusResearchActionUtils`, `pokedexActionUtils`, `pokemonPayload`, `legality`, `revertWorkspaceChange`, `exportSave`
- Los grandes: `draftPathUtils` (153 líneas), `apiHttp` (109), `arceusResearchActionUtils` (113)
- Requieren MSW para fetch; `localStorage` ya viene del jsdom env

### 4. `core/query/` (15 archivos)

- Hooks de TanStack Query: `useBoxes`, `useParty`, `useRaidsBase`, `useTrainerBase`, `useItemsBase`, `useUndergroundBase`, `useCatalogs`, `useSavesList`, `useOpenSave`, `useUploadSave`, `useApiStatus`, `useMoveDetails`, `useAbilityDetails`, `usePokedexStatus`
- Más la infra: `keys/`, `queryClient/`, `sectionStatus/`
- Se mockean con MSW + `QueryClientProvider` de test

### 5. `core/hooks/` (28 archivos) — el lote más grande

- **Workspace** (los más complejos): `useSaveWorkspace`, `useSaveWorkspaceDatabases`, `useSaveWorkspaceRaids`, `useWorkspaceController`, `useWorkspaceCommands`, `useWorkspaceViewCommands`, `useWorkspaceWriteCommand`, `useWorkspaceRevertCommands`, `useWorkspaceValidationCommand`, `useWorkspaceDerived`, `useWorkspaceStoreSlices`, `useWorkspaceSession`, `saveWorkspaceResult/`
- **Drafts**: `usePokedexDrafts`, `useDonutDrafts`, `useMysteryGiftDrafts`, `useArceusResearchDrafts`, `useSectionDrafts`
- **Browsers**: `useDatabaseBrowser`, `useDatabasePreview`, `useEncounterBrowser`, `useMysteryGiftBrowser`
- **Otros**: `usePokemonSelection`, `useCopyPaste`, `useDonutPocket`, `useMetDateFixer`, `useSaveWriter`, `useStatReconciliation`, `workspaceCommandTypes` (tipos)
- Requieren `renderHook` de RTL + mockear stores + services

### 6. `core/i18n/`

- `useTranslator` (hook) + `i18n/` (config)
- **Smoke tests por locale**: importar `en`, `es`, `ja` y verificar que las claves no drifted entre sí

### 7. Smoke tests para type-only y data files

- Aplica a `**/types/**`, `**/wikiDexAssets/**`, `*Data.ts` con catálogos hardcodeados
- Trivial: `import './foo'` para confirmar que tipos compilan
- Excluidos del gate de cobertura, pero sirven de red de seguridad para refactors

### 8. Configurar thresholds por archivo en `vitest.config.ts`

- Ajustar para que el gate sea por archivo, no solo global
- Documentar la regla del 90% en ramas como excepción permitida

### 9. GitHub Actions (`.github/workflows/ci.yml`)

- `lint`, `type-check`, `test:coverage`, `build`
- Cache de `node_modules`

### 10. Verificación final

- Correr los 4 comandos en limpio
- Arreglar lo que rompa
- Confirmar thresholds

---

## Datos faltantes

**Phase 3 y Phase 4 del plan de 4 fases nunca fueron documentadas.** El contenido se perdió entre compactaciones. Antes de retomar Phase 2, confirmar con el usuario qué seguía después. Memoria: `~/.claude/projects/.../memory/phase3-unknown.md`.

---

## Cómo retomar

1. Empezar por las **4 ramas duras** de `core/utils/` — son rápidas de cerrar y dejarían la cobertura 100%
2. Continuar con `core/state/` — es el lote más chico y descongestiona
3. Después `core/services/` — el verdadero cuello de botella
4. Correr `npm run test:coverage` periódicamente para detectar regresiones
5. No olvidar el dato de Phase 3 antes de declarar Phase 2 cerrada

Comandos útiles:

- `npm test` — corre una vez
- `npm run test:watch` — modo watch
- `npm run test:coverage` — corre con cobertura
- `npm run type-check` — `tsc -b` (proyecto composite, tsconfig.app.json + tsconfig.node.json)
- `npm run lint` — ESLint con `--max-warnings 0`
