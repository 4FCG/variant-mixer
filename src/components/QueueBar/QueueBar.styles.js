import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';

const QueueStyle = css`
    text-decoration: none;
    border-radius: 25px;
    color: ${props => props.theme.light};
    border: 2px solid ${props => props.theme.dark};
    display: flex;
    align-items: center;
    padding: 10px;
`;

export const QueueBody = styled(Link)`
    ${QueueStyle};
    cursor: pointer;
    &:active {
        transform scale(.95);
    }
    &:hover {
        border-color: ${props => props.theme.primary};
    }    
`;

export const DisabledQueue = styled.div`${QueueStyle};`;

export const Counter = styled.div`
    border-radius: 50%;
    font-weight: bold;
    color: ${props => props.theme.secondary};
    background-color: ${props => props.theme.primary};
    width: 25px;
    height: 25px;
    text-align: center;
    margin-left: 10px;
`;
