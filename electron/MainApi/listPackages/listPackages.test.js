const listPackages = require('./listPackages');
const { ipcMain, app } = require('electron');
const path = require('path');

const testFolder = path.join(__dirname, '..', '..', '..', 'test').toString();
const testGoodPackage = path.join(testFolder, 'assets', 'goodListTest');
const testBadPackage = path.join(testFolder, 'assets', 'badListTest');

const goodTestResult = [{
    path: path.join(testGoodPackage, 'Packages', 'goodPackage'),
    img: `"image://${path.join(testGoodPackage, 'Packages', 'goodPackage', 'Base.png').split(path.sep).join(path.posix.sep)}"`
}];

describe('listPackages tests', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Lists all packages', async () => {
        // Point to good test Packages folder
        app.getPath.mockReturnValue(testGoodPackage);

        // Apply handler jest function
        listPackages.configure();
        // Grab and run callback function without args
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: false, error: null, result: goodTestResult });
    });

    test('Returns warning when bad packages is in the directory', async () => {
        // Point to test bad Packages folder
        app.getPath.mockReturnValue(testBadPackage);

        // Apply handler jest function
        listPackages.configure();
        // Grab and run callback function without args
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: false, error: { type: 'warning', message: 'One or more packages could not be loaded.' }, result: [] });
    });

    test('Returns error when listing fails', async () => {
        // Point to fake folder
        app.getPath.mockReturnValue('thisFolderDoesNotExist');

        // Apply handler jest function
        listPackages.configure();
        // Grab and run callback function without args
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: true, error: { type: 'error', message: 'Something went wrong while loading packages.' }, result: [] });
    });
});
