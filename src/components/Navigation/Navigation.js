import React from 'react';
import { Button, QueueBar, LinkButton as Link } from '..';
import { Navbar, Logo, Horizontal } from './Navigation.styles';


export class Navigation extends React.Component {
    render() {
        return (
        <Navbar>
            <Horizontal>
                <Logo />
                <Link to="/">Select Package</Link>
                <Button>Import Package</Button>
            </Horizontal>
            <QueueBar count={1} />
        </Navbar>
        );
    }
}