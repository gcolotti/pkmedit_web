import type { ReactNode } from 'react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { RaidEntry } from '../../../core/types/saveFeature/saveFeature'
import type { RaidHelpTopic } from '../../../core/utils/raidDisplay/raidDisplay'
import { getSwshBeamLabel } from '../../../core/utils/raidDisplay/raidDisplay'
import { AdvancedSection } from '../AdvancedSection/AdvancedSection'
import { RaidBoolField } from '../RaidBoolField/RaidBoolField'
import { RaidDetailHeader } from '../RaidDetailHeader/RaidDetailHeader'
import { DEN_TYPES } from '../RaidFormFields/RaidFormFields'
import { RaidNumberField } from '../RaidNumberField/RaidNumberField'
import { RaidSelectField } from '../RaidSelectField/RaidSelectField'
import { RaidTextField } from '../RaidTextField/RaidTextField'

type Props = {
  advanced: boolean
  raid: RaidEntry
  t: Translator
  onChange: (patch: Partial<RaidEntry>) => void
  onHelp: (topic: RaidHelpTopic) => void
}

export function SwshRaidDetail({
  advanced,
  raid,
  t,
  onChange,
  onHelp,
}: Props): ReactNode {
  const beam = getSwshBeamLabel(raid, t)
  return (
    <section className="grid gap-4">
      <RaidDetailHeader
        badges={[
          beam,
          raid.isWishingPiece ? t('raidWishingPiece') : null,
          raid.isEvent ? t('raidEvent') : null,
        ]}
        title={t('raidDenTitle', { id: raid.index + 1 })}
      />
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <RaidBoolField
          falseLabel={t('no')}
          help="denType"
          label={t('raidActive')}
          trueLabel={t('yes')}
          value={raid.isActive}
          onChange={(isActive) => onChange({ isActive })}
          onHelp={onHelp}
        />
        <RaidSelectField
          help="denType"
          label={t('raidDenType')}
          labelPrefix="raidDenType"
          options={DEN_TYPES}
          t={t}
          value={raid.denType ?? 'None'}
          onChange={(denType) => onChange({ denType })}
          onHelp={onHelp}
        />
        <RaidNumberField
          help="stars"
          label={t('raidStars')}
          max={5}
          min={1}
          value={(raid.stars ?? 0) + 1}
          onChange={(stars) => onChange({ stars: stars - 1 })}
          onHelp={onHelp}
        />
        <RaidBoolField
          falseLabel={t('no')}
          help="denType"
          label={t('raidWishingPiece')}
          trueLabel={t('yes')}
          value={raid.isWishingPiece}
          onChange={(isWishingPiece) => onChange({ isWishingPiece })}
          onHelp={onHelp}
        />
        <RaidBoolField
          falseLabel={t('no')}
          help="lp"
          label={t('raidWatts')}
          trueLabel={t('yes')}
          value={raid.wattsHarvested}
          onChange={(wattsHarvested) => onChange({ wattsHarvested })}
          onHelp={onHelp}
        />
      </div>
      {advanced && (
        <AdvancedSection t={t}>
          <RaidTextField
            help="hash"
            label={t('raidHash')}
            value={raid.hash ?? ''}
            onChange={(hash) => onChange({ hash })}
            onHelp={onHelp}
          />
          <RaidTextField
            help="seed"
            label={t('raidSeed')}
            value={raid.seed ?? ''}
            onChange={(seed) => onChange({ seed })}
            onHelp={onHelp}
          />
          <RaidNumberField
            help="randRoll"
            label={t('raidRandRoll')}
            max={100}
            min={1}
            value={raid.randRoll ?? 1}
            onChange={(randRoll) => onChange({ randRoll })}
            onHelp={onHelp}
          />
          <RaidNumberField
            help="flags"
            label={t('raidFlags')}
            max={255}
            min={0}
            value={raid.flags ?? 0}
            onChange={(flags) => onChange({ flags })}
            onHelp={onHelp}
          />
        </AdvancedSection>
      )}
    </section>
  )
}
