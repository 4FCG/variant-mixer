import logo from '../assets/logo.png';

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
    error: {type: 'warning', message: 'List Warning'}, 
    result: [
        {
            path: logo,
            img: logo
        }
    ]
};
const mockListPackagesError = {canceled: true, error: {type: 'error', message: 'List Error'}, result: []};

const mockImportPackage = {canceled: false, error: null};
const mockImportPackageError = {canceled: true, error: {type: 'error', message: 'Test Error'}};

// Run to mock the Api
export function mockApi(options) {
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
        importPackage: jest.fn().mockResolvedValue(options?.importPackageError ? mockImportPackageError : mockImportPackage)
    };
}