import React from 'react'
import { render, screen } from '@testing-library/react';
import { LayerStack } from './LayerStack';
import logo from '../../assets/logo.png';

function mockLayers(count) {
    return {
        path: logo,
        baseImg: logo,
        layers: Array(count).fill({path: logo, overlayPath: logo})
    };
}

describe("LayerStack", () => {
    test('Renders all layers', () => {
        const layers = mockLayers(5);
        render(<LayerStack layers={layers.layers} baseImg={layers.baseImg} />);
        expect(screen.getByRole('img').childElementCount).toBe(5);
    });

    test('Renders correct base image', () => {
        const layers = mockLayers(0);
        render(<LayerStack layers={layers.layers} baseImg={layers.baseImg} />);
        expect(screen.getByRole('img')).toHaveStyle(`background-image: url(${layers.baseImg})`);
    });

    test('Renders correct layer images', () => {
        const layers = mockLayers(1);
        render(<LayerStack layers={layers.layers} baseImg={layers.baseImg} />);
        expect(screen.getByTestId("layer")).toHaveStyle(`background-image: url(${layers.layers[0].overlayPath})`);
    });
});

