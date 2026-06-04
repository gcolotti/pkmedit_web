import type { StateCreator } from 'zustand'

import { sameArceusResearchAction } from '../services/arceusResearchActionUtils'
import type { DraftState } from './draftStoreTypes'

type ArceusSlice = Pick<
  DraftState,
  | 'arceusResearchBulkDrafts'
  | 'arceusResearchDrafts'
  | 'arceusResearchStatus'
  | 'applyArceusResearchAction'
  | 'revertArceusResearchAction'
  | 'revertArceusResearchBulk'
  | 'setArceusResearchStatus'
  | 'toggleArceusResearchBulk'
>

export const createArceusResearchSlice: StateCreator<
  DraftState,
  [],
  [],
  ArceusSlice
> = (set) => ({
  arceusResearchBulkDrafts: [],
  arceusResearchDrafts: [],
  arceusResearchStatus: null,
  setArceusResearchStatus: (arceusResearchStatus) =>
    set({ arceusResearchStatus }),
  applyArceusResearchAction: (key) =>
    set((state) => ({
      arceusResearchDrafts: state.arceusResearchDrafts.some((draft) =>
        sameArceusResearchAction(draft, key),
      )
        ? state.arceusResearchDrafts
        : [...state.arceusResearchDrafts, key],
    })),
  revertArceusResearchAction: (key) =>
    set((state) => ({
      arceusResearchDrafts: state.arceusResearchDrafts.filter(
        (draft) => !sameArceusResearchAction(draft, key),
      ),
    })),
  toggleArceusResearchBulk: (action) =>
    set((state) => ({
      arceusResearchBulkDrafts: state.arceusResearchBulkDrafts.includes(action)
        ? state.arceusResearchBulkDrafts.filter((value) => value !== action)
        : [...state.arceusResearchBulkDrafts, action],
    })),
  revertArceusResearchBulk: (action) =>
    set((state) => ({
      arceusResearchBulkDrafts: state.arceusResearchBulkDrafts.filter(
        (value) => value !== action,
      ),
    })),
})
