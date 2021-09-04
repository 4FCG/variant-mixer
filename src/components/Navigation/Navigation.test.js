import { render, screen, fireEvent } from '@testing-library/react';
import { Navigation } from './Navigation';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router-dom'

const MockNav = ({count, history}) => {
    return (
        <Router history={history} >
            <Navigation counter={count} />
        </Router>
    );
};

describe("Navigation", () => {
    test('Select Package redirects to /', () => {
        const history = createBrowserHistory();
        history.push = jest.fn();

        render(<MockNav counter={0} history={history} />);

        fireEvent.click(screen.getByText(/Select Package/i), {button: 0});
        expect(history.push).toHaveBeenCalledWith('/');
    });
});