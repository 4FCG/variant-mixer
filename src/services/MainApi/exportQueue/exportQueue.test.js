const exportQueue = require('./exportQueue');
const { ipcMain, dialog } = require('electron');
const fs = require('fs');
const path = require('path');

const testFolder = path.join(__dirname, '..', '..', 'test').toString();
const testPackPath = path.join(testFolder, 'assets', 'testPackage');

describe('exportQueue tests', () => {
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

    test('Exports composite image for all variants in queue', async () => {
        // Create test data
        const mockDirPath = path.join(testFolder, 'exportQueueTestFolder');
        createdFolders.push(mockDirPath);
        try {
            await fs.promises.mkdir(mockDirPath);
        } catch (err) {
            console.error(err);
        }

        // Add 2 layers to the queue
        const fakeArgs = [
            {
                base: path.join(testPackPath, 'Base.png'),
                layers: [path.join(testPackPath, '1', 'Glasses.png')]
            },
            {
                base: path.join(testPackPath, 'Base.png'),
                layers: [path.join(testPackPath, '1', 'Mustache.png')]
            }
        ];

        // Set fake dialog output
        dialog.showOpenDialog.mockResolvedValue({
            filePaths: [mockDirPath],
            canceled: false
        });

        // Apply handler jest function
        exportQueue.configure();
        // Grab and run callback function with fakeArgs
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, fakeArgs);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: false, error: null });
        // Check if both images are made
        await expect(fs.promises.access(path.join(mockDirPath, '0.jpeg'))).resolves.toBe();
        await expect(fs.promises.access(path.join(mockDirPath, '1.jpeg'))).resolves.toBe();
    });

    test('Cancels export when folder selection is canceled', async () => {
        // Set fake dialog cancel
        dialog.showOpenDialog.mockResolvedValue({
            filePaths: [],
            canceled: true
        });

        // Apply handler jest function
        exportQueue.configure();
        // Grab and run callback function with fakeArgs
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: true, error: null });
    });

    test('Returns the right error when nonexistent folder is picked', async () => {
        // Path to dir the does not actually exist
        const mockDirPath = 'fakeFolder/fake';

        // Set fake dialog output
        dialog.showOpenDialog.mockResolvedValue({
            filePaths: [mockDirPath],
            canceled: false
        });

        // Apply handler jest function
        exportQueue.configure();
        // Grab and run callback function with fakeArgs
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: true, error: { type: 'error', message: 'The selected folder cannot be reached.' } });
    });

    test('Returns the right error when export fails', async () => {
        // Path to test dir
        const mockDirPath = testFolder;

        // Set fake dialog output
        dialog.showOpenDialog.mockResolvedValue({
            filePaths: [mockDirPath],
            canceled: false
        });

        // Add improper args
        const fakeArgs = [
            {
                base: '',
                layers: ''
            }
        ];

        // Apply handler jest function
        exportQueue.configure();
        // Grab and run callback function with fakeArgs
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, fakeArgs);

        // Check if the right output is given
        expect(result).toStrictEqual({ canceled: true, error: { type: 'error', message: 'Something went wrong during image creation.' } });
    });

    test('Returns error when folder dialog fails', async () => {
        // Set fake dialog error
        dialog.showOpenDialog.mockRejectedValue(null);

        // Apply handler jest function
        exportQueue.configure();
        // Grab and run callback function
        const callback = ipcMain.handle.mock.calls[0][1];
        const result = await callback(null, null);

        // Check if error response is given
        expect(result).toStrictEqual({ canceled: true, error: { type: 'error', message: 'Something went wrong during selection.' } });
    });
});
