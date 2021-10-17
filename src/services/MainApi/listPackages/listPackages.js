const { app, ipcMain } = require('electron');
const { readdir, lstat } = require('fs/promises');
const path = require('path');
const { getBaseImage } = require('../helpers');

module.exports = {
    configure: () => {
        ipcMain.handle('listPackages', async () => {
            const packages = [];
            let warning = false;
            const packageFolder = path.join(app.getPath('userData'), '/Packages');
            try {
                const files = await readdir(packageFolder);
                for (const file of files) {
                    const packagePath = path.join(packageFolder, file);
                    // Check if file is package folder
                    if ((await lstat(packagePath)).isDirectory()) {
                        try {
                            // Attempt to find Base image of package
                            const imagePath = await getBaseImage(packagePath);
                            // Add package to package list
                            packages.push({
                                path: packagePath,
                                img: '"image://' + imagePath.split(path.sep).join(path.posix.sep) + '"'
                            });
                        } catch {
                            console.error(`Base image not found in ${packagePath}`);
                            // Enable package could not load warning
                            warning = true;
                        }
                    }
                }
            } catch (err) {
                console.error(err);
                return { canceled: true, error: { type: 'error', message: 'Something went wrong while loading packages.' }, result: [] };
            }
            return { canceled: false, error: warning ? { type: 'warning', message: 'One or more packages could not be loaded.' } : null, result: packages };
        });
    }
};
