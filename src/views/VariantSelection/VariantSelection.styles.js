import styled from 'styled-components';
import { scrollbar } from '../../components';

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
    flex-basis: 0;
    flex-grow: 2;
    height: 100%;
    display: flex;
    flex-flow: column;
    box-sizing: border-box;
`;

export const SelectionContainer = styled.div`
    flex-basis: 0;    
    flex-grow: 1;
    margin-left: 20px;
    overflow-y: auto;
    ${scrollbar}
`;
