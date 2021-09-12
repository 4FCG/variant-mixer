import styled from 'styled-components';

export const Popup = styled.div`
position: fixed;
bottom: 20px;
left: 20px;
border-radius: 3px;
background-color: ${props => props.theme.secondary};
color: ${props => props.theme.light};
border: 2px solid ${props => props.theme.dark};
text-align: center;
padding: 10px;
`;