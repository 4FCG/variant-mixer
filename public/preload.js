const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("mainApi", {
    listPackages: (args) => ipcRenderer.invoke("listPackages", args),
    loadPackage: (args) => ipcRenderer.invoke("loadPackage", args),
    exportImage: (args) => ipcRenderer.invoke("exportImage", args),
    importPackage: (args) => ipcRenderer.invoke("importPackage", args)
})