import React from 'react';
import { QueueBar, LinkButton as Link } from '..';
import { Navbar, Logo, Horizontal } from './Navigation.styles';


export class Navigation extends React.Component {
    render() {
        return (
        <Navbar>
            <Horizontal>
                <Logo />
                <Link to="/">Select Package</Link>
            </Horizontal>
            <QueueBar count={1} />
        </Navbar>
        );
    }
}