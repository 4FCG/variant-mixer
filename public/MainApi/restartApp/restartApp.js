const { ipcMain } = require("electron");
const { autoUpdater } = require('electron-updater');

module.exports = {
    configure: () => {
        ipcMain.handle("restartApp", () => {
            autoUpdater.quitAndInstall();
        });
    }
};