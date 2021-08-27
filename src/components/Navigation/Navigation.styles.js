import styled from 'styled-components';
import logo from '../../assets/logo.png';

export const Navbar = styled.div`
    width: 100%;
    display: flex;
    align-items: center;
    padding-left: 10px;
    padding-right: 10px;
    padding: 10px;
    justify-content: space-between;
    box-sizing: border-box;
    background-color: ${props => props.theme.secondary};
`;

export const Horizontal = styled.div`
    display: flex;
    align-items: center;
`;

export const Logo = styled.div`
    background-image: url(${logo});
    background-size: cover;
    border-radius: 50%;
    height: 70px;
    width: 70px;
`;
