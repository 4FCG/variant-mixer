import logo from '../assets/logo.png';

// List
const mockListPackages = {
    canceled: false,
    error: null,
    result: [
        {
            path: logo,
            img: logo
        },
        {
            path: logo,
            img: logo
        }
    ]
};
const mockListPackagesWarning = {
    canceled: false,
    error: { type: 'warning', message: 'List Warning' },
    result: [
        {
            path: logo,
            img: logo
        }
    ]
};
const mockListPackagesError = { canceled: true, error: { type: 'error', message: 'List Error' }, result: [] };

// Import
const mockImportPackage = { canceled: false, error: null };
const mockImportPackageError = { canceled: true, error: { type: 'error', message: 'Test Error' } };

// Load
const mockLoadPackage = {
    canceled: false,
    error: null,
    result: {
        path: logo,
        img: logo,
        layers: [
            [
                { path: logo, previewPath: logo, overlayPath: logo, name: 'Sample Layer 1', active: false },
                { path: logo, previewPath: logo, overlayPath: logo, name: 'Sample Layer 2', active: false }
            ],
            [
                { path: logo, previewPath: logo, overlayPath: logo, name: 'Sample Layer 3', active: false }
            ]
        ]
    }
};
const mockLoadPackageError = { canceled: true, error: { type: 'error', message: 'Sample Error' }, result: null };

// Export
const mockExportImage = { canceled: false, error: null, result: '/folder/SampleImage' };
const mockExportImageError = { canceled: true, error: { type: 'error', message: 'Export Error' }, result: null };

// QueueState
export const mockQueueState = new Array(3).fill({
    baseImg: 'logo.png',
    layers: [
        {
            overlayPath: 'logo.png',
            path: 'logo.png'
        }
    ],
    path: 'logo.png'
});

// Export Queue
const mockExportQueue = { canceled: false, error: null };
const mockExportQueueError = { canceled: true, error: { type: 'error', message: 'Queue Error' } };

// Delete
const mockDeletePackage = { canceled: false, error: null };
const mockDeletePackageError = { canceled: true, error: { type: 'error', message: 'Delete Error' } };

// Run to mock the Api
export function mockApi (options) {
    let listPackagesMock = null;
    if (options?.listPackagesError) {
        listPackagesMock = mockListPackagesError;
    } else if (options?.listPackagesWarning) {
        listPackagesMock = mockListPackagesWarning;
    } else {
        listPackagesMock = mockListPackages;
    }

    window.mainApi = {
        listPackages: jest.fn().mockResolvedValue(listPackagesMock),
        importPackage: jest.fn().mockResolvedValue(options?.importPackageError ? mockImportPackageError : mockImportPackage),
        loadPackage: jest.fn().mockResolvedValue(options?.loadPackageError ? mockLoadPackageError : mockLoadPackage),
        exportImage: jest.fn().mockResolvedValue(options?.exportImageError ? mockExportImageError : mockExportImage),
        exportQueue: jest.fn().mockResolvedValue(options?.exportQueueError ? mockExportQueueError : mockExportQueue),
        deletePackage: jest.fn().mockResolvedValue(options?.deletePackageError ? mockDeletePackageError : mockDeletePackage),
        onEvent: jest.fn()
    };
}
