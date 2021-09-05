import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react';
import { QueueBar } from './QueueBar';
import { BrowserRouter, Router } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import PropTypes from 'prop-types';

const MockQueueBar = ({count}) => {
    return (
    <BrowserRouter>
        <QueueBar count={count} />
    </BrowserRouter>
    );
};

MockQueueBar.propTypes = {
    count: PropTypes.number
};


describe("QueueBar", () => {
    test('Displays the correct count', () => {
        render(<MockQueueBar count={10} />);
        const counterDiv = screen.getByText(/10/i);
        expect(counterDiv).toBeInTheDocument();
    });
    
    test('Renders link to ExportQueue', () => {
        render(<MockQueueBar count={1} />);
        const linkElement = screen.getByRole('link');
        expect(linkElement).toHaveAttribute('href', '/queue');
    });
    
    test('Disabled when queue is empty', () => {
        render(<MockQueueBar count={0} />);
        const linkElement = screen.queryByRole('link');
        expect(linkElement).not.toBeInTheDocument();
    });

    test('Link redirects to /queue', () => {
        const history = createBrowserHistory();
        history.push = jest.fn();

        render(
            <Router history={history} >
                <QueueBar count={1} />
            </Router>
        );

        fireEvent.click(screen.queryByRole('link'));
        expect(history.push).toHaveBeenCalledWith('/queue');
    });
});
