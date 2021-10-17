import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { ExportQueue } from './ExportQueue';
import { mockApi, mockQueueState } from '../../services/MainApi.mock';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom';

describe('ExportQueue', () => {
    beforeEach(() => {
        jest.restoreAllMocks();
        jest.useFakeTimers();
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    test('All images in queue are rendered', async () => {
        // Run to apply mockApi
        mockApi();

        render(<ExportQueue variants={mockQueueState} clearQueue={jest.fn()} popQueue={jest.fn()} />);

        // Check if all images in queue are rendered
        await waitFor(() => {
            expect(screen.getAllByRole('img')).toHaveLength(3);
        });
    });

    test('Redirects after image export is successful', async () => {
        mockApi();

        // Mock Router history, Redirect component uses history.replace
        const history = createBrowserHistory();
        history.replace = jest.fn();

        render(
            <Router history={history}>
                <ExportQueue variants={mockQueueState} clearQueue={jest.fn()} popQueue={jest.fn()} />
            </Router>
        );

        // Click export button
        const exportButton = screen.getByRole('button', { name: /Export/i });
        fireEvent.click(exportButton);

        // Check if redirects to /
        await waitFor(() => {
            expect(history.replace).toHaveBeenCalledWith(expect.objectContaining({
                pathname: '/'
            }));
        });
    });

    test('Renders queue export error', async () => {
        mockApi({ exportQueueError: true });

        render(<ExportQueue variants={mockQueueState} clearQueue={jest.fn()} popQueue={jest.fn()} />);

        // Click export button
        const exportButton = screen.getByRole('button', { name: /Export/i });
        fireEvent.click(exportButton);

        // Check if error renders
        await waitFor(() => {
            expect(screen.getByText(/Queue Error/i)).toBeInTheDocument();
        });
    });

    test('Redirects after clearing queue', async () => {
        mockApi();

        // Mock Router history, Redirect component uses history.replace
        const history = createBrowserHistory();
        history.replace = jest.fn();

        // Mock the clearQueue function
        const clearQueue = jest.fn();

        render(
            <Router history={history}>
                <ExportQueue variants={mockQueueState} clearQueue={clearQueue} popQueue={jest.fn()} />
            </Router>
        );

        // Click clear button
        const clearButton = screen.getByRole('button', { name: /Clear queue/i });
        fireEvent.click(clearButton);

        // Check if error renders
        await waitFor(() => {
            expect(clearQueue).toHaveBeenCalled();
            expect(history.replace).toHaveBeenCalledWith(expect.objectContaining({
                pathname: '/'
            }));
        });
    });

    test('Right click on image opens contextmenu', async () => {
        mockApi();

        render(<ExportQueue variants={mockQueueState} clearQueue={jest.fn()} popQueue={jest.fn()} />);

        // Wait for render
        await waitFor(() => {
            expect(screen.getAllByRole('img')).toHaveLength(3);
        });

        fireEvent.contextMenu(screen.getAllByRole('img')[0]);

        await waitFor(() => {
            expect(screen.getByRole('button', { name: /Remove from queue/i })).toBeInTheDocument();
        });
    });

    test('Remove from queue calls popQueue', async () => {
        mockApi();

        const popQueue = jest.fn();
        render(<ExportQueue variants={mockQueueState} clearQueue={jest.fn()} popQueue={popQueue} />);

        // Wait for render
        await waitFor(() => {
            expect(screen.getAllByRole('img')).toHaveLength(3);
        });

        fireEvent.contextMenu(screen.getAllByRole('img')[0]);

        const removeButton = await screen.findByRole('button', { name: /Remove from queue/i });
        fireEvent.click(removeButton);

        // Check if popQueue was called with correct index
        await waitFor(() => {
            expect(popQueue).toHaveBeenCalledWith('0');
            // Menu should close after click
            expect(screen.queryByRole('button', { name: /Remove from queue/i })).not.toBeInTheDocument();
        });
    });
});
