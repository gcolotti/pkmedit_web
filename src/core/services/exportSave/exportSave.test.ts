import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { saveBlob } from './exportSave'

const makeBlob = (text = 'save-bytes') => new Blob([text])

describe('saveBlob', () => {
  const originalPicker = (window as unknown as { showSaveFilePicker?: unknown }).showSaveFilePicker

  afterEach(() => {
    if (originalPicker === undefined) {
      delete (window as unknown as { showSaveFilePicker?: unknown }).showSaveFilePicker
    } else {
      ;(window as unknown as { showSaveFilePicker?: unknown }).showSaveFilePicker = originalPicker
    }
    vi.restoreAllMocks()
  })

  describe('with showSaveFilePicker', () => {
    beforeEach(() => {
      const write = vi.fn().mockResolvedValue(undefined)
      const close = vi.fn().mockResolvedValue(undefined)
      const createWritable = vi.fn().mockResolvedValue({ write, close })
      const handle = { createWritable }
      ;(window as unknown as { showSaveFilePicker?: unknown }).showSaveFilePicker = vi
        .fn()
        .mockResolvedValue(handle)
    })

    it('writes a .sav with the sav mime accept list', async () => {
      const blob = makeBlob()
      await saveBlob(blob, 'pokemon.sav', 'Pokemon save')
      const picker = (window as unknown as { showSaveFilePicker: ReturnType<typeof vi.fn> })
        .showSaveFilePicker
      expect(picker).toHaveBeenCalledOnce()
      const opts = picker.mock.calls[0]?.[0] as {
        suggestedName: string
        types: Array<{ accept: Record<string, string[]> }>
      }
      expect(opts.suggestedName).toBe('pokemon.sav')
      expect(opts.types[0]?.accept['application/octet-stream']).toEqual([
        '.sav',
        '.bin',
        '.dat',
        '.main',
      ])
    })

    it('writes a .zip with the zip mime accept list', async () => {
      const blob = makeBlob()
      await saveBlob(blob, 'pokemon.zip', 'Pokemon zip')
      const picker = (window as unknown as { showSaveFilePicker: ReturnType<typeof vi.fn> })
        .showSaveFilePicker
      const opts = picker.mock.calls[0]?.[0] as {
        types: Array<{ accept: Record<string, string[]> }>
      }
      expect(opts.types[0]?.accept['application/zip']).toEqual(['.zip'])
    })
  })

  describe('without showSaveFilePicker', () => {
    beforeEach(() => {
      delete (window as unknown as { showSaveFilePicker?: unknown }).showSaveFilePicker
    })

    it('creates a temporary URL and clicks a download link', async () => {
      const blob = makeBlob()
      const createObjectURL = vi.fn(() => 'blob:mock-url')
      const revokeObjectURL = vi.fn()
      const click = vi.fn()
      const originalCreate = URL.createObjectURL.bind(URL)
      const originalRevoke = URL.revokeObjectURL.bind(URL)
      URL.createObjectURL = createObjectURL
      URL.revokeObjectURL = revokeObjectURL
      const anchor = document.createElement('a')
      const originalCreateElement = document.createElement.bind(document)
      const createElement = vi.fn((tag: string) => {
        if (tag === 'a') return anchor
        return originalCreateElement(tag)
      })
      const originalClick = anchor.click.bind(anchor)
      anchor.click = click
      document.createElement = createElement
      try {
        await saveBlob(blob, 'pokemon.sav', 'Pokemon save')
        expect(createObjectURL).toHaveBeenCalledWith(blob)
        expect(anchor.href).toBe('blob:mock-url')
        expect(anchor.download).toBe('pokemon.sav')
        expect(click).toHaveBeenCalledOnce()
        expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
      } finally {
        URL.createObjectURL = originalCreate
        URL.revokeObjectURL = originalRevoke
        anchor.click = originalClick
        document.createElement = originalCreateElement
      }
    })
  })
})
