import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { VariantSelection } from './VariantSelection';
import { mockApi } from '../../services/MainApi.mock';

describe('VariantSelection', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    test('All layer select boxes are rendered', async () => {
        // Run to apply mockApi
        mockApi();
        // Location state is given by the redirect that leads to the page
        render(<VariantSelection location={{ state: { packagePath: 'fakePath' } }} queueHandle={jest.fn()} />);

        // Check if all selection boxes are rendered
        await waitFor(() => {
            expect(screen.getAllByRole('img', { name: /Sample Layer/i })).toHaveLength(3);
        });
    });

    test('Show error when loading package fails', async () => {
        // mock api with load package error
        mockApi({ loadPackageError: true });

        render(<VariantSelection location={{ state: { packagePath: 'fakePath' } }} queueHandle={jest.fn()} />);

        // Check if error is rendered and then removed
        await waitFor(() => {
            expect(screen.getByText(/Sample Error/i)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.queryByText(/Sample Error/i)).not.toBeInTheDocument();
        });
    });

    test('Shows base image when loaded', async () => {
        mockApi();

        render(<VariantSelection location={{ state: { packagePath: 'fakePath' } }} queueHandle={jest.fn()} />);

        // Check if base image is loaded
        await waitFor(() => {
            // 3 selection boxes + 1 base image
            expect(screen.getAllByRole('img')).toHaveLength(4);
            // No layers should be displayed yet
            expect(screen.queryByTestId('layer')).not.toBeInTheDocument();
        });
    });

    test('Does not render layers upon loading', async () => {
        mockApi();

        render(<VariantSelection location={{ state: { packagePath: 'fakePath' } }} queueHandle={jest.fn()} />);

        await waitFor(() => {
            // No layers should be displayed yet
            expect(screen.queryByTestId('layer')).not.toBeInTheDocument();
        });
    });

    test('Clicking a selection box displays a new layer', async () => {
        mockApi();

        render(<VariantSelection location={{ state: { packagePath: 'fakePath' } }} queueHandle={jest.fn()} />);

        // Wait until boxes are loaded
        const selectionBoxes = await screen.findAllByRole('img', { name: /Sample Layer/i });

        // Click the first image box
        fireEvent.click(selectionBoxes[0]);

        // Check if 1 new layer is activated and displayed
        await waitFor(() => {
            expect(screen.queryAllByTestId('layer').length).toBe(1);
        });
    });

    test('Activating a box displays active border', async () => {
        mockApi();

        render(<VariantSelection location={{ state: { packagePath: 'fakePath' } }} queueHandle={jest.fn()} />);

        // Wait until boxes are loaded
        const selectionBoxes = await screen.findAllByRole('img', { name: /Sample Layer/i });

        // Click the first image box
        fireEvent.click(selectionBoxes[0]);

        // Check if 1 new layer is activated and displayed
        await waitFor(() => {
            expect(selectionBoxes[0]).toHaveStyle('border: 4px solid');
        });
    });

    test('Adding to queue sends correct data', async () => {
        mockApi();

        const queueHandle = jest.fn();
        render(<VariantSelection location={{ state: { packagePath: 'fakePath' } }} queueHandle={queueHandle} />);

        // Wait until package is fully loaded
        await waitFor(() => {
            expect(screen.getAllByRole('img')).toHaveLength(4);
        });

        // Get selection boxes
        const selectionBoxes = screen.getAllByRole('img', { name: /Sample Layer/i });

        // Click the first selection box
        fireEvent.click(selectionBoxes[0]);

        // Wait for layer to be added
        await waitFor(() => {
            expect(screen.queryAllByTestId('layer').length).toBe(1);
        });

        // Get add to queue button
        const buttonElement = screen.getByRole('button', { name: /Add to queue/i });

        // Click the add to queue button
        fireEvent.click(buttonElement);

        // Check if queueHandle is used
        await waitFor(() => {
            expect(queueHandle).toHaveBeenCalledWith({
                baseImg: 'logo.png',
                // Check if the activated layer is present
                layers: [
                    {
                        overlayPath: 'logo.png',
                        path: 'logo.png'
                    }
                ],
                path: 'logo.png'
            });
        });
    });

    test('Export image button exports an image', async () => {
        mockApi();

        const exportImage = jest.spyOn(window.mainApi, 'exportImage');

        render(<VariantSelection location={{ state: { packagePath: 'fakePath' } }} queueHandle={jest.fn()} />);

        // Wait until package is fully loaded
        await waitFor(() => {
            expect(screen.getAllByRole('img')).toHaveLength(4);
        });

        // Get selection boxes
        const selectionBoxes = screen.getAllByRole('img', { name: /Sample Layer/i });

        // Click the first selection box
        fireEvent.click(selectionBoxes[0]);

        // Wait for layer to be added
        await waitFor(() => {
            expect(screen.queryAllByTestId('layer').length).toBe(1);
        });

        // Get export button
        const buttonElement = screen.getByRole('button', { name: /Export Image/i });

        // Click the export button
        fireEvent.click(buttonElement);

        // Check if export api was called with the correct data
        await waitFor(() => {
            expect(exportImage).toHaveBeenCalledWith({
                base: 'logo.png',
                // check if enabled layer is present
                layers: [
                    'logo.png'
                ]
            });
        });
    });

    test('Export image renders confirmation message', async () => {
        mockApi();

        render(<VariantSelection location={{ state: { packagePath: 'fakePath' } }} queueHandle={jest.fn()} />);

        // Wait until package is fully loaded
        await waitFor(() => {
            expect(screen.getAllByRole('img')).toHaveLength(4);
        });

        // Get export button
        const buttonElement = screen.getByRole('button', { name: /Export Image/i });

        // Click the export button
        fireEvent.click(buttonElement);

        // Check if confirmation message is displayed
        await waitFor(() => {
            expect(screen.getByText(/\/folder\/SampleImage/i)).toBeInTheDocument();
        });
    });

    test('Export image renders error message when export fails', async () => {
        mockApi({ exportImageError: true });

        render(<VariantSelection location={{ state: { packagePath: 'fakePath' } }} queueHandle={jest.fn()} />);

        // Wait until package is fully loaded
        await waitFor(() => {
            expect(screen.getAllByRole('img')).toHaveLength(4);
        });

        // Get export button
        const buttonElement = screen.getByRole('button', { name: /Export Image/i });

        // Click the export button
        fireEvent.click(buttonElement);

        // check if error message is displayed
        await waitFor(() => {
            expect(screen.getByText(/Export Error/i)).toBeInTheDocument();
        });
    });
});
