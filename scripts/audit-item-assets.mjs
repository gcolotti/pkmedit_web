#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const itemAssetsDir = path.join(root, 'public/assets/items')
const sourcePath = path.join(root, 'src/core/utils/wikiDexAssets.ts')

function readPngHeader(filePath) {
  const buffer = fs.readFileSync(filePath)
  const signature = buffer.toString('ascii', 1, 4)
  if (signature !== 'PNG') {
    throw new Error(`${path.relative(root, filePath)} is not a PNG`)
  }

  return {
    bitDepth: buffer[24],
    colorType: buffer[25],
    height: buffer.readUInt32BE(20),
    width: buffer.readUInt32BE(16),
  }
}

const assetIds = fs
  .readdirSync(itemAssetsDir)
  .filter((file) => /^\d+\.png$/.test(file))
  .map((file) => Number(file.slice(0, -4)))
  .sort((a, b) => a - b)

const source = fs.readFileSync(sourcePath, 'utf8')
const mapMatch = source.match(
  /export const HELD_ITEM_IMAGE_URLS: Record<number, string> = \{([\s\S]*?)\n\}/,
)
if (!mapMatch) {
  throw new Error('HELD_ITEM_IMAGE_URLS map not found')
}

const mappedIds = [
  ...mapMatch[1].matchAll(/^\s*(\d+): ['"]\/assets\/items\/\1\.png['"],$/gm),
]
  .map((match) => Number(match[1]))
  .sort((a, b) => a - b)

const assetIdSet = new Set(assetIds)
const mappedIdSet = new Set(mappedIds)
const missingMappings = assetIds.filter((id) => !mappedIdSet.has(id))
const missingFiles = mappedIds.filter((id) => !assetIdSet.has(id))
const badPngs = assetIds
  .map((id) => {
    const file = path.join(itemAssetsDir, `${id}.png`)
    return { id, ...readPngHeader(file) }
  })
  .filter(
    ({ bitDepth, colorType, height, width }) =>
      width !== 28 || height !== 28 || bitDepth !== 8 || colorType !== 6,
  )

if (
  missingMappings.length > 0 ||
  missingFiles.length > 0 ||
  badPngs.length > 0
) {
  console.error(
    JSON.stringify(
      {
        badPngs,
        missingFiles,
        missingMappings,
      },
      null,
      2,
    ),
  )
  process.exit(1)
}

console.log(`Item assets OK: ${assetIds.length} mapped 28x28 RGBA PNGs.`)
