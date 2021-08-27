import styled from 'styled-components';

export const QueueBody = styled.div`
    border-radius: 25px;
    color: ${props => props.theme.light};
    border: 2px solid ${props => props.theme.dark};
    display: flex;
    align-items: center;
    padding: 10px;
`;

export const Counter = styled.div`
    border-radius: 50%;
    color: ${props => props.theme.secondary};
    background-color: ${props => props.theme.primary};
    width: 25px;
    height: 25px;
    text-align: center;
    margin-left: 10px;
`;