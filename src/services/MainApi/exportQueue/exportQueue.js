const { ipcMain, dialog } = require('electron');
const { access } = require('fs/promises');
const { join } = require('path');
const { generateComposite } = require('../helpers');

module.exports = {
    configure: () => {
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
                return {canceled: true, error: {type: 'error', message: 'Something went wrong during selection.'}};
            }
          
            // Catch cancel
            if (result.canceled) {
                return {canceled: true, error: null};
            }
          
            let folder = result.filePaths[0];
          
            // Check if folder exists
            try {
                await access(folder);
            } catch (err) {
                return {canceled: true, error: {type: 'error', message: 'The selected folder cannot be reached.'}};
            }
          
            // Output images
            try {
                let variants = [];
                for (let [index, variant] of args.entries()) {
                    variants.push(generateComposite(variant.base, variant.layers, join(folder, index.toString())));
                }
                await Promise.all(variants);
            } catch (err) {
                return {canceled: true, error: {type: 'error', message: 'Something went wrong during image creation.'}};
            }
            return {canceled: false, error: null};
        });
    }
};