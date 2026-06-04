// Smoke test: ensures the data-only modules under utils/ remain importable
// after refactors. Each module exports plain data; this test only verifies
// the import resolves, not the content.

import { describe, expect, it } from 'vitest'

import * as databaseDefaults from './database/defaults/defaults'
import * as databasePreferences from './database/preferences/preferences'
import * as defaultCatalogs from './defaultCatalogs/defaultCatalogs'
import * as donutFlavorLabels from './donutFlavorLabels/donutFlavorLabels'
import * as generationData from './generationData/generationData'
import * as moveFlags from './moveFlags/moveFlags'
import * as natureData from './natureData/natureData'
import * as raidEventData from './raidEventData/raidEventData'
import * as typeChartData from './typeChartData/typeChartData'
import * as typeChartGen6Data from './typeChartGen6Data/typeChartGen6Data'
import * as typeData from './typeData/typeData'

describe('data-only modules import', () => {
  it.each([
    ['database/defaults', databaseDefaults],
    ['database/preferences', databasePreferences],
    ['defaultCatalogs', defaultCatalogs],
    ['donutFlavorLabels', donutFlavorLabels],
    ['generationData', generationData],
    ['moveFlags', moveFlags],
    ['natureData', natureData],
    ['raidEventData', raidEventData],
    ['typeChartData', typeChartData],
    ['typeChartGen6Data', typeChartGen6Data],
    ['typeData', typeData],
  ])('%s module is importable', (_name, mod) => {
    expect(mod).toBeDefined()
  })
})
