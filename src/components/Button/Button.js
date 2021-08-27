import styled from 'styled-components';
import { Link } from 'react-router-dom'
import { ButtonStyles } from './Button.styles';

export const Button = styled.button`${ButtonStyles};`;
export const LinkButton = styled(Link)`${ButtonStyles};`;