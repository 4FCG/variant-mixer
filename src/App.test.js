import React from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { mockApi } from './services/MainApi.mock';
import App from './App';

describe("App integration testing", () => {
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
        const selectionBoxes = screen.getAllByRole('img', {name: /Sample Layer/i});

        // Click the first selection box
        fireEvent.click(selectionBoxes[0]);

        // Wait for layer to be added
        await waitFor(() => {
            expect(screen.queryAllByTestId('layer').length).toBe(1);
        });

        // Click the add to queue button
        fireEvent.click(screen.getByRole('button', {name: /Add to queue/i}));

        // Check if queue counter goes up by 1
        await waitFor(() => {
            expect(screen.getByText(/^1$/i)).toBeInTheDocument();
        });

        // Click the Export Queue link
        fireEvent.click(screen.getByRole('link', {name: /Export Queue/i}));

        // Check if image in queue is rendered
        await waitFor(() => {
            expect(screen.getByRole('img')).toBeInTheDocument();
        });

        // Click export button
        fireEvent.click(screen.getByRole('button', {name: /Export/i}));

        // Check if queue counter goes back down to 0
        await waitFor(() => {
            expect(screen.getByText(/^0$/i)).toBeInTheDocument();
        });
    });
});