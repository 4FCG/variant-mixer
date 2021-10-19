const deletePackage = require('./deletePackage');
const { ipcMain, app } = require('electron');
const fs = require('fs-extra');
const path = require('path');
const { fileExists } = require('../helpers');

const testFolder = path.join(__dirname, '..', '..', 'test').toString();

describe('deletePackage tests', () => {
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

    test('Returns error if folder does not exist', async () => {
        // Apply handler jest function
        deletePackage.configure();
        // Grab and run callback function with a folder that does not exist
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, 'Nonexistent folder');

        // Check if the bad folder error is returned
        expect(result).toStrictEqual({ canceled: true, error: { type: 'error', message: 'The path did not point to a package folder' } });
    });

    test('Removes package folder', async () => {
        // Copy test package for removal
        const src = path.join(testFolder, 'assets', 'testPackage');
        const dest = path.join(testFolder, 'Packages', 'testPackage');
        try {
            await fs.copy(src, dest);
        } catch (err) {
            console.error(err);
        }

        createdFolders.push(dest);

        // Apply handler jest function
        deletePackage.configure();
        // Grab and run callback function with testPackage
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, dest);

        // Check if package folder is deleted and proper message is returned
        expect(result).toStrictEqual({ canceled: false, error: null });
        const exists = await fileExists(dest);
        expect(exists).toBe(false);
    });

    test('Returns proper error when deletion fails', async () => {
        // Copy test package for removal
        const src = path.join(testFolder, 'assets', 'testPackage');
        const dest = path.join(testFolder, 'Packages', 'testPackage');
        try {
            await fs.copy(src, dest);
            createdFolders.push(dest);
        } catch (err) {
            console.error(err);
        }

        // make rmdir throw error -- CLEAR THIS --
        const mockRmdir = jest.spyOn(fs.promises, 'rmdir');
        mockRmdir.mockImplementationOnce(async () => {
            throw new Error();
        });

        // Apply handler jest function
        deletePackage.configure();
        // Grab callback function with testPackage
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, dest);

        // Check if proper error message is returned
        expect(result).toStrictEqual({ canceled: true, error: { type: 'error', message: 'Something went wrong while deleting the package' } });
    });
});
