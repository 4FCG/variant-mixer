const { ipcMain, dialog, app } = require('electron');
const { extname, basename, join, resolve } = require('path');
const { rmdir, access, readdir } = require('fs/promises');
const extract = require('extract-zip');
const { getBaseImage } = require('../helpers');

module.exports = {
    configure: () => {
        ipcMain.handle('importPackage', async () => {
            // Retrieve file path through dialog
            let result = null;
            try {
                result = await dialog.showOpenDialog({
                    title: 'Select package',
                    buttonLabel: 'Import',
                    filters: [
                        {
                            name: 'Zip file',
                            extensions: ['zip']
                        }
                    ],
                    properties: ['openFile']
                });
            } catch (err) {
                return { canceled: true, error: { type: 'error', message: 'Something went wrong during selection.' } };
            }

            // Ensure a zip file was picked
            if (result.canceled) {
                return { canceled: true, error: null };
            } else if (result.filePaths.length === 0 || !result.filePaths[0].endsWith('.zip')) {
                return { canceled: true, error: { type: 'warning', message: 'Please select a ZIP file.' } };
            }

            // Relocate, unzip and check integrity
            const source = result.filePaths[0];
            const folderName = basename(source, extname(source));
            const outputFolder = join(app.getPath('userData'), `/Packages/${folderName}`);
            try {
                // Ensure source file exists
                await access(source);
                // Unzip, TODO: filter out empty folders called / to prevent crash
                await extract(source, { dir: outputFolder });
            } catch (err) {
                return { canceled: true, error: { type: 'error', message: 'Something went wrong during file processing.' } };
            }

            // check if Base image exists
            try {
                await checkPackageIntegrity(outputFolder);
                await getBaseImage(outputFolder);
            } catch {
                // remove bad package from folder
                try {
                    await rmdir(outputFolder, { recursive: true });
                } catch (err) {
                    console.error(err);
                }
                return { canceled: true, error: { type: 'warning', message: 'The package is not in the correct format.' } };
            }

            return { canceled: false, error: null };
        });
    }
};

const allowedExtensions = ['.png', '.jpeg', '.jpg', '.webp'];

// Ensure that no non image files are present in the package folder.
async function checkPackageIntegrity (packagePath) {
    const content = await readdir(packagePath, { withFileTypes: true });
    for (const file of content) {
        if (file.isDirectory()) {
            await checkPackageIntegrity(resolve(packagePath, file.name));
        } else if (file.isFile()) {
            const fileExtension = extname(file.name);
            if (!allowedExtensions.includes(fileExtension)) {
                throw new Error(`${fileExtension} is not allowed to be in a package folder.`);
            }
        }
    }
}
