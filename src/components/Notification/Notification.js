import React from 'react';
import PropTypes from 'prop-types';
import { Button } from '..';
import { Popup } from './Notification.styles';

class Notification extends React.Component {
    render() {
        return (
            <Popup>
                <p>{this.props.message}</p>
                <div>
                    <Button onClick={this.props.onClose} >Close</Button>
                    {this.props.restartButton && 
                        <Button onClick={this.props.onRestart} >Restart</Button>
                    }
                </div>
            </Popup>
        );
    }
}

Notification.propTypes = {
    message: PropTypes.string,
    onClose: PropTypes.func,
    onRestart: PropTypes.func,
    restartButton: PropTypes.bool
};

export { Notification };