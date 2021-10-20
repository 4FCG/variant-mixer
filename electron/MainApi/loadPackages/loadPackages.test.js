const loadPackages = require('./loadPackages');
const { ipcMain } = require('electron');
const path = require('path');
const extract = require('extract-zip');
const { fileExists } = require('../helpers');
const fs = require('fs');

// Set folder paths
const testFolder = path.join(__dirname, '..', '..', '..', 'test').toString();
const testPackage = path.join(testFolder, 'assets', 'testPackage');
const testEmptyPackage = path.join(testFolder, 'assets', 'testImportPackage.zip');
const testEmptyPackageDest = path.join(testFolder, 'testLoadFolder');
const testBadPackage = path.join(testFolder, 'assets', 'testBadPackage.zip');
const testBadPackageDest = path.join(testFolder, 'testBadFolder');

const correctResult = {
    canceled: false,
    error: null,
    result: {
        img: `"image://${path.join(testPackage, 'Base.png').split(path.sep).join(path.posix.sep)}"`,
        layers: [
            [
                {
                    name: 'Glasses',
                    overlayPath: `"image://${path.join(testPackage, '1', 'Glasses.png').split(path.sep).join(path.posix.sep)}"`,
                    path: path.join(testPackage, '1', 'Glasses.png'),
                    previewPath: `"image://${path.join(testPackage, '1', 'Glasses_thumbnail.png').split(path.sep).join(path.posix.sep)}"`
                },
                {
                    name: 'Mustache',
                    overlayPath: `"image://${path.join(testPackage, '1', 'Mustache.png').split(path.sep).join(path.posix.sep)}"`,
                    path: path.join(testPackage, '1', 'Mustache.png'),
                    previewPath: `"image://${path.join(testPackage, '1', 'Mustache_thumbnail.png').split(path.sep).join(path.posix.sep)}"`
                }
            ]
        ],
        path: path.join(testPackage, 'Base.png')
    }
};

describe('loadPackages tests', () => {
    let createdFolders = [];

    beforeEach(() => {
        jest.clearAllMocks();
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

    test('Loads package properly', async () => {
        // Apply handler jest function
        loadPackages.configure();
        // Grab and run callback function with testPackage as arg
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, testPackage);

        // Check if the right output is given
        expect(result).toStrictEqual(correctResult);
    });

    test('Generates thumbnail files if missing', async () => {
        // Create package without thumbnails for testing
        await extract(testEmptyPackage, { dir: testEmptyPackageDest });
        createdFolders.push(testEmptyPackageDest);

        // Apply handler jest function
        loadPackages.configure();
        // Grab and run callback function with created package as arg
        const callback = ipcMain.handle.mock.calls[0][1];
        await callback(null, testEmptyPackageDest);

        // Test if thumbnail files were made
        const glassesThumbnail = await fileExists(path.join(testEmptyPackageDest, '1', 'Glasses_thumbnail.png'));
        const mustacheThumbnail = await fileExists(path.join(testEmptyPackageDest, '1', 'Mustache_thumbnail.png'));
        expect(glassesThumbnail).toBe(true);
        expect(mustacheThumbnail).toBe(true);
    });

    test('Returns proper error if package directory does not exist', async () => {
        // Apply handler jest function
        loadPackages.configure();
        // Grab and run callback function with fake directory
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, 'ThisFolderDoesNotExist');

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: true, error: { type: 'error', message: 'Path was not a folder' }, result: null });
    });

    test('Returns proper error if package does not contain a base image', async () => {
        // Create package without thumbnails for testing
        await extract(testBadPackage, { dir: testBadPackageDest });
        createdFolders.push(testBadPackageDest);

        // Apply handler jest function
        loadPackages.configure();
        // Grab and run callback function with created package as arg
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, testBadPackageDest);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: true, error: { type: 'error', message: 'No base image found in package.' }, result: null });
    });
});
