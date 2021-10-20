import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { ContextMenu } from './ContextMenu';

describe('ContextMenu', () => {
    test('Renders all menu buttons', () => {
        const testButtonHandle = jest.fn();
        const testHideHandle = jest.fn();

        const testButtons = new Array(3).fill(
            {
                message: 'Test Button',
                handle: testButtonHandle,
                index: 0
            }
        );

        // Render menu with test props
        render(<ContextMenu buttons={testButtons} pos={{ x: 0, y: 0 }} hide={testHideHandle} />);

        // Check if all menu buttons get rendered with the proper text content
        expect(screen.getAllByRole('button', { name: /Test Button/i })).toHaveLength(3);
    });

    test('Button click works', () => {
        const testButtonHandle = jest.fn();
        const testHideHandle = jest.fn();

        const testButtons = new Array(3).fill(
            {
                message: 'Test Button',
                handle: testButtonHandle,
                index: 0
            }
        );

        // Render menu with test props
        render(<ContextMenu buttons={testButtons} pos={{ x: 0, y: 0 }} hide={testHideHandle} />);

        const buttonElements = screen.getAllByRole('button', { name: /Test Button/i });

        // Click the first button
        fireEvent.click(buttonElements[0]);

        // Check if all menu buttons get rendered with the proper text content
        expect(testButtonHandle).toHaveBeenCalled();
    });
});
