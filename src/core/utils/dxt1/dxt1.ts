type Rgba = [number, number, number, number]

export function decompressDxt1(
  data: Uint8Array,
  width: number,
  height: number,
) {
  const result = new Uint8ClampedArray(width * height * 4)
  const blockCountX = width / 4
  const blockCountY = height / 4
  for (let y = 0; y < blockCountY; y++) {
    for (let x = 0; x < blockCountX; x++) {
      const offset = (y * blockCountX + x) * 8
      const color0 = data[offset] | (data[offset + 1] << 8)
      const color1 = data[offset + 2] | (data[offset + 3] << 8)
      const indices =
        data[offset + 4] |
        (data[offset + 5] << 8) |
        (data[offset + 6] << 16) |
        (data[offset + 7] << 24)
      const colors = dxtColors(color0, color1)
      for (let py = 0; py < 4; py++) {
        for (let px = 0; px < 4; px++) {
          const index = (indices >> ((py * 4 + px) * 2)) & 3
          const dest = ((y * 4 + py) * width + x * 4 + px) * 4
          const color = colors[index]
          result[dest] = color[0]
          result[dest + 1] = color[1]
          result[dest + 2] = color[2]
          result[dest + 3] = color[3]
        }
      }
    }
  }
  return result
}

function dxtColors(color0: number, color1: number): Rgba[] {
  const c0 = rgb565(color0)
  const c1 = rgb565(color1)
  if (color0 > color1) return [c0, c1, lerp(c0, c1, 1 / 3), lerp(c0, c1, 2 / 3)]
  return [c0, c1, lerp(c0, c1, 0.5), [0, 0, 0, 0]]
}

function rgb565(value: number): Rgba {
  const r = (value >> 11) & 0x1f
  const g = (value >> 5) & 0x3f
  const b = value & 0x1f
  return [(r << 3) | (r >> 2), (g << 2) | (g >> 4), (b << 3) | (b >> 2), 255]
}

function lerp(a: Rgba, b: Rgba, t: number): Rgba {
  return [
    Math.trunc(a[0] + (b[0] - a[0]) * t),
    Math.trunc(a[1] + (b[1] - a[1]) * t),
    Math.trunc(a[2] + (b[2] - a[2]) * t),
    Math.trunc(a[3] + (b[3] - a[3]) * t),
  ]
}
