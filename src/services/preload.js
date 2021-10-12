const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld("mainApi", {
    listPackages: (args) => ipcRenderer.invoke("listPackages", args),
    loadPackage: (args) => ipcRenderer.invoke("loadPackage", args),
    exportImage: (args) => ipcRenderer.invoke("exportImage", args),
    importPackage: (args) => ipcRenderer.invoke("importPackage", args),
    exportQueue: (args) => ipcRenderer.invoke("exportQueue", args),
    deletePackage: (args) => ipcRenderer.invoke("deletePackage", args),
    restartApp: (args) => ipcRenderer.invoke("restartApp", args),
    onEvent: (event, func) => {
        const allowedEvents = ['updateAvailable', 'updateDownloaded'];
        if (allowedEvents.includes(event)) {
            ipcRenderer.on(event, () => func());
        }
    }
})