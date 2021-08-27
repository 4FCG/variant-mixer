import styled from 'styled-components';

export const Horizontal = styled.div`
    display: flex;
    height: 100%;
`;

export const ButtonGroup = styled.div`
    display: flex;
    justify-content: center;
    height: 100%;
    align-items: flex-start;
    flex: 0 1 50px;
`;

export const ImageContainer = styled.div`
    flex-grow: 1;
    height: 100%;
    display: flex;
    flex-flow: column;
`;

export const SelectionContainer = styled.div`
    flex-grow: 2;
    margin-left: 20px;
`;