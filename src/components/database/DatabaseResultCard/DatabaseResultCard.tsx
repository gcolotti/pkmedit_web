import { Egg, Sparkles } from 'lucide-react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import type {
  EncounterDatabaseEntry,
  MysteryGiftDatabaseEntry,
} from '../../../core/types/database/database'
import type { PokemonSummary } from '../../../core/types/pokemon/pokemon'
import { PokemonSprite } from '../../ui/PokemonSprite/PokemonSprite'
import { encounterTypes } from '../encounters/encounterTypes/encounterTypes'

type Entry = EncounterDatabaseEntry | MysteryGiftDatabaseEntry

export function DatabaseResultCard({
  active,
  entry,
  kind,
  onClick,
  t,
}: {
  active: boolean
  entry: Entry
  kind: 'encounter' | 'gift'
  onClick: () => void
  t: Translator
}) {
  const summary = toSummary(entry)
  const levelText =
    'levelMin' in entry
      ? entry.levelMin === entry.levelMax
        ? `${entry.levelMin}`
        : `${entry.levelMin}-${entry.levelMax}`
      : `${entry.level}`
  const subtitle =
    kind === 'encounter' && 'type' in entry
      ? `${formatEncounterType(entry.type, t)} - ${entry.versionName}`
      : 'title' in entry
        ? entry.title
        : entry.versionName
  const legalityClass =
    kind === 'gift' && 'saveLegality' in entry
      ? getSaveLegalityClass(entry.saveLegality)
      : ''
  const legalityLabel =
    kind === 'gift' && 'saveLegality' in entry
      ? formatSaveLegality(entry.saveLegality, t)
      : null

  return (
    <button
      aria-pressed={active}
      className={`surface-muted grid min-h-24 grid-cols-[4rem_minmax(0,1fr)] gap-3 rounded-md border p-2 text-left transition hover:border-lagoon ${legalityClass} ${active ? 'border-lagoon bg-lagoon/15 ring-2 ring-lagoon/25' : ''}`}
      type="button"
      onClick={onClick}
    >
      {legalityLabel ? <span className="sr-only">{legalityLabel}</span> : null}
      <div className="grid aspect-square place-items-center rounded bg-stone-950/10 dark:bg-stone-950/50">
        <PokemonSprite compact slot={summary} t={t} />
      </div>
      <div className="min-w-0">
        <div className="flex min-w-0 items-center gap-1">
          <span className="truncate text-sm font-black">
            {entry.speciesName}
          </span>
          {entry.shiny ? (
            <Sparkles className="shrink-0 text-rose-500" size={14} />
          ) : null}
          {entry.egg ? (
            <Egg className="shrink-0 text-stone-300" size={14} />
          ) : null}
        </div>
        <div className="truncate text-xs font-bold text-stone-300/80">
          {subtitle}
        </div>
        <div className="mt-1 flex flex-wrap gap-1 text-[11px] font-bold text-stone-300/75">
          <span className="rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">
            {t('levelShort', { value: levelText })}
          </span>
          <span className="rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">
            {t('generation', { generation: entry.generation })}
          </span>
          {'locationName' in entry && entry.locationName ? (
            <span className="max-w-28 truncate rounded bg-black/10 px-1.5 py-0.5 dark:bg-white/10">
              {entry.locationName}
            </span>
          ) : null}
        </div>
      </div>
    </button>
  )
}

function formatSaveLegality(status: string, t: Translator) {
  switch (status) {
    case 'legal':
      return t('saveLegalityLegal')
    case 'uncertain':
      return t('saveLegalityUncertain')
    case 'illegal':
      return t('saveLegalityIllegal')
    default:
      return ''
  }
}

function getSaveLegalityClass(status: string) {
  switch (status) {
    case 'legal':
      return 'bg-emerald-500/15 dark:bg-emerald-500/20'
    case 'uncertain':
      return 'bg-amber-400/20 dark:bg-amber-400/20'
    case 'illegal':
      return 'bg-rose-500/15 dark:bg-rose-500/20'
    default:
      return ''
  }
}

function formatEncounterType(type: string, t: Translator) {
  const match = encounterTypes.find(
    (encounterType) => encounterType.type === type,
  )
  return match ? t(match.label) : type
}

function toSummary(entry: Entry): PokemonSummary {
  return {
    slotId: `database-${entry.id}`,
    present: entry.species > 0,
    species: entry.species,
    speciesName: entry.speciesName,
    form: entry.form,
    level: 'level' in entry ? entry.level : entry.levelMin,
    shiny: entry.shiny,
    gender: 0,
    nature: 0,
    ability: 0,
    abilityNumber: 0,
    heldItem: 'heldItem' in entry ? entry.heldItem : 0,
    ball: 'ball' in entry ? entry.ball : 0,
    legal: true,
    alpha: false,
    egg: entry.egg,
    hasItem: 'heldItem' in entry && entry.heldItem > 0,
    legalSeverity: null,
  }
}
