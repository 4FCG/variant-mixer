const path = require('path');
const fs = require("fs");
const { readdir, lstat, access } = require('fs/promises');
const sharp = require('sharp');

const { app, BrowserWindow, ipcMain, protocol, dialog } = require('electron');
const isDev = require('electron-is-dev');

function setup() {
  let dataPath = path.join(app.getPath('userData'), '/Packages');
  if (!fs.existsSync(dataPath)){
    fs.mkdirSync(dataPath);
  }
}

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 600,
    minHeight: 450,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      webSecurity: isDev ? true : true,
      preload: path.join(__dirname, "preload.js")
    },
  });

  // and load the index.html of the app.
  // win.loadFile("index.html");
  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );
  // Open the DevTools.
  if (isDev) {
    win.webContents.openDevTools({ mode: 'detach' });
  }
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  protocol.registerFileProtocol('image', (request, callback) => {
    const url = request.url.substr(7)
    callback({ path: url })
  })
  setup()
  createWindow()
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

ipcMain.handle("listPackages", async () => {
  let packages = [];
    let packageFolder = path.join(app.getPath('userData'), '/Packages');
    try {
    let files = await readdir(packageFolder);
    for (let file of files) {
        let packagePath = path.join(packageFolder, file)
        if ((await lstat(packagePath)).isDirectory()) {
            let imagePath = path.join(packagePath, 'Base.png');
            try {
                await access(imagePath);
                packages.push({
                    path: packagePath,
                    img: 'image://' + imagePath.split(path.sep).join(path.posix.sep)
                });
            } catch {
                console.error(`Base image not found in ${packagePath}`);
            }
        }
    }
    } catch (err) {
        console.error(err);
    }
    return packages;
});

ipcMain.handle("loadPackage", async (event, args) => {
  let layers = [];
  try {
      let files = await readdir(args);
      for (let file of files) {
          let layerPath = path.join(args, file);
          if ((await lstat(layerPath)).isDirectory()) {
              layers.push(await loadImages(layerPath));
          }
      }
  } catch {
      throw 'Path does not lead to folder.';
  }
  let imagePath = path.join(args, 'Base.png');
  try {
      await access(imagePath);
  } catch {
    throw 'No Base.png found in package folder';
  }

  return {
    layers: layers,
    path: imagePath,
    img: 'image://' + imagePath.split(path.sep).join(path.posix.sep)
  };
});

async function loadImages(layerPath) {
  let images = [];
  try {
      let files = await readdir(layerPath);
      for (let file of files) {
          let imagePath = path.join(layerPath, file);
          if ((await lstat(imagePath)).isFile()) {
              images.push({
                  path: imagePath,
                  previewPath: 'image://' + imagePath.split(path.sep).join(path.posix.sep),
                  name: file.split('.')[0]
              });
          }
      }
  } catch (err) {
      console.error(err);
  }
  return images;
}

ipcMain.handle("exportImage", async (event, args) => {
  let result = null;
  try {
    result = await dialog.showSaveDialog({
      title: 'Export image',
      defaultPath: 'Variant',
      buttonLabel: 'Export',
      filters: [
        {
          name: "JPEG",
          extensions: ['jpeg', 'jpg']
        },
        {
          name: "PNG",
          extensions: ['png']
        },
        {
          name: "WebP",
          extensions: ['webp']
        }
      ]
    });
  } catch(err) {
    console.error(err);
    return false;
  }

  if (result.canceled) {
    return false;
  }

  try {
    await generateComposite(args.base, args.layers, result.filePath.split('.').slice(0, -1).join('.'), result.filePath.split('.').pop());
    return true;
  } catch (err) {
    console.error(err);
  }
  return false;
});

async function generateComposite(base, layers, savePath, filetype) {
    console.log(base, layers);
    const data = await Promise.all(layers.map(layer => sharp(layer).toBuffer()));
    const files = data.map(buffer => ({input: buffer}));
    let composite = sharp(base);
    if (layers.length > 0) {
      composite.composite(files);
    }
    if (filetype == 'png') {
      composite.png();
    } else if (filetype == 'webp') {
      composite.webp({ quality: 100 })
    }
    else {
      filetype = 'jpeg'
      composite.jpeg({
        quality: 100,
        mozjpeg: true
      });
    }
    composite.toFile(`${savePath}.${filetype}`);
    await composite;
    console.log(`${savePath}.${filetype}`);
}