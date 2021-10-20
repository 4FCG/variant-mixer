import React from 'react';
import { render, screen } from '@testing-library/react';
import { ErrorBox } from './ErrorBox';

describe('ErrorBox', () => {
    test('Displays the correct style', () => {
        render(<ErrorBox type={'warning'}>Test error</ErrorBox>);
        const errorDiv = screen.getByText(/Test error/i);
        expect(errorDiv).toHaveStyle('background-color: #ff7518');
    });
});
