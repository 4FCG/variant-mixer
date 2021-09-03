const path = require('path');
const fs = require("fs");
const { readdir, lstat, access, copyFile, rmdir } = require('fs/promises');
const sharp = require('sharp');
const decompress = require("decompress");

const { app, BrowserWindow, ipcMain, protocol, dialog } = require('electron');
const isDev = require('electron-is-dev');
const { url } = require('inspector');
const { format } = require('url');

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
    icon: path.join(__dirname + './icon.ico'),
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
      : format({
        pathname: path.join(__dirname,'../build/index.html'),
        protocol: 'file',
        slashes: true
      })
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
              try {
                let imagePath = await getBaseImage(packagePath);
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

const allowedExtensions = ['.png', '.jpg', '.jpeg', '.webp'];

async function getBaseImage(directory) {
  try {
    let files = await readdir(directory);
    for (let file of files) {
        let imagePath = path.join(directory, file);
        let extension = path.extname(file);
        if ((await lstat(imagePath)).isFile() && path.basename(file, extension) == 'Base') {
            if (allowedExtensions.includes(extension)) {
              return imagePath;
            }
        }
    }
  } catch (err) {
      console.error(err);
  }

  throw `No base image found in ${directory}`;
}

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
  let imagePath = null;
  try {
      imagePath = await getBaseImage(args);
  } catch {
    throw `No Base image found in ${args}`;
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
            let name = path.basename(file, path.extname(file));
            if (!name.endsWith('_thumbnail')) {
              let thumbnail = path.join(path.dirname(imagePath), `${name}_thumbnail.png`);
              // check if the thumbnail exists
              try {
                await access(thumbnail);
              } catch {
                // create missing thumbnail
                await createThumbnail(imagePath);
              }
              images.push({
                path: imagePath,
                previewPath: 'image://' + thumbnail.split(path.sep).join(path.posix.sep),
                overlayPath: 'image://' + imagePath.split(path.sep).join(path.posix.sep),
                name: name
              });
            }
          }
      }
  } catch (err) {
      console.error(err);
  }
  return images;
}

async function createThumbnail(imagePath) {
  return await sharp(imagePath)
    .trim()
    .toFile(path.join(path.dirname(imagePath), `${path.basename(imagePath, path.extname(imagePath))}_thumbnail.png`));
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

ipcMain.handle("exportQueue", async (event, args) => {
  // Retrieve folder through dialog
  let result = null;
  try {
    result = await dialog.showOpenDialog({
      title: "Select output folder",
      buttonLabel: "Select",
      filters: [
        {
          name: 'All Files', 
          extensions: ['*']
        }
      ],
      properties: ['openDirectory']
    });
  } catch (err) {
    console.error(err);
    return {canceled: true, error: {type: 'error', message: 'Something went wrong during selection.'}};
  }

  // Catch cancel
  if (result.canceled) {
    return {canceled: true, error: null};
  }

  let folder = result.filePaths[0];

  // Check if folder exists
  try {
    access(folder);
  } catch (err) {
    console.error(err);
    return {canceled: true, error: {type: 'error', message: 'The selected folder cannot be reached.'}};
  }

  // Output images
  try {
    let variants = [];
    for (let [index, variant] of args.entries()) {
      variants.push(generateComposite(variant.base, variant.layers, path.join(folder, index.toString())));
    }
    await Promise.all(variants);
  } catch (err) {
    console.error(err);
    return {canceled: true, error: {type: 'error', message: 'Something went wrong during image creation.'}};
  }
  return {canceled: false, error: null};
});

async function generateComposite(base, layers, savePath, filetype = 'jpeg') {
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
}

ipcMain.handle("importPackage", async () => {
  // Retrieve file path through dialog
  let result = null;
  try {
    result = await dialog.showOpenDialog({
      title: "Select package",
      buttonLabel: "Import",
      filters: [
        {
          name: "Zip file",
          extensions: ['zip']
        }
      ],
      properties: ['openFile']
    });
  } catch (err) {
    console.error(err);
    return {canceled: true, error: {type: 'error', message: 'Something went wrong during selection.'}};
  }

  // Ensure a zip file was picked
  if (result.canceled) {
    return {canceled: true, error: null};
  } else if (result.filePaths.length == 0 || !result.filePaths[0].endsWith('.zip')) {
    return {canceled: true, error: {type: 'warning', message: 'Please select a ZIP file.'}};
  }
  
  // Relocate, unzip and check integrity
  let source = result.filePaths[0];
  let folderName = path.basename(source, path.extname(source));
  let outputFolder = path.join(app.getPath('userData'), `/Packages/${folderName}`);
  let files = [];
  try {
    files = await decompress(source, outputFolder);
  } catch (err) {
    console.error(err);
    return {canceled: true, error: {type: 'error', message: 'Something went wrong during file processing.'}};
  }
  // check if Base image exists
  if (!files.some(file => file.path.includes('Base.'))) {
    // remove bad package from folder
    try {
      await rmdir(outputFolder, { recursive: true });
    } catch (err) {
      console.error(err);
    }
    return {canceled: true, error: {type: 'warning', message: 'The package is not in the correct format.'}};
  }

  return {canceled: false, error: null};
});