// Smoke test: importing every type-only module ensures the project compiles
// after refactors. These modules are excluded from the coverage gate, so the
// tests live here as a compilation safety net rather than coverage work.

import { describe, expect, it } from 'vitest'

import * as abilityDetail from './abilityDetail/abilityDetail'
import * as catalogs from './catalogs/catalogs'
import * as database from './database/database'
import * as databaseFilters from './databaseFilters/databaseFilters'
import * as donut from './donut/donut'
import * as focusedEditor from './focusedEditor/focusedEditor'
import * as index from './index/index'
import * as items from './items/items'
import * as legality from './legality/legality'
import * as metDateFixer from './metDateFixer/metDateFixer'
import * as moveDetail from './moveDetail/moveDetail'
import * as pokemon from './pokemon/pokemon'
import * as pokemonEditorPanel from './pokemonEditorPanel/pokemonEditorPanel'
import * as raid from './raid/raid'
import * as raidHelp from './raidHelp/raidHelp'
import * as save from './save/save'
import * as saveFeature from './saveFeature/saveFeature'
import * as trainer from './trainer/trainer'

describe('type-only modules compile', () => {
  it.each([
    ['abilityDetail', abilityDetail],
    ['catalogs', catalogs],
    ['database', database],
    ['databaseFilters', databaseFilters],
    ['donut', donut],
    ['focusedEditor', focusedEditor],
    ['index', index],
    ['items', items],
    ['legality', legality],
    ['metDateFixer', metDateFixer],
    ['moveDetail', moveDetail],
    ['pokemon', pokemon],
    ['pokemonEditorPanel', pokemonEditorPanel],
    ['raid', raid],
    ['raidHelp', raidHelp],
    ['save', save],
    ['saveFeature', saveFeature],
    ['trainer', trainer],
  ])('%s module is importable', (_name, mod) => {
    expect(mod).toBeDefined()
  })
})
