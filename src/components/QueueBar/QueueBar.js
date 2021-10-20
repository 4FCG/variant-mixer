import React from 'react';
import { QueueBody, Counter, DisabledQueue } from './QueueBar.styles';
import PropTypes from 'prop-types';

class QueueBar extends React.Component {
    render () {
        return (
            this.props.count > 0
                ? <QueueBody to="/queue" role="link"><div>Export Queue</div><Counter>{this.props.count}</Counter></QueueBody>
                : <DisabledQueue><div>Export Queue</div><Counter>{this.props.count}</Counter></DisabledQueue>
        );
    }
}

QueueBar.defaultProps = {
    count: 0
};

QueueBar.propTypes = {
    count: PropTypes.number
};

export { QueueBar };
