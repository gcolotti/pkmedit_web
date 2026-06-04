import { Fragment } from 'react'

import type { Translator } from '../../../../core/i18n/i18n/i18n'
import type { PokemonEffortKind } from '../../../../core/types/index/index'
import type {
  PokemonHyperTrain,
  PokemonStats,
} from '../../../../core/types/pokemon/pokemon'
import type { NatureModifier } from '../../../../core/utils/natureData/natureData'
import { getMaxGv } from '../../../../core/utils/statCalc/statCalc'
import { EditorGroup } from '../../../core/EditorGroup/EditorGroup'
import { useFieldIssue } from '../../../core/forms/FieldIssueContext/FieldIssueContext'
import { EffortInputGroup } from '../StatsEffortInputGroup/StatsEffortInputGroup'
import {
  effortLabelKey,
  getStatsGridCols,
  headerClassName,
  readOnlyClassName,
  statKeys,
  suggestGvs,
  updateEffortStats,
} from '../StatsGroupControls/StatsGroupControls'
import { IvInputGroup } from '../StatsIvInputGroup/StatsIvInputGroup'
import { StatsTotalRow } from '../StatsTotalRow/StatsTotalRow'

export function StatsGroup({
  baseStats,
  calculatedStats,
  effortKind,
  evs,
  glowKeys,
  hyperTrainedIvs,
  hyperTrainingAvailable,
  ivs,
  maxEv,
  maxTotalEv,
  onEvsChange,
  onHyperTrainChange,
  onIvsChange,
  natureModifier,
  t,
}: {
  baseStats: PokemonStats
  calculatedStats: PokemonStats
  effortKind: PokemonEffortKind
  evs: PokemonStats
  glowKeys?: ReadonlySet<keyof PokemonStats>
  hyperTrainedIvs: PokemonHyperTrain
  hyperTrainingAvailable: boolean
  ivs: PokemonStats
  maxEv: number
  maxTotalEv: number
  natureModifier: NatureModifier
  t: Translator
  onEvsChange: (stats: PokemonStats) => void
  onHyperTrainChange: (ht: PokemonHyperTrain) => void
  onIvsChange: (stats: PokemonStats) => void
}) {
  const ivIssue = useFieldIssue('ivs')
  const evIssue = useFieldIssue('evs')
  const isGv = effortKind === 'gv'
  const isStatExp = effortKind === 'statExp'
  const effortLabel = t(effortLabelKey[effortKind])
  const evTotal = statKeys.reduce((sum, key) => sum + evs[key], 0)
  const modifier = natureModifier
  const gridCols = getStatsGridCols(hyperTrainingAvailable)

  const handleIvChange = (key: keyof PokemonStats, value: number) => {
    onIvsChange({ ...ivs, [key]: value })
    if (isGv) {
      const cap = getMaxGv(value)
      if (evs[key] > cap) onEvsChange({ ...evs, [key]: cap })
    }
  }

  const handleSuggestGvs = isGv ? () => onEvsChange(suggestGvs(ivs)) : undefined

  return (
    <EditorGroup title={t('stats')}>
      <div className="sm:col-span-2">
        <div className={`grid items-center gap-x-1.5 gap-y-1 ${gridCols}`}>
          <div aria-hidden="true" />
          <div className={headerClassName}>{t('baseStat')}</div>
          {hyperTrainingAvailable ? (
            <div className={`${headerClassName} col-span-2`}>{t('ivs')}</div>
          ) : (
            <div className={headerClassName}>{t('ivs')}</div>
          )}
          <div className={`${headerClassName} col-span-3`}>{effortLabel}</div>
          <div className={headerClassName}>{t('finalStat')}</div>

          {statKeys.map((key) => (
            <Fragment key={key}>
              <div
                className={`label min-w-0 truncate text-[0.65rem]${ivIssue.labelClassName || evIssue.labelClassName} ${modifier?.up === key ? '!text-red-400' : modifier?.down === key ? '!text-sky-400' : ''}`}
              >
                {t(key)}
                {modifier?.up === key && '↑'}
                {modifier?.down === key && '↓'}
              </div>
              <div className={readOnlyClassName}>{baseStats[key]}</div>
              <IvInputGroup
                fieldClassName={ivIssue.fieldClassName}
                hyperTrained={hyperTrainedIvs[key]}
                hyperTrainingAvailable={hyperTrainingAvailable}
                hyperTrainLabel={`${t('hyperTrainStat')} ${t(key)}`}
                invalid={ivIssue.invalid}
                label={`${t(key)} ${t('ivs')}`}
                perfectLabel={`${t('perfectIv')} ${t(key)}`}
                value={ivs[key]}
                onHyperTrainChange={() =>
                  onHyperTrainChange({
                    ...hyperTrainedIvs,
                    [key]: !hyperTrainedIvs[key],
                  })
                }
                onValueChange={(value) => handleIvChange(key, value)}
              />
              <EffortInputGroup
                fieldClassName={evIssue.fieldClassName}
                invalid={evIssue.invalid}
                label={`${t(key)} ${effortLabel}`}
                max={isGv ? getMaxGv(ivs[key]) : maxEv}
                maxLabel={`${t('maxShort')} ${effortLabel} ${t(key)}`}
                maxText={t('maxShort')}
                minLabel={`${t('minShort')} ${effortLabel} ${t(key)}`}
                minText={t('minShort')}
                value={evs[key]}
                onValueChange={(value) =>
                  onEvsChange(updateEffortStats(evs, key, value, isStatExp))
                }
              />
              <div
                className={`${readOnlyClassName} ${glowKeys?.has(key) ? 'stat-corrected-glow' : ''}`}
              >
                {calculatedStats[key]}
              </div>
            </Fragment>
          ))}
          <StatsTotalRow
            evTotal={evTotal}
            hyperTrainAllLabel={t('hyperTrainAll')}
            hyperTrainingAvailable={hyperTrainingAvailable}
            isGv={isGv}
            ivs={ivs}
            maxTotalEv={maxTotalEv}
            t={t}
            onHyperTrainAll={onHyperTrainChange}
            onSuggestGvs={handleSuggestGvs}
          />
        </div>
      </div>
    </EditorGroup>
  )
}
