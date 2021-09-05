import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { PackageSelection } from './PackageSelection';
import { mockApi } from '../../services/MainApi.mock';
import { createBrowserHistory } from "history";
import { Router } from 'react-router-dom'

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
        await waitFor(() => {
            expect(screen.getAllByRole('img').length).toBe(3);
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

});