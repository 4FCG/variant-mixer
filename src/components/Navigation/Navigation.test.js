import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navigation } from './Navigation';
import { createBrowserHistory } from 'history';
import { Router, BrowserRouter } from 'react-router-dom';

describe('Navigation', () => {
    test('Select Package redirects to /', () => {
        const history = createBrowserHistory();
        history.push = jest.fn();

        render(
            <Router history={history} >
                <Navigation counter={0} />
            </Router>
        );

        fireEvent.click(screen.getByText(/Select Package/i), { button: 0 });
        expect(history.push).toHaveBeenCalledWith('/');
    });

    test('Queue counter is rendered', () => {
        render(
            <BrowserRouter>
                <Navigation counter={0} />
            </BrowserRouter>
        );

        expect(screen.getByText(/0/i)).toBeInTheDocument();
    });
});
