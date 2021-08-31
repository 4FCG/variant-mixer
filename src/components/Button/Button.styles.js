import { css } from 'styled-components';

export const ButtonStyles = css`
    font: 400 13.3333px Arial;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    display: inline-block;
    border-radius: 3px;
    padding: 0.5rem 0;
    margin: 0.5rem 1rem;
    width: 8rem;
    background: transparent;
    color: ${props => props.theme.light};
    border: 2px solid ${props => props.theme.dark};
    ${props => props.secondary && css`
        border: 2px solid ${props => props.theme.dark};
    `}
    &:active {
        transform scale(.95);
    }
    &:hover {
        border-color: ${props => props.theme.primary};
    }
`