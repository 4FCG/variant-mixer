const { ipcMain } = require('electron');
const { readdir, lstat } = require('fs/promises');
const { join, sep, posix } = require('path');
const { getBaseImage, loadImages } = require('../helpers');

module.exports = {
    configure: () => {
        ipcMain.handle('loadPackage', async (event, args) => {
            const layers = [];
            try {
                // Load all the images in the layer folders
                const files = await readdir(args);
                for (const file of files) {
                    const layerPath = join(args, file);
                    if ((await lstat(layerPath)).isDirectory()) {
                        layers.push(await loadImages(layerPath));
                    }
                }
            } catch {
                return { canceled: true, error: { type: 'error', message: 'Path was not a folder' }, result: null };
            }
            // Load the base image
            let imagePath = null;
            try {
                imagePath = await getBaseImage(args);
            } catch {
                return { canceled: true, error: { type: 'error', message: 'No base image found in package.' }, result: null };
            }

            return {
                canceled: false,
                error: null,
                result: {
                    layers: layers,
                    path: imagePath,
                    img: '"image://' + imagePath.split(sep).join(posix.sep) + '"'
                }
            };
        });
    }
};
