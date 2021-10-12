const { ipcMain, dialog, app } = require('electron');
const { extname, basename, join } = require('path');
const { rmdir } = require('fs/promises');
const extract = require('extract-zip');
const { getBaseImage } = require('../helpers');

module.exports = {
    configure: () => {
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
            } else if (result.filePaths.length === 0 || !result.filePaths[0].endsWith('.zip')) {
                return {canceled: true, error: {type: 'warning', message: 'Please select a ZIP file.'}};
            }
            
            // Relocate, unzip and check integrity
            let source = result.filePaths[0];
            let folderName = basename(source, extname(source));
            let outputFolder = join(app.getPath('userData'), `/Packages/${folderName}`);
            try {
                // Unzip, filter out empty folders called / to prevent crash
                await extract(source, { dir: outputFolder })
            } catch (err) {
                console.error(err);
                return {canceled: true, error: {type: 'error', message: 'Something went wrong during file processing.'}};
            }
          
            // check if Base image exists
            try {
                await getBaseImage(outputFolder);
            } catch {
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
    }
};