import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type {
  PokemonHyperTrain,
  PokemonStats,
} from '../../../../core/types/pokemon/pokemon'
import { HyperTrainAllButton } from '../HyperTrainAllButton/HyperTrainAllButton'

export function StatsTotalRow({
  evTotal,
  hyperTrainAllLabel,
  hyperTrainingAvailable,
  isGv,
  ivs,
  maxTotalEv,
  onHyperTrainAll,
  onSuggestGvs,
  t,
}: {
  evTotal: number
  hyperTrainAllLabel: string
  hyperTrainingAvailable: boolean
  isGv: boolean
  ivs: PokemonStats
  maxTotalEv: number
  onHyperTrainAll: (ht: PokemonHyperTrain) => void
  onSuggestGvs: (() => void) | undefined
  t: Translator
}) {
  const totalClassName =
    evTotal > maxTotalEv
      ? 'border-rose-500/50 bg-rose-500/10 text-rose-600 dark:border-rose-300/40 dark:text-rose-200'
      : evTotal === maxTotalEv
        ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:border-emerald-300/40 dark:text-emerald-200'
        : 'border-black/10 bg-white/60 text-stone-500 dark:border-white/10 dark:bg-white/5 dark:text-stone-400'

  return (
    <>
      <div aria-hidden="true" />
      <div aria-hidden="true" />
      {hyperTrainingAvailable ? (
        <div className="col-span-2 w-[calc(100%-0.375rem)]">
          <HyperTrainAllButton
            ivs={ivs}
            label={hyperTrainAllLabel}
            onChange={onHyperTrainAll}
          />
        </div>
      ) : (
        <div aria-hidden="true" />
      )}
      {isGv ? (
        <button
          className="col-span-3 flex h-7 w-[calc(100%-0.75rem)] min-w-0 cursor-pointer items-center justify-center rounded border border-black/10 bg-white/60 px-2 text-center text-[0.65rem] font-bold uppercase text-stone-500 transition hover:border-stone-400 hover:text-stone-600 dark:border-white/10 dark:bg-white/5 dark:text-stone-400 dark:hover:text-stone-300"
          type="button"
          onClick={onSuggestGvs}
        >
          {t('suggestGvs')}
        </button>
      ) : (
        <div
          aria-label={`${t('evTotal')} ${evTotal}/${maxTotalEv}`}
          className={`col-span-3 flex h-7 w-[calc(100%-0.75rem)] min-w-0 items-center justify-center rounded border px-2 text-center text-[0.65rem] font-bold tabular-nums ${totalClassName}`}
        >
          <span className="mr-1 uppercase">{t('evTotal')}</span>
          <span>
            {evTotal}/{maxTotalEv}
          </span>
        </div>
      )}
      <div aria-hidden="true" />
    </>
  )
}
