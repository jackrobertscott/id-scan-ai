import {useEffect, useRef, useState} from "react"
import {z} from "zod"

export const boundingBoxSchema = z.object({
  top: z.number(),
  left: z.number(),
  height: z.number(),
  width: z.number(),
})

export type BoundingBoxSchema = z.infer<typeof boundingBoxSchema>

export function useBoundingBox<T extends HTMLElement>(
  options: {disabled?: boolean} = {}
) {
  const triggerRef = useRef<T | null>(null)
  const [box, setBox] = useState<BoundingBoxSchema>()
  useEffect(() => {
    if (box && options.disabled) setBox(undefined)
  }, [options.disabled])
  const doShow = () => {
    if (options.disabled) return
    if (!triggerRef.current) return console.warn("Trigger ref not set")
    const data = triggerRef.current.getBoundingClientRect()
    const _box = boundingBoxSchema.parse({
      top: data.y,
      left: data.x,
      width: data.width,
      height: data.height,
    })
    setBox(_box)
  }
  const doHide = () => {
    if (box) setBox(undefined)
  }
  return {
    box,
    triggerRef,
    doShow,
    doHide,
  }
}
