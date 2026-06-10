import { localizedText } from '../../../core/i18n/i18n/i18n'
import { getCatalogEntryOptionStyle } from '../../../core/utils/catalogStyle/catalogStyle'
import { getMoveEffectChanges } from '../../../core/utils/generationData/generationData'
import {
  renderCategoryStat,
  renderMoveEffectInCombat,
} from '../../../core/utils/generationRendering/generationRendering'
import { getActiveFlags } from '../../../core/utils/moveFlags/moveFlags'
import {
  abilityModifierLabel,
  formatAccuracy,
  formatNum,
  formatPriority,
  humanizeSlug,
  itemModifierLabel,
} from '../../../core/utils/moveFormatters/moveFormatters'
import {
  extractSecondaryEffect,
  formatStructuredSecondaryEffects,
  getSourceUrls,
} from '../../../core/utils/moveParsers/moveParsers'
import {
  renderEffect,
  renderStat,
} from '../../../core/utils/moveRenderers/moveRenderers'
import { TypeIcon } from '../../ui/TypeIcon/TypeIcon'
import { MoveCardFlags } from '../MoveCardFlags/MoveCardFlags'
import { MoveCardModifiers } from '../MoveCardModifiers/MoveCardModifiers'
import { MoveCardSecondaryEffects } from '../MoveCardSecondaryEffects/MoveCardSecondaryEffects'
import { MoveCardSources } from '../MoveCardSources/MoveCardSources'
import type { MoveDetailCardProps } from '../MoveDetailCardTypes/MoveDetailCardTypes'

export function MoveDetailCard({
  detail,
  entry,
  basePpOverride,
  language,
  legal,
  abilityDetailsBySlug,
  t,
}: MoveDetailCardProps) {
  const current = detail?.current
  const currentEffect = current?.effect
  const effectInCombat = detail
    ? (localizedText(currentEffect?.description, language) ??
        localizedText(currentEffect?.short, language)) ||
      null
    : null
  const effectOutOfCombat =
    localizedText(currentEffect?.outOfBattle, language) ?? null
  const activeFlags = detail ? getActiveFlags(detail) : []
  const power = current?.power ?? entry.power ?? null
  const accuracy = current?.accuracy ?? entry.accuracy ?? null
  const category = current?.categoryId ?? entry.category ?? null
  const basePp = basePpOverride ?? current?.pp ?? entry.basePp
  const priority = current?.priority ?? 0
  const structuredSecondary = formatStructuredSecondaryEffects(
    currentEffect?.secondaryEffects,
    language,
  )
  const fallbackSecondary = extractSecondaryEffect(effectInCombat ?? '')
  const secondaryEffects = structuredSecondary.length
    ? structuredSecondary
    : fallbackSecondary
      ? [fallbackSecondary]
      : []
  const modifiers = current?.modifiedBy
  const modifierBadges = [
    ...(modifiers?.abilities ?? []).map<{
      label: string
      kind: string
      slug: string
    }>((value) => ({
      label: abilityModifierLabel(value),
      kind: 'ability',
      slug: value,
    })),
    ...(modifiers?.items ?? []).map<{ label: string; kind: string }>(
      (value) => ({
        label: itemModifierLabel(value),
        kind: 'item',
      }),
    ),
    ...(modifiers?.terrain ?? []).map<{ label: string; kind: string }>(
      (value) => ({
        label: humanizeSlug(value),
        kind: 'terrain',
      }),
    ),
    ...(modifiers?.weather ?? []).map<{ label: string; kind: string }>(
      (value) => ({
        label: humanizeSlug(value),
        kind: 'weather',
      }),
    ),
  ]
  const sourceUrls = getSourceUrls(detail)
  const effectChanges = getMoveEffectChanges(detail, language)

  return (
    <div
      className="rounded-md border border-black/10 bg-white/70 p-4 shadow-sm dark:border-white/10 dark:bg-zinc-900/70"
      style={getCatalogEntryOptionStyle(entry, { legal: legal === true })}
    >
      <div className="flex min-w-0 items-center gap-3">
        <TypeIcon className="h-8 w-8 shrink-0" typeId={entry.typeId} />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <div className="min-w-0 text-xl font-extrabold leading-tight">
              {entry.name}
            </div>
            <MoveCardSources sourceUrls={sourceUrls} t={t} />
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {renderCategoryStat(category, t)}
        {renderStat(t('movePower'), formatNum(power))}
        {renderStat(t('moveAccuracy'), formatAccuracy(accuracy, t))}
        {renderStat(t('moveBasePp'), formatNum(basePp))}
        {renderStat(t('movePriority'), formatPriority(priority))}
      </div>

      <MoveCardSecondaryEffects effects={secondaryEffects} t={t} />

      <MoveCardModifiers
        badges={modifierBadges}
        abilityDetailsBySlug={abilityDetailsBySlug}
        language={language}
        t={t}
      />

      <MoveCardFlags flags={activeFlags} t={t} />

      <div className="mt-4 space-y-3">
        {renderMoveEffectInCombat(effectInCombat, effectChanges, t)}
        {effectOutOfCombat &&
          renderEffect(t('moveEffectOutOfCombat'), effectOutOfCombat, t)}
      </div>
    </div>
  )
}
