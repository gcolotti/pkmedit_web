import type {
  EncounterDatabaseSearchRequest,
  EncounterDatabaseSearchResponse,
  MysteryGiftDatabaseSearchRequest,
  MysteryGiftDatabaseSearchResponse,
} from '../types/database'
import { useEncounterBrowser } from './useEncounterBrowser'
import { useMysteryGiftBrowser } from './useMysteryGiftBrowser'

export type DatabaseFilterTab = 'general' | 'advanced' | 'criteria' | 'settings'

export function useDatabaseBrowser({
  onSearchEncounters,
  onSearchMysteryGifts,
  saveGameVersion,
  saveGeneration,
}: {
  onSearchEncounters: (
    request: EncounterDatabaseSearchRequest,
  ) => Promise<EncounterDatabaseSearchResponse>
  onSearchMysteryGifts: (
    request: MysteryGiftDatabaseSearchRequest,
  ) => Promise<MysteryGiftDatabaseSearchResponse>
  saveGameVersion: number
  saveGeneration: number
}) {
  const encounters = useEncounterBrowser(onSearchEncounters, saveGameVersion)
  const mysteryGifts = useMysteryGiftBrowser(
    onSearchMysteryGifts,
    saveGeneration,
  )

  return { encounters, mysteryGifts }
}

export type DatabaseBrowserState = ReturnType<typeof useDatabaseBrowser>
