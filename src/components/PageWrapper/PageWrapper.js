import styled, { css } from 'styled-components';

export const scrollbar = css`
    ::-webkit-scrollbar {
        width: 10px;
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

export const PageWrapper = styled.div`
    flex: 1 1 auto;
    padding: 20px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    ${scrollbar}
`;
