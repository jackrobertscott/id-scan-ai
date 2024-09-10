import {contextBridge, ipcRenderer} from "electron"

const createInvoker =
  (name: string) =>
  (...argArr: any[]) =>
    ipcRenderer.invoke(name, ...argArr)

contextBridge.exposeInMainWorld("_desktopBridge", {
  ping: createInvoker("ping"),
  selectFolder: createInvoker("selectFolder"),
  selectFile: createInvoker("selectFile"),
  listFolderContent: createInvoker("listFolderContent"),
  readFileContent: createInvoker("readFileContent"),
  listGlobContent: createInvoker("listGlobContent"),
  setStoreValue: createInvoker("setStoreValue"),
  getStoreValue: createInvoker("getStoreValue"),
  twainScanBase64: createInvoker("twainScanBase64"),
})

process.env["ELECTRON_DISABLE_SECURITY_WARNINGS"] = "true"
