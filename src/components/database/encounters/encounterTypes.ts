import type { I18nKey } from '../../../core/i18n/i18n'

export const encounterTypes = [
  { type: 'Egg', label: 'encounterTypeEgg' },
  { type: 'Mystery', label: 'encounterTypeMystery' },
  { type: 'Static', label: 'encounterTypeStatic' },
  { type: 'Trade', label: 'encounterTypeTrade' },
  { type: 'Slot', label: 'encounterTypeSlot' },
] as const satisfies Array<{ type: string; label: I18nKey }>
