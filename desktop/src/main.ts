import {
  BrowserWindow,
  app,
  autoUpdater,
  dialog,
  ipcMain,
  net,
  protocol,
} from "electron"
import fs from "fs"
import {glob} from "glob"
import {debounce} from "./debounce"
import {DesktopConfigSchema, dskConf} from "./dskConf"

declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string // preload.ts
const APP_URL_LIVE = "https://www.idscanai.com"
const APP_URL_DEV = "http://localhost:3000"
const S3_PUBLISH_DIR = "id-scan-ai"
const SHOW_DEV_TOOLS = false

// global to prevent garbage collection
let mainWindow: BrowserWindow

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

if (app.isPackaged) {
  const publishUrl =
    "https://public-electron-packages.s3.ap-southeast-2.amazonaws.com/" +
    S3_PUBLISH_DIR
  autoUpdater.setFeedURL({url: publishUrl})
  setInterval(() => autoUpdater.checkForUpdates(), 6e4) // every 60 seconds
  autoUpdater.on("error", (message) => console.error(message))
  autoUpdater.on("checking-for-update", () => console.log("checking..."))
  autoUpdater.on("update-downloaded", (_, releaseNotes, releaseName) => {
    dialog
      .showMessageBox({
        type: "info",
        title: "Application Update",
        buttons: ["Restart", "Later"],
        message: process.platform === "win32" ? releaseNotes : releaseName,
        detail: "A new version has been downloaded. Please restart.",
      })
      .then((returnValue) => {
        if (returnValue.response === 0) autoUpdater.quitAndInstall()
      })
  })
}
