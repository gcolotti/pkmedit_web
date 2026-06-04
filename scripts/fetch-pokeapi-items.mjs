#!/usr/bin/env node
import fs from 'fs'
import https from 'https'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const ITEMS_DIR = path.join(__dirname, '../public/assets/items')

const EXISTING_IDS = new Set([
  43, 110, 112, 116, 117, 118, 119, 135, 136, 149, 150, 151, 152, 153, 154, 155,
  156, 157, 158, 159, 160, 161, 162, 163, 184, 185, 186, 187, 188, 189, 190,
  191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205,
  206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220,
  221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235,
  236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250,
  251, 252, 253, 254, 255, 256, 257, 258, 259, 260, 261, 262, 263, 264, 265,
  266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280,
  281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 294, 295, 296,
  297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310, 311,
  312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 323, 324, 325, 326, 327,
  534, 535, 537, 538, 539, 540, 541, 542, 543, 544, 545, 546, 547, 548, 549,
  550, 551, 552, 553, 554, 555, 556, 557, 558, 559, 560, 561, 562, 563, 564,
  639, 640, 644, 646, 647, 648, 649, 650, 686, 687, 688, 715, 846, 879, 880,
  881, 882, 883, 884, 904, 905, 906, 907, 908, 909, 910, 911, 912, 913, 914,
  915, 916, 917, 918, 919, 920, 1103, 1104, 1109, 1111, 1112, 1113, 1114, 1115,
  1118, 1119, 1120, 1121, 1122, 1123, 1880, 1881, 1882, 1883, 1884, 1885, 1886,
  2401, 2406, 2407, 2408,
])

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(
        url,
        { headers: { 'User-Agent': 'pkmedit-asset-fetcher' } },
        (res) => {
          let data = ''
          res.on('data', (chunk) => (data += chunk))
          res.on('end', () => {
            try {
              resolve(JSON.parse(data))
            } catch (e) {
              reject(e)
            }
          })
          res.on('error', reject)
        },
      )
      .on('error', reject)
  })
}

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(dest)) {
      resolve(true)
      return
    }
    const file = fs.createWriteStream(dest)
    https
      .get(
        url,
        { headers: { 'User-Agent': 'pkmedit-asset-fetcher' } },
        (res) => {
          if (res.statusCode !== 200) {
            file.close()
            fs.unlink(dest, () => {})
            resolve(false)
            return
          }
          res.pipe(file)
          file.on('finish', () => file.close(() => resolve(true)))
          file.on('error', (err) => {
            fs.unlink(dest, () => {})
            reject(err)
          })
        },
      )
      .on('error', (err) => {
        fs.unlink(dest, () => {})
        reject(err)
      })
  })
}

const list = await fetchJson(
  'https://pokeapi.co/api/v2/item?limit=2000&offset=0',
)
console.error(`Fetched ${list.results.length} items`)

const idToName = {}
for (const item of list.results) {
  const id = parseInt(item.url.split('/').filter(Boolean).pop())
  idToName[id] = item.name
}

const newEntries = []
const ids = Object.keys(idToName)
  .map(Number)
  .sort((a, b) => a - b)

for (const id of ids) {
  if (EXISTING_IDS.has(id)) continue
  const name = idToName[id]
  const url = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/items/${name}.png`
  const dest = path.join(ITEMS_DIR, `${id}.png`)
  process.stderr.write(`  ${id} (${name})... `)
  const ok = await downloadFile(url, dest)
  console.error(ok ? 'ok' : 'miss')
  if (ok) newEntries.push(id)
}

console.log(JSON.stringify(newEntries))
