import styled, { css } from 'styled-components';

export const ErrorBox = styled.div`
border-radius: 3px;
padding: 10px;
width: 100%;
box-sizing: border-box;
margin-bottom: 20px;
color: ${props => props.theme.light};
opacity: 0.65;
background-color: ${props => props.theme.secondary};
${props => props.type === 'error' && css`
    background-color: #c00;
`}
${props => props.type === 'warning' && css`
    background-color: #ff7518;
`}
`;