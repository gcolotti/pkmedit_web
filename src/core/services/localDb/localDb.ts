const dbName = 'pkmedit'
const storeName = 'saves'
const lastSaveKey = 'last-uploaded-save'

type StoredSave = {
  id: string
  fileName: string
  blob: Blob
  savedAt: number
}

export async function storeLastUploadedSave(fileName: string, blob: Blob) {
  const db = await openDb()
  await writeStore(db, { id: lastSaveKey, fileName, blob, savedAt: Date.now() })
  db.close()
}

export async function readLastUploadedSave() {
  const db = await openDb()
  const save = await readStore(db)
  db.close()
  return save
}

function openDb() {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open(dbName, 1)
    request.onupgradeneeded = () =>
      request.result.createObjectStore(storeName, { keyPath: 'id' })
    request.onerror = () => reject(toError(request.error))
    request.onsuccess = () => resolve(request.result)
  })
}

function writeStore(db: IDBDatabase, value: StoredSave) {
  return new Promise<void>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readwrite')
    transaction.objectStore(storeName).put(value)
    transaction.onerror = () => reject(toError(transaction.error))
    transaction.oncomplete = () => resolve()
  })
}

function readStore(db: IDBDatabase) {
  return new Promise<StoredSave | undefined>((resolve, reject) => {
    const transaction = db.transaction(storeName, 'readonly')
    const request = transaction.objectStore(storeName).get(lastSaveKey)
    request.onerror = () => reject(toError(request.error))
    request.onsuccess = () => resolve(request.result as StoredSave | undefined)
  })
}

export function toError(error: unknown) {
  return error instanceof Error ? error : new Error(String(error))
}
