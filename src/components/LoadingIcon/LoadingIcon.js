import React from 'react';
import styled, { keyframes } from 'styled-components';

const animation = keyframes`
    0% {
        transform: rotate(0deg);
    }
    100% {
        transform: rotate(360deg);
    }
`;

const Icon = styled.div`
    display: inline-block;
    width: 80px;
    height: 80px;
  
    &:after {
        content: " ";
        display: block;
        width: 64px;
        height: 64px;
        margin: 8px;
        border-radius: 50%;
        border: 6px solid #fff;
        border-color: #fff transparent #fff transparent;
        animation: ${animation} 1.2s linear infinite;
    }
`;

const Positioner = styled.div`
    box-sizing: border-box;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
`;

export class LoadingIcon extends React.Component {
    render () {
        return (
            <Positioner>
                <Icon></Icon>
            </Positioner>
        );
    }
}
