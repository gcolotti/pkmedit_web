import { useEffect, useRef } from 'react'

import type { TrainerImageInfo } from '../../../core/types/trainer/trainer'
import { decompressDxt1 } from '../../../core/utils/dxt1/dxt1'

export function TrainerImageCanvas({ image }: { image: TrainerImageInfo }) {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    canvas.width = image.width
    canvas.height = image.height
    const context = canvas.getContext('2d')
    if (!context) return
    const pixels = decompressDxt1(
      base64ToBytes(image.dataBase64),
      image.width,
      image.height,
    )
    context.putImageData(new ImageData(pixels, image.width, image.height), 0, 0)
  }, [image])

  return (
    <canvas
      ref={ref}
      className="max-h-72 w-full rounded-md bg-stone-950/10 object-contain dark:bg-stone-950/50"
    />
  )
}

function base64ToBytes(value: string) {
  const binary = atob(value)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}
