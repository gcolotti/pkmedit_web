// The arceusResearchSlice is composed into the draftStore; these tests
// exercise the slice through the real store to verify the slice's actions.

import { act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'

import type { ArceusResearchBulkAction } from '../../types/index/index'
import { useDraftStore } from '../draftStore/draftStore'

const reset = () =>
  useDraftStore.setState({
    arceusResearchStatus: null,
    arceusResearchDrafts: [],
    arceusResearchBulkDrafts: [],
  })

describe('createArceusResearchSlice (via useDraftStore)', () => {
  beforeEach(reset)

  it('initializes with empty drafts and null status', () => {
    reset()
    const s = useDraftStore.getState()
    expect(s.arceusResearchStatus).toBeNull()
    expect(s.arceusResearchDrafts).toEqual([])
    expect(s.arceusResearchBulkDrafts).toEqual([])
  })

  it('setArceusResearchStatus replaces the status', () => {
    reset()
    const status = { unlocked: 1 } as never
    act(() => useDraftStore.getState().setArceusResearchStatus(status))
    expect(useDraftStore.getState().arceusResearchStatus).toBe(status)
  })

  it('applyArceusResearchAction adds a new action', () => {
    act(() =>
      useDraftStore
        .getState()
        .applyArceusResearchAction({ species: 1, action: 'completeTask' }),
    )
    expect(useDraftStore.getState().arceusResearchDrafts).toEqual([
      { species: 1, action: 'completeTask' },
    ])
  })

  it('applyArceusResearchAction is idempotent for the same target', () => {
    const target: { species: number; action: 'completeTask' } = {
      species: 1,
      action: 'completeTask',
    }
    act(() => useDraftStore.getState().applyArceusResearchAction(target))
    act(() => useDraftStore.getState().applyArceusResearchAction(target))
    expect(useDraftStore.getState().arceusResearchDrafts).toEqual([target])
  })

  it('revertArceusResearchAction removes the target', () => {
    const a: { species: number; action: 'completeTask' } = {
      species: 1,
      action: 'completeTask',
    }
    const b: { species: number; action: 'completeTask' } = {
      species: 2,
      action: 'completeTask',
    }
    act(() => useDraftStore.getState().applyArceusResearchAction(a))
    act(() => useDraftStore.getState().applyArceusResearchAction(b))
    act(() => useDraftStore.getState().revertArceusResearchAction(a))
    expect(useDraftStore.getState().arceusResearchDrafts).toEqual([b])
  })

  it('toggleArceusResearchBulk adds and removes the action', () => {
    act(() =>
      useDraftStore
        .getState()
        .toggleArceusResearchBulk('catch-25' as ArceusResearchBulkAction),
    )
    expect(useDraftStore.getState().arceusResearchBulkDrafts).toEqual([
      'catch-25',
    ])
    act(() =>
      useDraftStore
        .getState()
        .toggleArceusResearchBulk('catch-25' as ArceusResearchBulkAction),
    )
    expect(useDraftStore.getState().arceusResearchBulkDrafts).toEqual([])
  })

  it('revertArceusResearchBulk removes a specific action', () => {
    act(() =>
      useDraftStore
        .getState()
        .toggleArceusResearchBulk('catch-25' as ArceusResearchBulkAction),
    )
    act(() =>
      useDraftStore
        .getState()
        .toggleArceusResearchBulk('catch-150' as ArceusResearchBulkAction),
    )
    act(() =>
      useDraftStore
        .getState()
        .revertArceusResearchBulk('catch-25' as ArceusResearchBulkAction),
    )
    expect(useDraftStore.getState().arceusResearchBulkDrafts).toEqual([
      'catch-150',
    ])
  })
})
