export async function saveBlob(
  blob: Blob,
  fileName: string,
  description: string,
) {
  const isZip = fileName.toLowerCase().endsWith('.zip')

  if ('showSaveFilePicker' in window) {
    const picker = window.showSaveFilePicker as SavePicker
    const handle = await picker({
      suggestedName: fileName,
      types: [
        {
          description,
          accept: isZip
            ? { 'application/zip': ['.zip'] }
            : { 'application/octet-stream': ['.sav', '.bin', '.dat', '.main'] },
        },
      ],
    })
    const writable = await handle.createWritable()
    await writable.write(blob)
    await writable.close()
    return
  }

  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  link.click()
  URL.revokeObjectURL(url)
}

type SavePicker = (options: {
  suggestedName: string
  types: Array<{ description: string; accept: Record<string, string[]> }>
}) => Promise<{
  createWritable: () => Promise<{
    close: () => Promise<void>
    write: (blob: Blob) => Promise<void>
  }>
}>
