import {Image, ImageData, createCanvas} from "canvas"

export function createImageDataFromBuffer(
  src: string | Buffer
): Promise<ImageData> {
  return new Promise((good, bad) => {
    const img = new Image()
    img.onerror = bad
    img.onload = () => {
      const cvs = createCanvas(img.naturalWidth, img.naturalHeight)
      const ctx = cvs.getContext("2d")
      ctx.drawImage(img, 0, 0)
      good(ctx.getImageData(0, 0, cvs.width, cvs.height))
    }
    img.src = src
  })
}

export function createBufferFromImageData(
  img: ImageData,
  jpeg: boolean = true,
  jpegQuality: number = 0.9
) {
  const cvs = createCanvas(img.width, img.height)
  const ctx = cvs.getContext("2d")
  ctx.putImageData(img, 0, 0)
  if (jpeg) {
    return cvs.toBuffer("image/jpeg", {quality: jpegQuality})
  }
  return cvs.toBuffer("image/png")
}

export function shrinkImage(img: ImageData, maxLength: number) {
  let curImg = img
  const aCvs = createCanvas(curImg.width, curImg.height)
  const bCvs = createCanvas(0, 0)
  const aCtx = aCvs.getContext("2d")
  const bCtx = bCvs.getContext("2d")
  if (curImg.width > curImg.height) {
    bCvs.width = maxLength
    bCvs.height = (curImg.height / curImg.width) * bCvs.width
  } else {
    bCvs.height = maxLength
    bCvs.width = (curImg.width / curImg.height) * bCvs.height
  }
  aCtx.putImageData(curImg, 0, 0)
  bCtx.drawImage(aCvs, 0, 0, bCvs.width, bCvs.height)
  curImg = bCtx.getImageData(0, 0, bCvs.width, bCvs.height)
  return curImg
}

export function rotateImage90Degrees(img: ImageData, dir: -1 | 1): ImageData {
  const {width, height} = img
  const newImg = new ImageData(height, width)
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const rgba = getImagePixel(img, [x, y])!
      const v2d: TV2d = dir > 0 ? [y, width - 1 - x] : [height - 1 - y, x]
      setImagePixel(newImg, v2d, rgba)
    }
  }
  return newImg
}

export function getImagePixel(img: ImageData, [x, y]: TV2d) {
  if (x < 0 || y < 0 || x >= img.width || y >= img.height) return undefined
  const idx = y * img.width * 4 + x * 4
  return [
    img.data[idx + 0],
    img.data[idx + 1],
    img.data[idx + 2],
    img.data[idx + 3],
  ] as TV4d
}

export function setImagePixel(img: ImageData, [x, y]: TV2d, rgba: TV4d) {
  const idx = y * img.width * 4 + x * 4
  img.data[idx + 0] = rgba[0]
  img.data[idx + 1] = rgba[1]
  img.data[idx + 2] = rgba[2]
  img.data[idx + 3] = rgba[3]
}

export type TVtr = number[]
export type TV1d = [number]
export type TV2d = [number, number]
export type TV3d = [number, number, number]
export type TV4d = [number, number, number, number]
