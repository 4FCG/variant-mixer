import React from 'react';
import { QueueBody, Counter } from './QueueBar.styles';
import PropTypes from 'prop-types';


class QueueBar extends React.Component {
    render() {
        return (
            <QueueBody>
                <div>Export Queue</div>
                <Counter>{this.props.count}</Counter>
            </QueueBody>
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