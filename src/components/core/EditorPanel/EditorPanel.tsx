import { DatabaseFilterPanel } from '../../database/DatabaseFilterPanel/DatabaseFilterPanel'
import { PokemonEditorPanel } from '../../pokemon/PokemonEditorPanel/PokemonEditorPanel'
import type { EditorPanelProps } from '../EditorPanelProps/EditorPanelProps'
import { SaveEditorPanel } from '../SaveEditorPanel/SaveEditorPanel'

export function EditorPanel({
  arceusResearchStatus,
  catalogs,
  databaseBrowser,
  language,
  databaseView,
  donutDrafts,
  draft,
  itemBag,
  itemStatus,
  itemCatalog,
  languageCatalog,
  onCheck,
  onDatabaseViewChange,
  onAddDonut,
  onItemsChange,
  onLoadDonuts,
  onOpenArceusResearch,
  onOpenDonutCreator,
  onOpenRaidsEditor,
  onPokedexAction,
  onPreviewMetDateFixer,
  onQueueMetDateFixerDraft,
  pokedexDrafts,
  pokedexStatus,
  metDateFixerDraft,
  onSaveViewChange,
  underground,
  onCopyPokemon,
  onOpenMovesBrowser,
  onOpenTypeChart,
  onPastePokemon,
  onFormChange,
  onPokemonEditorTabChange,
  pokemonEditorTab,
  pokemonClipboard,
  saveGameVersion,
  onSpeciesChange,
  onTrainerChange,
  selectedSlotId,
  sessionId,
  setDraft,
  saveView,
  t,
  trainer,
  trainerStatus,
  view,
}: EditorPanelProps) {
  if (view === 'save') {
    return (
      <aside className="glass-panel rounded-lg p-4 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain">
        <SaveEditorPanel
          arceusResearchStatus={arceusResearchStatus}
          itemBag={itemBag}
          itemCatalog={itemCatalog}
          itemStatus={itemStatus}
          languageCatalog={languageCatalog}
          donutDrafts={donutDrafts}
          sessionId={sessionId}
          saveView={saveView}
          t={t}
          trainer={trainer}
          trainerStatus={trainerStatus}
          onAddDonut={onAddDonut}
          onItemsChange={onItemsChange}
          onLoadDonuts={onLoadDonuts}
          onOpenArceusResearch={onOpenArceusResearch}
          onOpenDonutCreator={onOpenDonutCreator}
          onOpenRaidsEditor={onOpenRaidsEditor}
          onPokedexAction={onPokedexAction}
          onPreviewMetDateFixer={onPreviewMetDateFixer}
          onQueueMetDateFixerDraft={onQueueMetDateFixerDraft}
          pokedexDrafts={pokedexDrafts}
          pokedexStatus={pokedexStatus}
          metDateFixerDraft={metDateFixerDraft}
          onSaveViewChange={onSaveViewChange}
          underground={underground}
          onTrainerChange={onTrainerChange}
        />
      </aside>
    )
  }

  if (view === 'database') {
    return (
      <aside className="glass-panel rounded-lg p-4 xl:min-h-0 xl:overflow-y-auto xl:overscroll-contain">
        <DatabaseFilterPanel
          catalogs={catalogs}
          databaseBrowser={databaseBrowser}
          databaseView={databaseView}
          t={t}
          onDatabaseViewChange={onDatabaseViewChange}
        />
      </aside>
    )
  }

  return (
    <aside className="glass-panel rounded-lg p-4 xl:flex xl:min-h-0 xl:flex-col xl:overflow-hidden">
      <PokemonEditorPanel
        catalogs={catalogs}
        draft={draft}
        language={language}
        saveGameVersion={saveGameVersion}
        selectedSlotId={selectedSlotId}
        sessionId={sessionId}
        setDraft={setDraft}
        t={t}
        onCheck={onCheck}
        onCopyPokemon={onCopyPokemon}
        onOpenMovesBrowser={onOpenMovesBrowser}
        onOpenTypeChart={onOpenTypeChart}
        onPastePokemon={onPastePokemon}
        activeTab={pokemonEditorTab}
        onActiveTabChange={onPokemonEditorTabChange}
        pokemonClipboard={pokemonClipboard}
        onFormChange={onFormChange}
        onSpeciesChange={onSpeciesChange}
      />
    </aside>
  )
}
