import { describe, expect, it } from 'vitest'

import { en } from './en/en'
import { enDatabase } from './enDatabase/enDatabase'
import { enInventory } from './enInventory/enInventory'
import { enMetDateFixer } from './enMetDateFixer/enMetDateFixer'
import { enTrainerSave } from './enTrainerSave/enTrainerSave'
import { es } from './es/es'
import { esDatabase } from './esDatabase/esDatabase'
import { esInventory } from './esInventory/esInventory'
import { esMetDateFixer } from './esMetDateFixer/esMetDateFixer'
import { esTrainerSave } from './esTrainerSave/esTrainerSave'
import { ja } from './ja/ja'
import { jaDatabase } from './jaDatabase/jaDatabase'
import { jaInventory } from './jaInventory/jaInventory'
import { jaMetDateFixer } from './jaMetDateFixer/jaMetDateFixer'
import { jaTrainerSave } from './jaTrainerSave/jaTrainerSave'

const groups = {
  core: { en, es, ja },
  enDatabase: { en: enDatabase, es: esDatabase, ja: jaDatabase },
  enInventory: { en: enInventory, es: esInventory, ja: jaInventory },
  enMetDateFixer: { en: enMetDateFixer, es: esMetDateFixer, ja: jaMetDateFixer },
  enTrainerSave: { en: enTrainerSave, es: esTrainerSave, ja: jaTrainerSave },
} as const

describe('locale key parity', () => {
  for (const [name, dict] of Object.entries(groups)) {
    it(`${name}: en, es, ja share the same key set`, () => {
      const enKeys = Object.keys(dict.en).sort()
      const esKeys = Object.keys(dict.es).sort()
      const jaKeys = Object.keys(dict.ja).sort()
      expect(esKeys).toEqual(enKeys)
      expect(jaKeys).toEqual(enKeys)
    })
  }
})
