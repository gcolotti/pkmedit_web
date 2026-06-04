import type { RaidFocusedEditorPageProps } from '../../../core/types/raid/raid'
import { getRaidHelpContent } from '../../../core/utils/raidDisplay/raidDisplay'
import { FieldHelpDialog } from '../../core/focused/FieldHelpDialog/FieldHelpDialog'
import { FocusedEditorShell } from '../../core/focused/FocusedEditorShell/FocusedEditorShell'
import { RaidFocusedBody } from '../RaidFocusedBody/RaidFocusedBody'
import { RaidToolbar } from '../RaidToolbar/RaidToolbar'
import { useRaidEditorState } from '../useRaidEditorState/useRaidEditorState'

export function RaidFocusedEditorPage({
  data,
  sessionId,
  status,
  t,
  onBack,
  onChange,
  onLoad,
}: RaidFocusedEditorPageProps) {
  const {
    advanced,
    effectiveSelection,
    filter,
    helpTopic,
    normalizedGroupKey,
    query,
    selectedRaid,
    selectedSevenStar,
    setAdvanced,
    setActiveGroupKey,
    setFilter,
    setHelpTopic,
    setQuery,
    setSelection,
    summary,
    updateRaid,
    updateSevenStar,
    visibleRaids,
    visibleSevenStar,
  } = useRaidEditorState(data, sessionId, t, onChange, onLoad)

  const toolbar = data ? (
    <RaidToolbar
      advanced={advanced}
      data={data}
      filter={filter}
      groupKey={normalizedGroupKey}
      query={query}
      t={t}
      onAdvancedChange={setAdvanced}
      onFilterChange={setFilter}
      onGroupChange={(groupKey) => {
        setActiveGroupKey(groupKey)
        setSelection(null)
      }}
      onQueryChange={setQuery}
    />
  ) : null

  return (
    <FocusedEditorShell
      backLabel={t('backToSaveEditor')}
      metrics={
        summary
          ? [
              {
                label: t('raidActive'),
                value: `${summary.active}/${summary.total}`,
              },
              { label: t('raidEvent'), value: summary.event },
              {
                label:
                  data?.saveKind === 'swsh'
                    ? t('raidWishingPiece')
                    : t('raidLpPending'),
                value:
                  data?.saveKind === 'swsh' ? summary.wish : summary.lpPending,
              },
              { label: t('raidUnknownEventShort'), value: summary.unknown },
            ]
          : undefined
      }
      subtitle={
        data?.saveKind === 'swsh'
          ? t('raidFocusedSubtitleSwsh')
          : data?.saveKind === 'sv'
            ? t('raidFocusedSubtitleSv')
            : undefined
      }
      title={t('raids')}
      toolbar={toolbar}
      onBack={onBack}
    >
      {sessionId ? (
        <RaidFocusedBody
          advanced={advanced}
          data={data}
          status={status}
          t={t}
          visibleRaids={visibleRaids}
          visibleSevenStar={visibleSevenStar}
          selection={effectiveSelection}
          selectedRaid={selectedRaid}
          selectedSevenStar={selectedSevenStar}
          onRaidChange={updateRaid}
          onSelect={setSelection}
          onSevenStarChange={updateSevenStar}
          onHelp={setHelpTopic}
        />
      ) : (
        <div className="p-8 text-center text-sm text-stone-500">
          {t('noSaveLoaded')}
        </div>
      )}
      {helpTopic && (
        <FieldHelpDialog
          allowedValuesLabel={t('fieldHelpAllowedValues')}
          closeLabel={t('close')}
          content={getRaidHelpContent(helpTopic, t)}
          exampleLabel={t('fieldHelpExample')}
          riskLabel={t('fieldHelpRisk')}
          onClose={() => setHelpTopic(null)}
        />
      )}
    </FocusedEditorShell>
  )
}
