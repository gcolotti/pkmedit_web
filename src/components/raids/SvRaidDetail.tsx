import type { ReactNode } from 'react'

import type { Translator } from '../../core/i18n/i18n'
import type { RaidEntry } from '../../core/types/saveFeature'
import { UINT32_MAX } from '../../core/utils/numberInput'
import type { RaidHelpTopic } from '../../core/utils/raidDisplay'
import { getSvRaidKindLabel } from '../../core/utils/raidDisplay'
import { AdvancedSection } from './AdvancedSection'
import { RaidBoolField } from './RaidBoolField'
import { RaidDetailHeader } from './RaidDetailHeader'
import { CONTENT_TYPES } from './RaidFormFields'
import { RaidNumberField } from './RaidNumberField'
import { RaidSelectField } from './RaidSelectField'
import { RaidTextField } from './RaidTextField'

type Props = {
  advanced: boolean
  raid: RaidEntry
  t: Translator
  onChange: (patch: Partial<RaidEntry>) => void
  onHelp: (topic: RaidHelpTopic) => void
}

export function SvRaidDetail({
  advanced,
  raid,
  t,
  onChange,
  onHelp,
}: Props): ReactNode {
  const kind = getSvRaidKindLabel(raid.content, t)
  return (
    <section className="grid gap-4">
      <RaidDetailHeader
        badges={[
          kind,
          raid.scenePointName ?? t('raidUnknownLocation'),
          raid.isClaimedLeaguePoints === false ? t('raidLpPending') : null,
        ]}
        title={t('raidCrystalTitle', { id: raid.index + 1 })}
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <RaidBoolField
          falseLabel={t('no')}
          help="content"
          label={t('raidEnabled')}
          trueLabel={t('yes')}
          value={raid.isEnabled}
          onChange={(isEnabled) => onChange({ isEnabled })}
          onHelp={onHelp}
        />
        <RaidSelectField
          help="content"
          label={t('raidContent')}
          labelPrefix="raidContentType"
          options={CONTENT_TYPES}
          t={t}
          value={raid.content ?? 'Base05'}
          onChange={(content) => onChange({ content })}
          onHelp={onHelp}
        />
        <RaidBoolField
          falseLabel={t('no')}
          help="lp"
          label={t('raidClaimedLp')}
          trueLabel={t('yes')}
          value={raid.isClaimedLeaguePoints}
          onChange={(isClaimedLeaguePoints) =>
            onChange({ isClaimedLeaguePoints })
          }
          onHelp={onHelp}
        />
        <RaidTextField
          help="seed"
          label={t('raidSeed')}
          value={raid.seed ?? ''}
          onChange={(seed) => onChange({ seed })}
          onHelp={onHelp}
        />
      </div>
      {advanced && (
        <AdvancedSection t={t}>
          <RaidNumberField
            help="areaId"
            label={t('raidArea')}
            max={UINT32_MAX}
            min={0}
            value={raid.areaId ?? 0}
            onChange={(areaId) => onChange({ areaId })}
            onHelp={onHelp}
          />
          <RaidNumberField
            help="lotteryGroup"
            label={t('raidLotteryGroup')}
            max={UINT32_MAX}
            min={0}
            value={raid.lotteryGroup ?? 0}
            onChange={(lotteryGroup) => onChange({ lotteryGroup })}
            onHelp={onHelp}
          />
          <RaidNumberField
            help="spawnPointId"
            label={t('raidSpawnPoint')}
            max={UINT32_MAX}
            min={0}
            value={raid.spawnPointId ?? 0}
            onChange={(spawnPointId) => onChange({ spawnPointId })}
            onHelp={onHelp}
          />
          <RaidNumberField
            help="flags"
            label={t('raidUnused')}
            max={UINT32_MAX}
            min={0}
            value={raid.unused ?? 0}
            onChange={(unused) => onChange({ unused })}
            onHelp={onHelp}
          />
        </AdvancedSection>
      )}
    </section>
  )
}
