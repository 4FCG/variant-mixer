const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("mainApi", {
    listPackages: (args) => ipcRenderer.invoke("listPackages", args),
    loadPackage: (args) => ipcRenderer.invoke("loadPackage", args)
})