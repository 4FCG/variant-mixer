const { ipcMain, dialog } = require('electron');
const { generateComposite } = require('../helpers');

module.exports = {
    configure: () => {
        ipcMain.handle("exportImage", async (event, args) => {
            let result = null;
            try {
                // Get output path
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
                return {canceled: true, error: {type: 'error', message: 'Something went wrong while selecting export location.'}, result: null};
            }
          
            if (result.canceled) {
                return {canceled: true, error: null};
            }
          
            try {
                // Create image
                await generateComposite(args.base, args.layers, result.filePath.split('.').slice(0, -1).join('.'), result.filePath.split('.').pop());
            } catch (err) {
                console.error(err);
                return {canceled: true, error: {type: 'error', message: 'Something went wrong while generating image.'}, result: null};
            }
            return {canceled: false, error: null, result: result.filePath.split('.').slice(0, -1).join('.')};
        });
    }
};