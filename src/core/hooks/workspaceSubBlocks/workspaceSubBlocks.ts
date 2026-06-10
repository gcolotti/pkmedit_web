import type {
  DonutDraft,
  DonutPocket,
  DonutPreview,
} from '../../types/donut/donut'
import type { ItemBag, SaveSectionStatus } from '../../types/index/index'
import type { RaidListResponse } from '../../types/saveFeature/saveFeature'
import type { TrainerInfo } from '../../types/trainer/trainer'

export function buildWorkspaceSubBlocks(workspace: {
  actions: {
    checkDraft: (focus?: boolean) => void
    openSelectedSave: (selectedSave: string) => void
    updateTrainerDraft: (trainer: TrainerInfo) => void
    updateItemsDraft: (items: ItemBag) => void
    addDonutDraft: (draft: DonutDraft) => void
    getDonuts: (sessionId: string) => Promise<DonutPocket>
    previewDonut: (
      berries: number[],
      berryName: number,
    ) => Promise<DonutPreview | null>
    updateRaidsDraft: (data: RaidListResponse) => void
    loadRaids: (sessionId: string) => void
  }
  state: {
    trainerBase: TrainerInfo | null
    trainerDraft: TrainerInfo | null
    trainerStatus: SaveSectionStatus
    itemsBase: ItemBag | null
    itemsDraft: ItemBag | null
    itemsStatus: SaveSectionStatus
    donutDrafts: DonutDraft[]
    raidsData: RaidListResponse | null
    raidsStatus: string
  }
}) {
  return {
    trainer: {
      base: workspace.state.trainerBase,
      draft: workspace.state.trainerDraft,
      current: workspace.state.trainerDraft ?? workspace.state.trainerBase,
      onChange: workspace.actions.updateTrainerDraft,
      status: workspace.state.trainerStatus,
    },
    items: {
      base: workspace.state.itemsBase,
      draft: workspace.state.itemsDraft,
      current: workspace.state.itemsDraft ?? workspace.state.itemsBase,
      onChange: workspace.actions.updateItemsDraft,
      status: workspace.state.itemsStatus,
    },
    donuts: {
      drafts: workspace.state.donutDrafts,
      onAdd: workspace.actions.addDonutDraft,
      onLoad: workspace.actions.getDonuts,
      onPreview: workspace.actions.previewDonut,
    },
    raids: {
      data: workspace.state.raidsData,
      status: workspace.state.raidsStatus,
      onChange: workspace.actions.updateRaidsDraft,
      onLoad: workspace.actions.loadRaids,
    },
  }
}
