const { ipcMain, app } = require('electron');
const { isAbsolute, relative, join } = require('path');
const fs = require('fs');

module.exports = {
    configure: () => {
        ipcMain.handle("deletePackage", async (event, args) => {

            // Check if the args folder is a subpath of the packages folder
            const relativePath = relative(join(app.getPath('userData'), '/Packages'), args);
            const isSubDir = relativePath && !relativePath.startsWith('..') && !isAbsolute(relativePath);
            
            // Check if given path is a package path
            if (!isSubDir) {
              return {canceled: true, error: {type: 'error', message: 'The path did not point to a package folder'}};
            }
            try {
              await fs.promises.rmdir(args, { recursive: true });
            } catch (err) {
              console.error(err);
              return {canceled: true, error: {type: 'error', message: 'Something went wrong while deleting the package'}};
            }
          
            return {canceled: false, error: null};
          });
    }
};