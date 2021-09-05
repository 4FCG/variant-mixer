import React from 'react'
import { render, screen } from '@testing-library/react';
import { BoxWrapper } from './BoxWrapper';
import logo from '../../assets/logo.png';

function mockBoxes(count, active, name) {
    return Array(count).fill({img: logo, active: active, name: name});
}

describe("BoxWrapper", () => {
    test('Renders all images', () => {
        render(<BoxWrapper boxes={mockBoxes(5, false, "Sample")} />);
        expect(screen.getAllByRole('img').length).toBe(5);
    });

    test('Renders label', () => {
        render(<BoxWrapper boxes={mockBoxes(1, false, "Sample")} />);
        expect(screen.getByText("Sample")).toBeInTheDocument();
    });

    test('Renders correct image', () => {
        const boxes = mockBoxes(1, false, "Sample");
        render(<BoxWrapper boxes={boxes} />);
        expect(screen.getByRole('img')).toHaveStyle(`background-image: url(${boxes[0].img})`);
    });

    test('Does not render active border when inactive', () => {
        render(<BoxWrapper boxes={mockBoxes(1, false, "Sample")} />);
        expect(screen.getByRole('img')).toHaveStyle('border: 2px solid');
    });

    test('Renders active border when active', () => {
        render(<BoxWrapper boxes={mockBoxes(1, true, "Sample")} />);
        expect(screen.getByRole('img')).toHaveStyle('border: 4px solid');
    });
});

