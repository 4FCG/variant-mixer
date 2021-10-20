import styled, { css } from 'styled-components';

export const ImageBox = styled.div`
    width: 150px;
    height: 150px;
    border: 2px solid ${props => props.theme.dark};
    box-sizing: border-box;
    background-color: ${props => props.theme.secondary};
    margin-left: 20px;
    margin-top: 20px;
    cursor: pointer;
    background-image: url(${props => props.image});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    ${props => props.active && css`
        border: 4px solid ${props => props.theme.primary};
    `}
    &:active {
        transform scale(.95);
    }
    &:hover {
        border-color: ${props => props.theme.primary};
    }
`;

export const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-top: -20px;
    margin-left: -20px;
`;

export const NameTag = styled.div`
    width: 100%;
    background-color: rgba(11, 12, 16, 0.3);
    color: ${props => props.theme.light};
    margin-top: 70%;
    text-align: center;
    overflow: hidden;
`;
