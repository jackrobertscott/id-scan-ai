import {createCanvas, Image} from "canvas"
import {z} from "zod"
import {faceMetaSchema} from "./faceMetaSchema"
import {shrinkImage} from "./nodeCanvasUtils"

export async function getCroppedFaceImage(
  img: Image,
  faceMeta: z.infer<ReturnType<typeof faceMetaSchema>>,
  outputShrinkSize = 2 ** 9
) {
  const cvs = createCanvas(img.width, img.height)
  const ctx = cvs.getContext("2d")
  let [fl, ft, fw, fh] = [
    faceMeta.boundingBox.left * img.width,
    faceMeta.boundingBox.top * img.height,
    faceMeta.boundingBox.width * img.width,
    faceMeta.boundingBox.height * img.height,
  ]
  const ensureWithinBounds = (value: number, max: number) => {
    return Math.max(0, Math.min(value, max))
  }
  // Ensure the computed values are within the canvas dimensions.
  fl = ensureWithinBounds(fl, img.width)
  ft = ensureWithinBounds(ft, img.height)
  fw = ensureWithinBounds(fw, img.width - fl)
  fh = ensureWithinBounds(fh, img.height - ft)
  const fcx = fl + fw / 2 // center
  const fcy = ft + fh / 2 // center
  fw *= 1.5 // scale
  fh *= 1.5 // scale
  ctx.drawImage(img, 0, 0)
  ctx.save()
  ctx.translate(fcx, fcy)
  ctx.rotate(-(faceMeta.boundingBox.angle / 180) * Math.PI)
  ctx.translate(-fcx, -fcy)
  ctx.drawImage(cvs, 0, 0)
  ctx.restore()
  fl = ensureWithinBounds(fcx - fw / 2, img.width)
  ft = ensureWithinBounds(fcy - fh / 2, img.height)
  fw = ensureWithinBounds(fw, img.width - fl)
  fh = ensureWithinBounds(fh, img.height - ft)
  let faceImg = ctx.getImageData(fl, ft, fw, fh)
  faceImg = shrinkImage(faceImg, outputShrinkSize)
  cvs.width = faceImg.width
  cvs.height = faceImg.height
  ctx.putImageData(faceImg, 0, 0)
  return [cvs.toBuffer("image/jpeg"), faceImg] as const
}
