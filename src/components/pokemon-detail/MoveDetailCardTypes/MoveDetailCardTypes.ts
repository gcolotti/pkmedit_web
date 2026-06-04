import type { Translator } from '../../../core/i18n/i18n/i18n'
import type {
  AbilityDetail,
  CatalogEntry,
  Language,
  MoveDetail,
} from '../../../core/types/index/index'

export type MoveDetailCardProps = {
  detail: MoveDetail | null | undefined
  entry: CatalogEntry
  basePpOverride?: number
  language: Language
  legal: boolean | null
  abilityDetailsBySlug: Map<string, AbilityDetail>
  t: Translator
}
