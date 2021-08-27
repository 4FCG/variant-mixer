import React from 'react';
import { Button, QueueBar, LinkButton as Link } from '..';
import { Navbar, Logo, Horizontal } from './Navigation.styles';


export class Navigation extends React.Component {
    render() {
        return (
        <Navbar>
            <Horizontal>
                <Logo />
                <Link to="/" primary>Select Package</Link>
                <Button primary>Import Package</Button>
            </Horizontal>
            <QueueBar count={1} />
        </Navbar>
        );
    }
}