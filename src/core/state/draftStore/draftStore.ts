import { create } from 'zustand'

import { samePokedexAction } from '../../services/pokedexActionUtils/pokedexActionUtils'
import { createArceusResearchSlice } from '../arceusResearchSlice/arceusResearchSlice'
import type {
  DraftState,
  NullableUpdater,
  Updater,
} from '../draftStoreTypes/draftStoreTypes'
import { emptyDraftSlices } from '../draftStoreTypes/draftStoreTypes'

function applyUpdater<T>(current: T, updater: Updater<T>): T {
  return typeof updater === 'function'
    ? (updater as (value: T) => T)(current)
    : updater
}

function applyNullableUpdater<T>(
  current: T | null,
  updater: NullableUpdater<T>,
): T | null {
  return typeof updater === 'function'
    ? (updater as (value: T | null) => T | null)(current)
    : updater
}

export const useDraftStore = create<DraftState>((set, get, store) => ({
  ...emptyDraftSlices,
  ...createArceusResearchSlice(set, get, store),
  setPokemonDrafts: (updater) =>
    set((state) => ({
      pokemonDrafts: applyUpdater(state.pokemonDrafts, updater),
    })),
  setBaseDetails: (updater) =>
    set((state) => ({ baseDetails: applyUpdater(state.baseDetails, updater) })),
  setDraft: (id, updater) =>
    set((state) => {
      const next = applyNullableUpdater(
        state.pokemonDrafts[id] ?? null,
        updater,
      )
      if (!next) return {}
      return { pokemonDrafts: { ...state.pokemonDrafts, [id]: next } }
    }),
  setBaseDetail: (id, detail) =>
    set((state) => ({
      baseDetails: { ...state.baseDetails, [id]: detail },
    })),
  setDraftViolations: (updater) =>
    set((state) => ({
      draftViolations: applyUpdater(state.draftViolations, updater),
    })),
  setTrainerDraft: (trainerDraft) => set({ trainerDraft }),
  setItemsDraft: (itemsDraft) => set({ itemsDraft }),
  setUndergroundDraft: (undergroundDraft) => set({ undergroundDraft }),
  setRaidsDraft: (raidsDraft) => set({ raidsDraft }),
  setDatabasePreview: (databasePreview) => set({ databasePreview }),
  setMysteryGiftDrafts: (updater) =>
    set((state) => ({
      mysteryGiftDrafts: applyUpdater(state.mysteryGiftDrafts, updater),
    })),
  addMysteryGiftDraft: (draft) =>
    set((state) => ({
      mysteryGiftDrafts: state.mysteryGiftDrafts.some(
        (gift) => gift.entry.id === draft.entry.id,
      )
        ? state.mysteryGiftDrafts
        : [...state.mysteryGiftDrafts, draft],
    })),
  revertMysteryGiftDraft: (id) =>
    set((state) => ({
      mysteryGiftDrafts: state.mysteryGiftDrafts.filter(
        (gift) => gift.entry.id !== id,
      ),
    })),
  setReplacementDrafts: (updater) =>
    set((state) => ({
      replacementDrafts: applyUpdater(state.replacementDrafts, updater),
    })),
  setReplacementDraft: (id, draft) =>
    set((state) => ({
      replacementDrafts: { ...state.replacementDrafts, [id]: draft },
    })),
  clearReplacementDraft: (id) =>
    set((state) => {
      if (!(id in state.replacementDrafts)) return {}
      const copy = { ...state.replacementDrafts }
      delete copy[id]
      return { replacementDrafts: copy }
    }),
  setPokedexDrafts: (updater) =>
    set((state) => ({
      pokedexDrafts: applyUpdater(state.pokedexDrafts, updater),
    })),
  setPokedexStatus: (pokedexStatus) => set({ pokedexStatus }),
  applyPokedexAction: (key) =>
    set((state) => ({
      pokedexDrafts: state.pokedexDrafts.some((draft) =>
        samePokedexAction(draft, key),
      )
        ? state.pokedexDrafts
        : [...state.pokedexDrafts, key],
    })),
  revertPokedexAction: (key) =>
    set((state) => ({
      pokedexDrafts: state.pokedexDrafts.filter(
        (draft) => !samePokedexAction(draft, key),
      ),
    })),
  setDonutDrafts: (updater) =>
    set((state) => ({ donutDrafts: applyUpdater(state.donutDrafts, updater) })),
  addDonutDraft: (draft) =>
    set((state) => ({ donutDrafts: [...state.donutDrafts, draft] })),
  revertDonutDraft: (id) =>
    set((state) => ({
      donutDrafts: state.donutDrafts.filter((draft) => draft.id !== id),
    })),
  setMetDateFixerDraft: (metDateFixerDraft) => set({ metDateFixerDraft }),
  resetDrafts: () => set(emptyDraftSlices),
  revertAll: () =>
    set({
      pokemonDrafts: {},
      draftViolations: [],
      trainerDraft: null,
      itemsDraft: null,
      undergroundDraft: null,
      donutDrafts: [],
      raidsDraft: null,
      mysteryGiftDrafts: [],
      replacementDrafts: {},
      pokedexDrafts: [],
      pokedexStatus: null,
      arceusResearchStatus: null,
      arceusResearchDrafts: [],
      arceusResearchBulkDrafts: [],
      metDateFixerDraft: null,
    }),
}))
