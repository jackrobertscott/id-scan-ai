import {BrowserWindow, app, dialog, ipcMain, net, protocol} from "electron"
import fs from "fs"
import {glob} from "glob"
import {updateElectronApp} from "update-electron-app"
import {debounce} from "./debounce"
import {DesktopConfigSchema, dskConf} from "./dskConf"
import {twainScanBase64} from "./twain"

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string // preload.ts
const APP_URL_LIVE = "https://www.idscanai.com"
const APP_URL_DEV = "http://localhost:3000"
const SHOW_DEV_TOOLS = false

// package.json repository field must be set
updateElectronApp()

// create/remove shortcuts on install/uninstall
if (require("electron-squirrel-startup")) app.quit()

// must be before app ready
protocol.registerSchemesAsPrivileged([
  {
    scheme: "atom",
    privileges: {
      secure: true,
      supportFetchAPI: true,
    },
  },
])

// global to prevent garbage collection
let mainWindow: BrowserWindow

const createWindow = () => {
  const bw = new BrowserWindow({
    x: 0,
    y: 0,
    width: 1280,
    height: 720,
    ...dskConf.getValue().winPos,
    // titleBarStyle: "hidden",
    webPreferences: {
      preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
      nodeIntegration: false, // security risk when "true"
    },
  })
  if (app.isPackaged) bw.loadURL(APP_URL_LIVE)
  else {
    bw.loadURL(APP_URL_DEV)
    if (SHOW_DEV_TOOLS) {
      bw.webContents.openDevTools({
        mode: "bottom",
      })
    }
  }
  return bw
}

app.on("ready", () => {
  mainWindow = createWindow()

  protocol.handle("atom", (request) => {
    return net.fetch("file://" + request.url.slice("atom://".length))
  })

  ipcMain.handle("ping", () => "pong")
  ipcMain.handle("selectFolder", async () => {
    const {canceled, filePaths} = await dialog.showOpenDialog(mainWindow, {
      properties: ["openDirectory"],
    })
    return canceled ? undefined : filePaths[0]
  })
  ipcMain.handle("selectFile", async (_, dialogueName, extensions) => {
    const {canceled, filePaths} = await dialog.showOpenDialog(mainWindow, {
      properties: ["openFile"],
      filters:
        dialogueName && extensions
          ? [{name: dialogueName, extensions}]
          : undefined,
    })
    return canceled ? undefined : filePaths[0]
  })
  ipcMain.handle("listFolderContent", (_, folderPath) => {
    if (typeof folderPath !== "string") throw new Error("Path is not a string.")
    if (!fs.existsSync(folderPath)) return []
    return fs.readdirSync(folderPath)
  })
  ipcMain.handle("readFileContent", (_, filePath) => {
    if (typeof filePath !== "string") throw new Error("Path is not a string.")
    if (!fs.existsSync(filePath)) return undefined
    return fs.readFileSync(filePath, "utf8")
  })
  ipcMain.handle("listGlobContent", (_, globPath) => {
    if (typeof globPath !== "string") throw new Error("Path is not a string.")
    return glob(globPath)
  })
  ipcMain.handle("setStoreValue", (_, key, value) => {
    if (typeof key !== "string") throw new Error("Store key is not a string.")
    dskConf.patchValue({[key]: value})
  })
  ipcMain.handle("getStoreValue", (_, key) => {
    if (typeof key !== "string") throw new Error("Store key is not a string.")
    return dskConf.getValue()[key as keyof DesktopConfigSchema]
  })
  ipcMain.handle("twainScanBase64", async () => {
    return twainScanBase64()
  })

  const setConfBox = debounce(() => {
    dskConf.patchValue({winPos: mainWindow.getBounds()})
  }, 500)
  mainWindow.on("resize", setConfBox)
  mainWindow.on("move", setConfBox)
})

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit()
  }
})

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    mainWindow = createWindow()
  }
})
