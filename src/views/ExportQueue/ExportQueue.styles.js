import styled from 'styled-components';

export const ImageContainer = styled.div`
    height: 200px;
    width: 200px;
    flex: 1 0 auto;
    display: flex;
    &:not(:last-of-type) {
        border-right: 2px solid ${props => props.theme.dark};
        padding-right: 5px;
    }
    &:not(:first-of-type) {
        padding-left: 5px;
    }
`;

export const ButtonWrapper = styled.div`
    display: flex;
`;

export const QueueBox = styled.div`
    display: inline-flex;
    padding: 10px;
    border: 2px solid ${props => props.theme.dark};
    margin-bottom: 10px;
    background-color: ${props => props.theme.secondary};
`;

export const ScrollBox = styled.div`
    margin-bottom: 10px;
    overflow-x: auto;

    ::-webkit-scrollbar {
        width: 5px;
    }

    ::-webkit-scrollbar-track {
        border-radius: 10px;
        background: ${props => props.theme.secondary}
    }

    ::-webkit-scrollbar-thumb {
        border-radius: 10px;
        background: ${props => props.theme.primary}
    }

    ::-webkit-scrollbar-thumb:hover {
        background: ${props => props.theme.dark} 
    }
`;