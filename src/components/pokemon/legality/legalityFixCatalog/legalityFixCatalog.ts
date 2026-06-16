import type { I18nKey, Translator } from '../../../../core/i18n/i18n/i18n'

const LEGALITY_FIX_COPY: Record<
  string,
  { label: I18nKey; description: I18nKey }
> = {
  'reroll-pid-compatible': {
    label: 'fixRerollPidLabel',
    description: 'fixRerollPidDescription',
  },
  'sync-pid-derived-fields': {
    label: 'fixSyncPidFieldsLabel',
    description: 'fixSyncPidFieldsDescription',
  },
  'normalize-move-pp': {
    label: 'fixNormalizeMovePpLabel',
    description: 'fixNormalizeMovePpDescription',
  },
  'clear-ht-language': {
    label: 'fixClearHtLanguageLabel',
    description: 'fixClearHtLanguageDescription',
  },
  'clear-home-tracker': {
    label: 'fixClearHomeTrackerLabel',
    description: 'fixClearHomeTrackerDescription',
  },
  'reset-lgpe-spirit-mood': {
    label: 'fixResetLgpeSpiritMoodLabel',
    description: 'fixResetLgpeSpiritMoodDescription',
  },
  'match-encounter-origin': {
    label: 'fixMatchEncounterOriginLabel',
    description: 'fixMatchEncounterOriginDescription',
  },
  'match-encounter-ability': {
    label: 'fixMatchEncounterAbilityLabel',
    description: 'fixMatchEncounterAbilityDescription',
  },
  'replace-relearn-moves': {
    label: 'fixReplaceRelearnMovesLabel',
    description: 'fixReplaceRelearnMovesDescription',
  },
  'regenerate-from-encounter': {
    label: 'fixRegenerateFromEncounterLabel',
    description: 'fixRegenerateFromEncounterDescription',
  },
}

export function getLegalityFixCopy(fixId: string, t: Translator) {
  const copy = LEGALITY_FIX_COPY[fixId]
  if (!copy) {
    return {
      label: t('fixUnknownLabel'),
      description: t('fixUnknownDescription'),
    }
  }

  return {
    label: t(copy.label),
    description: t(copy.description),
  }
}
