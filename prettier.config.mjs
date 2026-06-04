let shared = {}

try {
  const imported = await import('@gcolotti/frontend-config/prettier')
  shared = imported.default ?? imported
} catch {
  try {
    const imported = await import('@gcolotti/frontend-config')
    shared = imported.prettier ?? imported.default?.prettier ?? {}
  } catch {
    shared = {}
  }
}

export default {
  ...shared,
}
