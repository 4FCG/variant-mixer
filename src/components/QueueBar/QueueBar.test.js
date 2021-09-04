import { render, screen } from '@testing-library/react';
import { QueueBar } from './QueueBar';
import {BrowserRouter as Router} from 'react-router-dom'

const MockQueueBar = ({count}) => {
    return (
    <Router>
        <QueueBar count={count} />
    </Router>
    );
};

describe("QueueBar", () => {
    test('Displays the correct count', () => {
        render(<MockQueueBar count={10} />);
        const counterDiv = screen.getByText(/10/i);
        expect(counterDiv).toBeInTheDocument();
    });
    
    test('Renders link to ExportQueue', () => {
        render(<MockQueueBar count={1} />);
        const divElement = screen.getByText('Export Queue').closest('a');
        expect(divElement).toHaveAttribute('href', '/queue');
    });
    
    test('Disabled when queue is empty', () => {
        render(<MockQueueBar count={0} />);
        const divElement = screen.getByText('Export Queue').closest('a');
        expect(divElement).not.toBeInTheDocument();
    });
});
