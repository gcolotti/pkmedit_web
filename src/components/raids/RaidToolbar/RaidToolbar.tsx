import { Search } from 'lucide-react'

import type { I18nKey, Translator } from '../../../core/i18n/i18n/i18n'
import type { RaidListResponse } from '../../../core/types/saveFeature/saveFeature'
import {
  isSevenStarRelevant,
  type RaidFilter,
} from '../../../core/utils/raidDisplay/raidDisplay'
import { SegmentedToggle } from '../../ui/SegmentedToggle/SegmentedToggle'
import { getFilterOptions } from '../raidFocusedUtils/raidFocusedUtils'

const SEVEN_STAR_GROUP = '__seven_star__'

export function RaidToolbar({
  advanced,
  data,
  filter,
  groupKey,
  query,
  t,
  onAdvancedChange,
  onFilterChange,
  onGroupChange,
  onQueryChange,
}: {
  advanced: boolean
  data: RaidListResponse
  filter: RaidFilter
  groupKey: string
  query: string
  t: Translator
  onAdvancedChange: (value: boolean) => void
  onFilterChange: (value: RaidFilter) => void
  onGroupChange: (value: string) => void
  onQueryChange: (value: string) => void
}) {
  const groupOptions = [
    ...data.groups.map((group) => ({
      count: group.raids.length,
      label: t(group.labelKey as I18nKey),
      value: group.key,
    })),
    ...(data.sevenStar && data.sevenStar.raids.some(isSevenStarRelevant)
      ? [
          {
            count: data.sevenStar.raids.filter(isSevenStarRelevant).length,
            label: t('raidSevenStar'),
            value: SEVEN_STAR_GROUP,
          },
        ]
      : []),
  ]
  const filterOptions = getFilterOptions(data.saveKind, t)
  return (
    <div className="grid gap-3">
      <SegmentedToggle
        label={t('raidRegionTabs')}
        options={groupOptions}
        value={groupKey}
        onChange={onGroupChange}
      />
      <div className="grid gap-2 md:grid-cols-[minmax(12rem,1fr)_12rem_auto]">
        <label className="relative min-w-0">
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-2.5 text-stone-400"
            size={15}
          />
          <input
            className="field h-10 min-h-10 w-full pl-9 text-sm"
            placeholder={t('raidSearchPlaceholder')}
            value={query}
            onChange={(event) => onQueryChange(event.currentTarget.value)}
          />
        </label>
        <select
          aria-label={t('raidFilterLabel')}
          className="field h-10 min-h-10 text-sm"
          value={filter}
          onChange={(event) =>
            onFilterChange(event.currentTarget.value as RaidFilter)
          }
        >
          {filterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <label className="btn h-10 cursor-pointer gap-2 text-sm">
          <input
            checked={advanced}
            type="checkbox"
            onChange={(event) => onAdvancedChange(event.currentTarget.checked)}
          />
          {t('raidAdvancedMode')}
        </label>
      </div>
    </div>
  )
}
