import { useEffect, useRef } from 'react'

// Debounced live legality recheck (staleness mix "C"). Whenever the selected
// draft changes, re-verify the slot after a pause so the Legality status and the
// party/boxes icon update without a manual check. The ref keeps `recheck` out of
// the dep array (its identity changes on every parent render).
export function useLiveLegalityRecheck(
  draft: unknown,
  recheck: () => void | Promise<void>,
) {
  const recheckRef = useRef(recheck)
  useEffect(() => {
    recheckRef.current = recheck
  }, [recheck])
  useEffect(() => {
    if (!draft) return
    const id = window.setTimeout(() => void recheckRef.current(), 500)
    return () => window.clearTimeout(id)
  }, [draft])
}
