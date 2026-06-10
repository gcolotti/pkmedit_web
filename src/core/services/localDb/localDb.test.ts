import 'fake-indexeddb/auto'

import { beforeEach, describe, expect, it } from 'vitest'

import { readLastUploadedSave, storeLastUploadedSave, toError } from './localDb'

describe('localDb', () => {
  beforeEach(async () => {
    // Clear the store between tests
    await new Promise<void>((resolve, reject) => {
      const req = indexedDB.deleteDatabase('pkmedit')
      req.onsuccess = () => resolve()
      req.onerror = () =>
        reject(new Error(req.error?.message ?? 'delete-failed'))
      req.onblocked = () => resolve()
    })
  })

  it('returns undefined when nothing has been stored', async () => {
    expect(await readLastUploadedSave()).toBeUndefined()
  })

  it('persists and reads back a stored save', async () => {
    const blob = new Blob(['fake-save-bytes'], {
      type: 'application/octet-stream',
    })
    await storeLastUploadedSave('pokemon.zip', blob)
    const result = await readLastUploadedSave()
    expect(result).toBeDefined()
    expect(result?.fileName).toBe('pokemon.zip')
    // fake-indexeddb structured-clones the Blob, so we only assert the
    // metadata fields that the production code actually round-trips.
    expect(result?.savedAt).toBeGreaterThan(0)
  })

  it('overwrites the existing record when storing again', async () => {
    const first = new Blob(['first'])
    await storeLastUploadedSave('first.zip', first)
    const second = new Blob(['second'])
    await storeLastUploadedSave('second.zip', second)
    const result = await readLastUploadedSave()
    expect(result?.fileName).toBe('second.zip')
  })
})

describe('toError', () => {
  it('returns the original Error instance', () => {
    const err = new Error('boom')
    expect(toError(err)).toBe(err)
  })

  it('wraps a non-Error value in a new Error', () => {
    const result = toError('string-error')
    expect(result).toBeInstanceOf(Error)
    expect(result.message).toBe('string-error')
  })
})

type HandlerSet = {
  onerror?: (event: Event) => void
  oncomplete?: (event: Event) => void
  onabort?: (event: Event) => void
  onsuccess?: (event: Event) => void
  onupgradeneeded?: (event: Event) => void
}

function defineHandlers<K extends keyof HandlerSet>(
  target: object,
  key: K,
): { value?: HandlerSet[K] } {
  const handlers: { value?: HandlerSet[K] } = {}
  Object.defineProperty(target, key, {
    get: () => handlers.value,
    set: (v: HandlerSet[K]) => {
      handlers.value = v
    },
    configurable: true,
  })
  return handlers
}

function buildMockTransaction(
  onError: (tx: IDBTransaction) => void,
): IDBTransaction {
  const tx = {} as IDBTransaction
  const onerror = defineHandlers(tx, 'onerror')
  const oncomplete = defineHandlers(tx, 'oncomplete')
  const onabort = defineHandlers(tx, 'onabort')
  void oncomplete
  void onabort
  const objectStore = {
    get: (): IDBRequest => {
      const req = {} as IDBRequest
      const reqOnError = defineHandlers(req, 'onerror')
      const reqOnSuccess = defineHandlers(req, 'onsuccess')
      void reqOnSuccess
      setTimeout(() => {
        const error = new Error('read-fail')
        Object.defineProperty(req, 'error', {
          value: error,
          configurable: true,
        })
        const fn = reqOnError.value
        if (fn) fn(new Event('error'))
      }, 0)
      return req
    },
    put: (): IDBRequest => ({}) as IDBRequest,
  } as unknown as IDBObjectStore
  Object.defineProperty(tx, 'objectStore', {
    value: () => objectStore,
    configurable: true,
  })
  setTimeout(() => {
    const error = new Error('write-fail')
    Object.defineProperty(tx, 'error', { value: error, configurable: true })
    const fn = onerror.value
    if (fn) fn(new Event('error'))
    onError(tx)
  }, 0)
  return tx
}

function buildMockOpen(): IDBOpenDBRequest {
  const request = {} as IDBOpenDBRequest
  const onerror = defineHandlers(request, 'onerror')
  const onsuccess = defineHandlers(request, 'onsuccess')
  const onupgradeneeded = defineHandlers(request, 'onupgradeneeded')
  void onsuccess
  void onupgradeneeded
  queueMicrotask(() => {
    const error = new Error('open-fail')
    Object.defineProperty(request, 'error', {
      value: error,
      configurable: true,
    })
    const fn = onerror.value
    if (fn) fn(new Event('error'))
  })
  return request
}

describe('error paths', () => {
  it('rejects when the write transaction fails with a real Error', async () => {
    const originalTransaction = IDBDatabase.prototype.transaction.bind(
      IDBDatabase.prototype,
    )
    const mockTransaction: typeof IDBDatabase.prototype.transaction = () =>
      buildMockTransaction(() => undefined)
    IDBDatabase.prototype.transaction = mockTransaction
    try {
      const blob = new Blob(['x'])
      await expect(storeLastUploadedSave('x.zip', blob)).rejects.toThrow(
        'write-fail',
      )
    } finally {
      IDBDatabase.prototype.transaction = originalTransaction
    }
  })

  it('rejects when the read transaction fails with a real Error', async () => {
    const originalTransaction = IDBDatabase.prototype.transaction.bind(
      IDBDatabase.prototype,
    )
    const mockTransaction: typeof IDBDatabase.prototype.transaction = () =>
      buildMockTransaction(() => undefined)
    IDBDatabase.prototype.transaction = mockTransaction
    try {
      await expect(readLastUploadedSave()).rejects.toThrow('read-fail')
    } finally {
      IDBDatabase.prototype.transaction = originalTransaction
    }
  })

  it('rejects when the open request fails with a real Error', async () => {
    const originalOpen = indexedDB.open.bind(indexedDB)
    Object.defineProperty(indexedDB, 'open', {
      value: (_name: string, _version: number) => buildMockOpen(),
      configurable: true,
    })
    try {
      await expect(readLastUploadedSave()).rejects.toThrow('open-fail')
    } finally {
      Object.defineProperty(indexedDB, 'open', {
        value: originalOpen,
        configurable: true,
      })
    }
  })
})
