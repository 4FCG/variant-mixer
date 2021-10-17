import styled from 'styled-components';

export const Menu = styled.div`
    z-index: 998;
    position: absolute;
    left:  ${props => props.pos.x};
    top:  ${props => props.pos.y};
    background-color: rgba(31, 40, 51, 0.7);
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0px 3px 3px ${props => props.theme.main};
`;
export const MenuButton = styled.button`
    z-index: 999;
    border: none;
    padding-top: 10px;
    padding-bottom: 10px;
    font: 400 13.3333px Arial;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    background: transparent;
    color: ${props => props.theme.light};
    &:hover {
        background: ${props => props.theme.secondary};
    }
    &:active {
        background: ${props => props.theme.highlight};
    }
`;
