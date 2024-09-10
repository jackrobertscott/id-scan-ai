import cp from "child_process"
import {app} from "electron"
import fs from "fs-extra"
import path from "path"

const BASE64_JPEG = "data:image/jpeg;base64"
const TMP_DIR = path.join(app.getPath("userData"), "tmp")

export const setBase64Img = (filepath: string, dataUrl: string) => {
  if (!filepath.endsWith(".jpeg"))
    throw new Error("Path does not end with .jpeg: " + filepath)
  if (!dataUrl.startsWith(BASE64_JPEG))
    throw new Error("Data url is does not start with " + BASE64_JPEG)
  const data = dataUrl.split(",")[1]
  fs.ensureDirSync(path.dirname(filepath))
  fs.writeFileSync(filepath, Buffer.from(data, "base64"))
}

export const getBase64Img = (filepath: string) => {
  if (!filepath.endsWith(".jpeg"))
    throw new Error("Path does not end with .jpeg")
  if (!fs.existsSync(filepath)) return undefined
  const f = fs.readFileSync(filepath, "base64")
  return [BASE64_JPEG, f].join()
}

export const twainScanBase64 = async () => {
  fs.ensureDirSync(TMP_DIR)
  const pfil = path.join(TMP_DIR, "tmp.jpeg")
  const tool = process.platform === "win32" ? "cmdtwain" : "screencapture"
  cp.execSync(`${tool} "${pfil}"`)
  const dataUrl = getBase64Img(pfil)
  fs.removeSync(pfil)
  return dataUrl
}
