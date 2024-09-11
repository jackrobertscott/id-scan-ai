import {DesktopConfigSchema} from "../../desktop/src/dskConf"

export type DesktopBridge = {
  ping: () => Promise<string>
  selectFolder: () => Promise<string | undefined>
  selectFile: (
    dialogueName?: string,
    extensions?: string[]
  ) => Promise<string | undefined>
  listFolderContent: (folderPath: string) => Promise<string[]>
  readFileContent: (filePath: string) => Promise<string | undefined>
  listGlobContent: (globPath: string) => Promise<string[]>
  setStoreValue: <K extends keyof DesktopConfigSchema>(
    key: K,
    value: DesktopConfigSchema[K]
  ) => Promise<void>
  getStoreValue: <K extends keyof DesktopConfigSchema>(
    key: K
  ) => Promise<DesktopConfigSchema[K]>
  twainScanBase64: () => Promise<string | undefined>
}

export const isDesktopAvailable = () => {
  return !!(window as any)._desktopBridge
}

export const desktopBridge = new Proxy({} as DesktopBridge, {
  get: (_, key) => {
    const w = window as any
    const b = w._desktopBridge as DesktopBridge | undefined
    if (!b) {
      const message = "This feature is only available in the desktop app"
      alert(message)
      throw new Error(message)
    }
    return b[key as keyof DesktopBridge]
  },
})
