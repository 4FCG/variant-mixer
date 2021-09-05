import logo from '../assets/logo.png';

const mockListPackages = [
    {
        path: logo,
        img: logo
    },
    {
        path: logo,
        img: logo
    }
];

const mockImportPackage = {canceled: false, error: null};
const mockImportPackageError = {canceled: true, error: {type: 'error', message: 'Test Error'}};

// Run to mock the Api
export function mockApi(options) {
    window.mainApi = {
        listPackages: jest.fn().mockResolvedValue(mockListPackages),
        importPackage: jest.fn().mockResolvedValue(options?.importPackageError ? mockImportPackageError : mockImportPackage)
    };
}