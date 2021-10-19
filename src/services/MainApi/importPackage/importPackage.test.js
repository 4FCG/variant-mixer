const importPackage = require('./importPackage');
const { ipcMain, dialog, app } = require('electron');
const fs = require('fs');
const path = require('path');
const { fileExists } = require('../helpers');

const testFolder = path.join(__dirname, '..', '..', 'test').toString();
const testImportPath = path.join(testFolder, 'assets', 'testImportPackage.zip');
const testBadImportPath = path.join(testFolder, 'assets', 'testBadPackage.zip');

describe('exportQueue tests', () => {
    let createdFolders = [];

    beforeEach(() => {
        jest.clearAllMocks();
        app.getPath.mockReturnValue(testFolder);
        createdFolders = [];
    });

    afterEach(async () => {
        createdFolders.forEach(async (packPath) => {
            try {
                await fs.promises.rmdir(packPath, { recursive: true });
            } catch {
                // ignore if folder is already gone
            }
        });
    });

    test('Cancels import when file selection is canceled', async () => {
        // Set fake dialog cancel
        dialog.showOpenDialog.mockResolvedValue({
            filePaths: [],
            canceled: true
        });

        // Apply handler jest function
        importPackage.configure();
        // Grab and run callback function without args
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: true, error: null });
    });

    test('Cancels import when selected file is not zip', async () => {
        // Set dialog with jpeg file
        dialog.showOpenDialog.mockResolvedValue({
            filePaths: ['notZip.jpeg'],
            canceled: false
        });

        // Apply handler jest function
        importPackage.configure();
        // Grab and run callback function without args
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: true, error: { type: 'warning', message: 'Please select a ZIP file.' } });
    });

    test('Returns proper error when unzip fails', async () => {
        // Set dialog with fake zip file
        dialog.showOpenDialog.mockResolvedValue({
            filePaths: ['thisDoesNotExist.zip'],
            canceled: false
        });

        // Apply handler jest function
        importPackage.configure();
        // Grab and run callback function without args
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: true, error: { type: 'error', message: 'Something went wrong during file processing.' } });
    });

    test('Returns proper error when package is not of proper format', async () => {
        // Set dialog with test bad package
        dialog.showOpenDialog.mockResolvedValue({
            filePaths: [testBadImportPath],
            canceled: false
        });

        // Apply handler jest function
        importPackage.configure();
        // Grab and run callback function without args
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        const unzippedPackage = path.join(testFolder, 'Packages', 'testBadPackage');

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: true, error: { type: 'warning', message: 'The package is not in the correct format.' } });

        // When the package is bad, autoDelete should remove it afterwards
        const exists = await fileExists(unzippedPackage);
        expect(exists).toBe(false);
    });

    test('Can import a proper package', async () => {
        // Set dialog with test bad package
        dialog.showOpenDialog.mockResolvedValue({
            filePaths: [testImportPath],
            canceled: false
        });

        // Apply handler jest function
        importPackage.configure();
        // Grab and run callback function without args
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        const unzippedPackage = path.join(testFolder, 'Packages', 'testImportPackage');
        createdFolders.push(unzippedPackage);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: false, error: null });

        // Check if the unzipped package exists
        const exists = await fileExists(unzippedPackage);
        expect(exists).toBe(true);
    });

    test('Returns error when dialog fails', async () => {
        // Set fake dialog error
        dialog.showOpenDialog.mockRejectedValue(null);

        // Apply handler jest function
        importPackage.configure();
        // Grab and run callback function without args
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: true, error: { type: 'error', message: 'Something went wrong during selection.' } });
    });
});
