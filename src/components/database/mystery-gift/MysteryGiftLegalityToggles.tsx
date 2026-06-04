import type { Translator } from '../../../core/i18n/i18n'
import type {
  MysteryGiftDatabaseSearchRequest,
  MysteryGiftLegalityCounts,
} from '../../../core/types/database'
import { BooleanField } from '../../ui/BooleanField'

export function MysteryGiftLegalityToggles({
  filters,
  legalityCounts,
  t,
  updateFilters,
}: {
  filters: MysteryGiftDatabaseSearchRequest
  legalityCounts: MysteryGiftLegalityCounts
  t: Translator
  updateFilters: (next: Partial<MysteryGiftDatabaseSearchRequest>) => void
}) {
  return (
    <>
      <BooleanField
        label={t('saveLegalityLegalWithCount', {
          count: legalityCounts.legal,
        })}
        value={filters.includeLegal}
        onChange={(includeLegal) => updateFilters({ includeLegal })}
      />
      <BooleanField
        label={t('saveLegalityUncertainWithCount', {
          count: legalityCounts.uncertain,
        })}
        value={filters.includeUncertain}
        onChange={(includeUncertain) => updateFilters({ includeUncertain })}
      />
      <BooleanField
        label={t('saveLegalityIllegalWithCount', {
          count: legalityCounts.illegal,
        })}
        value={filters.includeIllegal}
        onChange={(includeIllegal) => updateFilters({ includeIllegal })}
      />
    </>
  )
}
