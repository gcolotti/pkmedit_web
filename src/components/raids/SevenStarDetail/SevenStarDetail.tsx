import type { ReactNode } from 'react'

import type { Translator } from '../../../core/i18n/i18n/i18n'
import type { SevenStarRaidEntry } from '../../../core/types/saveFeature/saveFeature'
import { UINT32_MAX } from '../../../core/utils/numberInput/numberInput'
import type { RaidHelpTopic } from '../../../core/utils/raidDisplay/raidDisplay'
import {
  getSevenStarEvent,
  getSevenStarLabel,
} from '../../../core/utils/raidDisplay/raidDisplay'
import { RaidBoolField } from '../RaidBoolField/RaidBoolField'
import { RaidDetailHeader } from '../RaidDetailHeader/RaidDetailHeader'
import { RaidHelpButton } from '../RaidHelpButton/RaidHelpButton'
import { RaidNumberField } from '../RaidNumberField/RaidNumberField'

export function SevenStarDetail({
  advanced,
  raid,
  t,
  onChange,
  onHelp,
}: {
  advanced: boolean
  raid: SevenStarRaidEntry
  t: Translator
  onChange: (patch: Partial<SevenStarRaidEntry>) => void
  onHelp: (topic: RaidHelpTopic) => void
}): ReactNode {
  const event = getSevenStarEvent(raid.identifier)
  return (
    <section className="grid gap-4">
      <RaidDetailHeader
        badges={[
          event
            ? t('raidEventPokemon', { pokemon: event.pokemon })
            : t('raidUnknownEvent'),
          event ? t('raidEventTeraType', { type: t(event.teraTypeKey) }) : null,
          event ? t('raidEventFirstRun', { date: event.firstRun }) : null,
        ]}
        title={getSevenStarLabel(raid, t)}
      />
      <div className="flex justify-end">
        <RaidHelpButton
          label={t('raidIdentifier')}
          topic="identifier"
          onHelp={onHelp}
        />
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <RaidBoolField
          falseLabel={t('no')}
          help="captured"
          label={t('raidCaptured')}
          trueLabel={t('yes')}
          value={raid.captured}
          onChange={(captured) => onChange({ captured })}
          onHelp={onHelp}
        />
        <RaidBoolField
          falseLabel={t('no')}
          help="defeated"
          label={t('raidDefeated')}
          trueLabel={t('yes')}
          value={raid.defeated}
          onChange={(defeated) => onChange({ defeated })}
          onHelp={onHelp}
        />
        {advanced && (
          <RaidNumberField
            help="identifier"
            label={t('raidIdentifier')}
            max={UINT32_MAX}
            min={0}
            value={raid.identifier}
            onChange={(identifier) => onChange({ identifier })}
            onHelp={onHelp}
          />
        )}
      </div>
    </section>
  )
}
