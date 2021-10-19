const exportImage = require('./exportImage');
const { ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');
const { fileExists } = require('../helpers');

const testFolder = path.join(__dirname, '..', '..', 'test').toString();
const testPackPath = path.join(testFolder, 'assets', 'testPackage');

describe('deletePackage tests', () => {
    let createdImages = [];

    beforeEach(() => {
        jest.clearAllMocks();
        createdImages = [];
    });

    afterEach(async () => {
        createdImages.forEach(async (imagePath) => {
            try {
                await fs.promises.unlink(imagePath);
            } catch (err) {
                console.error(err);
            }
        });
    });

    test('Exports composite image', async () => {
        // Create test data
        const fakeImagePath = path.join(testFolder, 'testImage.jpeg');
        createdImages.push(fakeImagePath);
        const fakeArgs = {
            base: path.join(testPackPath, 'Base.png'),
            layers: [path.join(testPackPath, '1', 'Glasses.png')]
        };

        // Set fake dialog output
        dialog.showSaveDialog.mockResolvedValue({
            filePath: fakeImagePath,
            canceled: false
        });

        // Apply handler jest function
        exportImage.configure();
        // Grab and run callback function with fakeArgs
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, fakeArgs);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: false, error: null, result: fakeImagePath.split('.').slice(0, -1).join('.') });
        // Check if file is made
        const exists = await fileExists(fakeImagePath);
        expect(exists).toBe(true);
    });

    test('Cancels export when save dialog is canceled', async () => {
        // Set fake dialog cancel
        dialog.showSaveDialog.mockResolvedValue({
            filePath: '',
            canceled: true
        });

        // Apply handler jest function
        exportImage.configure();
        // Grab and run callback function
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        // Check if cancel response is given
        expect(result).toStrictEqual({ canceled: true, error: null });
    });

    test('Returns error when composite generation fails', async () => {
        // Set dialog return
        dialog.showSaveDialog.mockResolvedValue({
            filePath: 'notAnActualPath',
            canceled: false
        });
        // set fake args
        const fakeArgs = {
            base: 'notAnActualPath',
            layers: ['notAnActualPath']
        };

        // Apply handler jest function
        exportImage.configure();
        // Grab and run callback function with improper args
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, fakeArgs);

        // Check if error response is given
        expect(result).toStrictEqual({ canceled: true, error: { type: 'error', message: 'Something went wrong while generating image.' }, result: null });
    });

    test('Returns error when dialog fails', async () => {
        // Set fake dialog error
        dialog.showSaveDialog.mockRejectedValue(null);

        // Apply handler jest function
        exportImage.configure();
        // Grab and run callback function
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        // Check if error response is given
        expect(result).toStrictEqual({ canceled: true, error: { type: 'error', message: 'Something went wrong while selecting export location.' }, result: null });
    });
});
