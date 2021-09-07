import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { PackageSelection } from './PackageSelection';
import { mockApi } from '../../services/MainApi.mock';
import { createBrowserHistory } from "history";
import { Router } from 'react-router-dom';

describe("PackageSelection", () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    test('Renders all packages given by the API', async () => {  
        // Run to apply mockApi
        mockApi();
        render(<PackageSelection />);

        // Check if all images are rendered
        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBe(3);
        });
    });

    test('Display error when one or more packages did not load', async () => {  
        // mockApi with list packages warning
        mockApi({listPackagesWarning: true});
        render(<PackageSelection />);

        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBe(2);
        });

        // Check if error is being displayed
        await waitFor(() => {
            expect(screen.getByText(/List Warning/i)).toBeInTheDocument();
        });

        // Check if error got removed after some time passes
        await waitFor(() => {
            expect(screen.queryByText(/List Warning/i)).not.toBeInTheDocument();
        });
    });

    test('Displays error when loading packages fails', async () => {  
        // mockApi with list packages error
        mockApi({listPackagesError: true});
        render(<PackageSelection />);
        
        // Check if error is being displayed
        await waitFor(() => {
            expect(screen.getByText(/List Error/i)).toBeInTheDocument();
        });

        // Check if error got removed after some time passes
        await waitFor(() => {
            expect(screen.queryByText(/List Error/i)).not.toBeInTheDocument();
        });
    });

    test('Redirects to variant selection when package is clicked', async () => {
        mockApi();

        // Mock Router history, Redirect component uses history.replace
        const history = createBrowserHistory();
        history.replace = jest.fn();

        render(
            <Router history={history} >
                <PackageSelection />
            </Router>
        );

        // Wait until API results are rendered
        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBe(3);
        });

        let packages = await screen.findAllByRole('img');
        fireEvent.click(packages[0]);

        // Check if replace was called with the correct path and state info
        expect(history.replace).toHaveBeenCalledWith(expect.objectContaining({
            "pathname": "/variant",
            "state": {"packagePath": "logo.png"}
        }));

    });

    test('Imports new package and renders it', async () => {
        mockApi();
        let getPackages = jest.spyOn(PackageSelection.prototype, 'getPackages');

        render(
            <PackageSelection />
        );

        // Wait until API results are rendered
        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBe(3);
        });

        let packages = await screen.findAllByRole('img');
        // Import button is always last package
        fireEvent.click(packages[packages.length - 1]);

        // A successful import rerenders packages so look for 2 calls
        // Cannot check if 3 images are rendered due to import not actually adding anything to state.
        await waitFor(() => {
            expect(getPackages).toHaveBeenCalledTimes(2);
        });
    });

    test('Displays error when import fails', async () => {
        mockApi({importPackageError: true});
        render(<PackageSelection />);

        // Wait until API results are rendered
        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBe(3);
        });

        let packages = await screen.findAllByRole('img');
        // Import button is always last package
        fireEvent.click(packages[packages.length - 1]);

        // Check if error is being displayed
        await waitFor(() => {
            expect(screen.getByText(/Test Error/i)).toBeInTheDocument();
        });

        // Check if error got removed after some time passes
        await waitFor(() => {
            expect(screen.queryByText(/Test Error/i)).not.toBeInTheDocument();
        });
    });

    test('Right click on a package opens the contextmenu', async () => {
        mockApi();

        render(
            <PackageSelection />
        );

        // Wait until API results are rendered
        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBe(3);
        });

        let packages = await screen.findAllByRole('img');
        fireEvent.contextMenu(packages[0]);

        // Check if contextmenu opens with delete button
        await waitFor(() => {
            expect(screen.getByRole('button', {name: /Delete Package/i})).toBeInTheDocument();
        });
    });

    test('Delete button closes menu', async () => {
        mockApi();

        render(
            <PackageSelection />
        );

        // Wait until API results are rendered
        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBe(3);
        });

        let packages = await screen.findAllByRole('img');
        fireEvent.contextMenu(packages[0]);

        // Wait for delete button
        let deleteButton = await screen.findByRole('button', {name: /Delete Package/i});
        fireEvent.click(deleteButton);

        await waitFor(() => {
            // Menu should close after click
            expect(screen.queryByRole('button', {name: /Delete Package/i})).not.toBeInTheDocument();
        });
    });

    test('Delete button calls delete API', async () => {
        mockApi();
        const deletePackage = jest.spyOn(window.mainApi, 'deletePackage');

        render(
            <PackageSelection />
        );

        // Wait until API results are rendered
        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBe(3);
        });

        let packages = await screen.findAllByRole('img');
        fireEvent.contextMenu(packages[0]);

        // Wait for delete button
        let deleteButton = await screen.findByRole('button', {name: /Delete Package/i});
        fireEvent.click(deleteButton);

        await waitFor(() => {
            // Delete should be ran with logo.png, this is what the mock api sets as path
            expect(deletePackage).toBeCalledWith("logo.png");
        });
    });

    test('Delete renders error message upon failure', async () => {
        mockApi({deletePackageError: true});

        render(
            <PackageSelection />
        );

        // Wait until API results are rendered
        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBe(3);
        });

        let packages = await screen.findAllByRole('img');
        fireEvent.contextMenu(packages[0]);

        // Wait for delete button
        let deleteButton = await screen.findByRole('button', {name: /Delete Package/i});
        fireEvent.click(deleteButton);

        await waitFor(() => {
            // Check if error is displayed
            expect(screen.getByText(/Delete Error/i)).toBeInTheDocument();
        });
    });

});