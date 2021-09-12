const path = require('path');
const { existsSync, mkdirSync} = require("fs");
const { app, BrowserWindow, protocol } = require('electron');
const isDev = require('electron-is-dev');
const { format } = require('url');
const { autoUpdater } = require('electron-updater');

const events = require('./MainApi/index.js');

// Global reference to the main window
let win;

// Creates the Packages folder
function setup() {
  let dataPath = path.join(app.getPath('userData'), '/Packages');
  if (!existsSync(dataPath)){
    mkdirSync(dataPath);
  }
}

function createWindow(splash) {
  // Create the main browser window.
  win = new BrowserWindow({
    titleBarStyle: 'hidden',
    width: 1280,
    height: 720,
    minWidth: 600,
    minHeight: 450,
    icon: path.join(__dirname + './icon.ico'),
    show: false,
    backgroundColor: "#0B0C10",
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: isDev ? true : true,
      preload: path.join(__dirname, "preload.js")
    },
  });

  // and load the index.html of the app.
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : format({
        pathname: path.join(__dirname,'../build/index.html'),
        protocol: 'file',
        slashes: true
      })
  );

  win.once('ready-to-show', () => {
    // Remove splash screen and show app
    splash.destroy();
    win.show();

    // Check for updates
    autoUpdater.checkForUpdatesAndNotify();

    // Open the DevTools.
    if (isDev) {
      win.webContents.openDevTools({ mode: 'detach' });
    }

    setTimeout(() => {
      win.webContents.send('updateAvailable');
    }, 5000)
    
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // splash screen
  let splash = new BrowserWindow({width: 300, height: 300, alwaysOnTop: true, frame: false, transparent: true});
  splash.loadURL(`file://${__dirname}/splash.html`);
  
  protocol.registerFileProtocol('image', (request, callback) => {
    const url = request.url.substr(7)
    callback({ path: url })
  })
  
  setup();
  createWindow(splash);
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Load ipcMain handles, these are the API functions given to the react app
events.forEach(event => event.configure());

autoUpdater.on('update-available', () => {
  win.webContents.send('updateAvailable');
});

autoUpdater.on('update-downloaded', () => {
  win.webContents.send('updateDownloaded');
});