import type { Translator } from '../../../core/i18n/i18n/i18n'
import { localizedText } from '../../../core/i18n/i18n/i18n'
import type { AbilityDetail, Language } from '../../../core/types/index/index'
import { AbilityInfoTooltip } from '../../pokemon/ability/AbilityInfoTooltip/AbilityInfoTooltip'

export type ModifierBadge = {
  label: string
  kind: string
  slug?: string
}

function findAbilityDesc(
  slug: string,
  abilityDetailsBySlug: Map<string, AbilityDetail>,
  language: Language,
): string | null {
  const ab = abilityDetailsBySlug.get(slug)
  return ab ? localizedText(ab.current?.effect?.description, language) : null
}

export function MoveCardModifiers({
  badges,
  abilityDetailsBySlug,
  language,
  t,
}: {
  badges: ModifierBadge[]
  abilityDetailsBySlug: Map<string, AbilityDetail>
  language: Language
  t: Translator
}) {
  if (badges.length === 0) return null
  return (
    <div className="mt-4">
      <div className="mb-1 text-[0.65rem] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
        {t('moveModifiedBy')}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {badges.map((modifier) => {
          const badge = (
            <span
              key={modifier.label}
              className="rounded border border-black/10 bg-white/60 px-2 py-0.5 text-xs font-medium text-stone-600 dark:border-white/10 dark:bg-white/[0.06] dark:text-stone-300"
            >
              {modifier.label}
            </span>
          )
          if (modifier.kind === 'ability' && modifier.slug) {
            const desc = findAbilityDesc(
              modifier.slug,
              abilityDetailsBySlug,
              language,
            )
            return desc ? (
              <AbilityInfoTooltip key={modifier.label} text={desc}>
                {badge}
              </AbilityInfoTooltip>
            ) : (
              badge
            )
          }
          return badge
        })}
      </div>
    </div>
  )
}
