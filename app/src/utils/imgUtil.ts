export type TVtr = number[]
export type TV1d = [number]
export type TV2d = [number, number]
export type TV3d = [number, number, number]
export type TV4d = [number, number, number, number]

export const imgUtil = {
  fromFile(file: File): Promise<ImageData> {
    return new Promise((good, bad) => {
      const fr = new FileReader()
      fr.onerror = bad
      fr.onload = () => {
        const src = fr.result
        if (typeof src !== "string") throw new Error()
        imgUtil.fromSource(src).then(good).catch(bad)
      }
      fr.readAsDataURL(file)
    })
  },

  fromSource(src: string): Promise<ImageData> {
    return new Promise((good, bad) => {
      const img = new Image()
      img.crossOrigin = "Anonymous"
      img.onerror = bad
      img.onload = () => {
        const cvs = document.createElement("canvas")
        const ctx = cvs.getContext("2d")!
        cvs.width = img.naturalWidth
        cvs.height = img.naturalHeight
        ctx.drawImage(img, 0, 0)
        good(ctx.getImageData(0, 0, cvs.width, cvs.height))
        cvs.remove()
      }
      img.src = src
    })
  },

  toFile(
    img: ImageData,
    fileName: string = Date.now().toString()
  ): Promise<File> {
    return new Promise((good, bad) => {
      const cvs = document.createElement("canvas")
      const ctx = cvs.getContext("2d")!
      cvs.width = img.width
      cvs.height = img.height
      ctx.putImageData(img, 0, 0)
      const mime = "image/jpeg"
      cvs.toBlob((b) => {
        if (!b) return bad("Failed to convert canvas to blob.")
        const f = new File([b], fileName + ".jpeg", {type: mime})
        good(f)
        cvs.remove()
      }, mime)
    })
  },

  newCanvas(
    width: number,
    height: number,
    willReadFrequently: boolean = false
  ) {
    const cvs = document.createElement("canvas")
    const ctx = cvs.getContext("2d", {willReadFrequently})!
    cvs.width = width
    cvs.height = height
    return [cvs, ctx] as const
  },

  cloneCanvas(oldCvs: HTMLCanvasElement) {
    const [cvs, ctx] = this.newCanvas(oldCvs.width, oldCvs.height)
    ctx.drawImage(oldCvs, 0, 0)
    return [cvs, ctx] as const
  },

  shrink(img: ImageData, maxLength: number, denominator: number = 100) {
    // weirdly - a low denominator (many cycles) causes blurry images?
    const aCvs = document.createElement("canvas")
    const bCvs = document.createElement("canvas")
    const aCtx = aCvs.getContext("2d")!
    const bCtx = bCvs.getContext("2d", {willReadFrequently: true})!
    let curImg = img
    do {
      aCvs.width = curImg.width
      aCvs.height = curImg.height
      aCtx.putImageData(curImg, 0, 0)
      if (curImg.width > curImg.height) {
        bCvs.width = Math.max(curImg.width / denominator, maxLength)
        bCvs.height = (curImg.height / curImg.width) * bCvs.width
      } else {
        bCvs.height = Math.max(curImg.height / denominator, maxLength)
        bCvs.width = (curImg.width / curImg.height) * bCvs.height
      }
      bCtx.drawImage(aCvs, 0, 0, bCvs.width, bCvs.height)
      curImg = bCtx.getImageData(0, 0, bCvs.width, bCvs.height)
    } while (curImg.width > maxLength || curImg.height > maxLength)
    aCvs.remove()
    bCvs.remove()
    return curImg
  },

  squish(imgDataArr: ImageData[]) {
    const {width, height} = imgDataArr[0]
    const bigImg = new ImageData(width * height, imgDataArr.length)
    for (let i = 0; i < imgDataArr.length; i++) {
      const curImg = imgDataArr[i]
      if (curImg.width !== width) throw new Error()
      if (curImg.height !== height) throw new Error()
      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          const pxl = this.pixelGet(curImg, [x, y])!
          this.pixelSet(bigImg, [y * width + x, i], pxl)
        }
      }
    }
    return bigImg
  },

  stack(imgDataArr: ImageData[]) {
    const w = imgDataArr.reduce((a, b) => Math.max(a, b.width), 0)
    const h = imgDataArr.reduce((a, b) => a + b.height, 0)
    const bigImg = new ImageData(w, h)
    let yOff = 0
    for (let i = 0; i < imgDataArr.length; i++) {
      const curImg = imgDataArr[i]
      for (let y = 0; y < curImg.height; y++) {
        for (let x = 0; x < curImg.width; x++) {
          const pxl = this.pixelGet(curImg, [x, y])!
          this.pixelSet(bigImg, [x, y + yOff], pxl)
        }
      }
      yOff += curImg.height
    }
    return bigImg
  },

  crop(imgData: ImageData, sx: number, sy: number, w: number, h: number) {
    const newImg = new ImageData(w, h)
    for (let y = 0; y < newImg.height; y++) {
      for (let x = 0; x < newImg.width; x++) {
        const pxl = this.pixelGet(imgData, [x + sx, y + sy])!
        this.pixelSet(newImg, [x, y], pxl)
      }
    }
    return newImg
  },

  pixelGet(img: ImageData, [x, y]: TV2d) {
    if (x < 0 || y < 0 || x >= img.width || y >= img.height) return undefined
    const idx = y * img.width * 4 + x * 4
    return [
      img.data[idx + 0],
      img.data[idx + 1],
      img.data[idx + 2],
      img.data[idx + 3],
    ] as TV4d
  },

  pixelSet(img: ImageData, [x, y]: TV2d, rgba: TV4d) {
    const idx = y * img.width * 4 + x * 4
    img.data[idx + 0] = rgba[0]
    img.data[idx + 1] = rgba[1]
    img.data[idx + 2] = rgba[2]
    img.data[idx + 3] = rgba[3]
  },

  grey({data, width, height}: ImageData): ImageData {
    const newImg = new ImageData(width, height)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width * 4 + x * 4
        const r = data[i + 0]
        const g = data[i + 1]
        const b = data[i + 2]
        const c = (r + g + b) / 3
        newImg.data[i + 0] = c
        newImg.data[i + 1] = c
        newImg.data[i + 2] = c
        newImg.data[i + 3] = 255
      }
    }
    return newImg
  },

  kernel({data, width, height}: ImageData, kernel: number[][]) {
    const newImg = new ImageData(width, height)
    for (let r = 0; r < kernel.length; r++)
      for (let c = 0; c < kernel[r].length; c++)
        if (kernel.length % 2 !== 1 || kernel[r].length % 2 !== 1)
          throw new Error()
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        let [r, g, b, t] = [0, 0, 0, 0]
        const i = y * width * 4 + x * 4
        const iy = (kernel.length - 1) / 2
        const ix = (kernel[r].length - 1) / 2
        for (let kr = 0; kr < kernel.length; kr++) {
          for (let kc = 0; kc < kernel[kr].length; kc++) {
            const kv = kernel[kr][kc]
            const nx = x - ix + kc
            const ny = y - iy + kr
            const n = ny * width * 4 + nx * 4
            const nrgb =
              nx >= 0 && ny >= 0 && nx < width && ny < height
                ? [data[n + 0], data[n + 1], data[n + 2]]
                : [0, 0, 0]
            r += kv * nrgb[0]
            g += kv * nrgb[1]
            b += kv * nrgb[2]
            t += Math.abs(kv)
          }
        }
        if (t === 0) throw new Error()
        newImg.data[i + 0] = Math.abs(r / t)
        newImg.data[i + 1] = Math.abs(g / t)
        newImg.data[i + 2] = Math.abs(b / t)
        newImg.data[i + 3] = 255
      }
    }
    return newImg
  },

  gaussian(img: ImageData) {
    return this.kernel(img, KERNEL_GAUSSIAN)
  },

  sharpen(img: ImageData) {
    return this.kernel(img, KERNEL_SHARPEN)
  },

  sobel(img: ImageData, threshold = 50): ImageData {
    const {width, height} = img
    const imgGrey = this.grey(img)
    const imgSobX = this.kernel(imgGrey, KERNEL_SOBEL_X)
    const imgSobY = this.kernel(imgGrey, KERNEL_SOBEL_Y)
    const newImg = new ImageData(width, height)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const sx = this.pixelGet(imgSobX, [x, y])
        const sy = this.pixelGet(imgSobY, [x, y])
        if (!sx || !sy) throw new Error()
        const val = sx[0] + sy[0]
        this.pixelSet(
          newImg,
          [x, y],
          val > threshold ? [255, 255, 255, 255] : [0, 0, 0, 255]
        )
      }
    }
    return newImg
  },

  erode(img: ImageData, thresh = 8): ImageData {
    const {data, width, height} = img
    const newImg = new ImageData(width, height)
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const [r, g, b] = this.pixelGet(img, [x, y])!
        let t = 0
        for (let j = 0; j < 8; j++) {
          const jx = x + Math.round(Math.sin((j * 2 * Math.PI) / 8))
          const jy = y + Math.round(-Math.cos((j * 2 * Math.PI) / 8))
          const ji = jy * width * 4 + jx * 4
          const [jr, jg, jb] =
            jx >= 0 && jy >= 0 && jx < width && jy < height
              ? [data[ji + 0], data[ji + 1], data[ji + 2], data[ji + 3]]
              : [-1, -1, -1, -1]
          if (r === jr && g === jg && b === jb) t += 1
        }
        this.pixelSet(
          newImg,
          [x, y],
          t >= thresh ? [r, g, b, 255] : [0, 0, 0, 255]
        )
      }
    }
    return newImg
  },

  rotate90(img: ImageData, dir: -1 | 1): ImageData {
    const {width, height} = img
    const newImg = new ImageData(height, width) // reversed
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const rgba = this.pixelGet(img, [x, y])!
        const v2d: TV2d = dir > 0 ? [y, width - 1 - x] : [height - 1 - y, x]
        this.pixelSet(newImg, v2d, rgba)
      }
    }
    return newImg
  },
}

export const KERNEL_SOBEL_X: number[][] = [
  [-1, 0, 1],
  [-2, 0, 2],
  [-1, 0, 1],
]

export const KERNEL_SOBEL_Y: number[][] = [
  [1, 2, 1],
  [0, 0, 0],
  [-1, -2, -1],
]

export const KERNEL_GAUSSIAN: number[][] = [
  [1, 4, 6, 4, 1],
  [4, 16, 24, 16, 4],
  [6, 24, 36, 24, 6],
  [4, 16, 24, 16, 4],
  [1, 4, 6, 4, 1],
]

export const KERNEL_SHARPEN: number[][] = [
  [0, 0, -1, 0, 0],
  [0, -1, -2, -1, 0],
  [-1, -2, 16, -2, 0],
  [0, -1, -2, -1, 0],
  [0, 0, -1, 0, 0],
]
