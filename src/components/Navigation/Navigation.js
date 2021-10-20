import React from 'react';
import { QueueBar, LinkButton as Link } from '..';
import { Navbar, Logo, Horizontal } from './Navigation.styles';
import PropTypes from 'prop-types';

class Navigation extends React.Component {
    render () {
        return (
            <Navbar>
                <Horizontal>
                    <Logo />
                    <Link to="/">Select Package</Link>
                </Horizontal>
                <QueueBar count={this.props.counter} />
            </Navbar>
        );
    }
}

Navigation.propTypes = {
    counter: PropTypes.number
};

Navigation.defaultProps = {
    counter: 0
};

export { Navigation };
