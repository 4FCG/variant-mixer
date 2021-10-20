import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { mockApi } from './services/MainApi.mock';
import App from './App';

describe('App integration testing', () => {
    test('Export Queue adding and clearing', async () => {
        // Mock the mainApi
        mockApi();

        render(<App />);

        // Wait until API results are rendered
        await waitFor(() => {
            expect(screen.getAllByRole('img')).toHaveLength(3);
        });

        // Select first package
        fireEvent.click(screen.getAllByRole('img')[0]);

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

        // Click the add to queue button
        fireEvent.click(screen.getByRole('button', { name: /Add to queue/i }));

        // Check if queue counter goes up by 1
        await waitFor(() => {
            expect(screen.getByText(/^1$/i)).toBeInTheDocument();
        });

        // Click the Export Queue link
        fireEvent.click(screen.getByRole('link', { name: /Export Queue/i }));

        // Check if image in queue is rendered
        await waitFor(() => {
            expect(screen.getByRole('img')).toBeInTheDocument();
        });

        // Click export button
        fireEvent.click(screen.getByRole('button', { name: /Export/i }));

        // Check if queue counter goes back down to 0
        await waitFor(() => {
            expect(screen.getByText(/^0$/i)).toBeInTheDocument();
        });
    });

    test('Remove from queue takes image out of state', async () => {
        // Mock the mainApi
        mockApi();

        render(<App />);

        // Wait until API results are rendered
        await waitFor(() => {
            expect(screen.getAllByRole('img')).toHaveLength(3);
        });

        // Select first package
        fireEvent.click(screen.getAllByRole('img')[0]);

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

        const queueAddButton = screen.getByRole('button', { name: /Add to queue/i });
        // Click the add to queue button twice
        fireEvent.click(queueAddButton);
        fireEvent.click(queueAddButton);

        // Check if queue counter goes up to 2
        await waitFor(() => {
            expect(screen.getByText(/^2$/i)).toBeInTheDocument();
        });

        // Click the Export Queue link
        fireEvent.click(screen.getByRole('link', { name: /Export Queue/i }));

        // Check if image in queue is rendered
        await waitFor(() => {
            expect(screen.getAllByRole('img')).toHaveLength(2);
        });

        // Remove first image
        fireEvent.contextMenu(screen.getAllByRole('img')[0]);
        const removeButton = await screen.findByRole('button', { name: /Remove from queue/i });
        fireEvent.click(removeButton);

        // Check if queue counter goes back down to 1
        // And the image is remove
        await waitFor(() => {
            expect(screen.getByText(/^1$/i)).toBeInTheDocument();
            expect(screen.getAllByRole('img').length).toBe(1);
        });
    });

    test('Renders update available notification', async () => {
        // Mock the mainApi
        mockApi();

        // Implement mock event to only trigger updateAvailable
        window.mainApi.onEvent.mockImplementation((type, callback) => {
            if (type === 'updateAvailable') {
                callback();
            }
        });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument();
            expect(screen.queryByRole('button', { name: /Restart/i })).not.toBeInTheDocument();
        });
    });

    test('Renders update downloaded notification', async () => {
        // Mock the mainApi
        mockApi();

        // Implement mock event to only trigger updateDownloaded
        window.mainApi.onEvent.mockImplementation((type, callback) => {
            if (type === 'updateDownloaded') {
                callback();
            }
        });

        render(<App />);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Close/i })).toBeInTheDocument();
            expect(screen.getByRole('button', { name: /Restart/i })).toBeInTheDocument();
        });
    });

    test('Pressing close closes the notification', async () => {
        // Mock the mainApi
        mockApi();

        // Implement mock event to only trigger updateAvailable
        window.mainApi.onEvent.mockImplementation((type, callback) => {
            if (type === 'updateAvailable') {
                callback();
            }
        });

        render(<App />);

        const closeButton = await screen.findByRole('button', { name: /Close/i });
        // Click the close button
        fireEvent.click(closeButton);

        await waitFor(() => {
            expect(screen.queryByRole('button', { name: /Close/i })).not.toBeInTheDocument();
        });
    });

    test('Pressing restart runs restart function', async () => {
        // Mock the mainApi
        mockApi();

        // Implement mock event to only trigger updateAvailable
        window.mainApi.onEvent.mockImplementation((type, callback) => {
            if (type === 'updateDownloaded') {
                callback();
            }
        });

        window.mainApi.restartApp = jest.fn();

        render(<App />);

        const restartButton = await screen.findByRole('button', { name: /Restart/i });
        // Click the restart button
        fireEvent.click(restartButton);

        await waitFor(() => {
            expect(window.mainApi.restartApp).toHaveBeenCalled();
        });
    });
});
