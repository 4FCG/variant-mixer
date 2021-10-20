import React from 'react';
import PropTypes from 'prop-types';
import { MenuButton, Menu } from './ContextMenu.styles';

class ContextMenu extends React.Component {
    constructor (props) {
        super(props);
        this.wrapperRef = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount () {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount () {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside (event) {
        // Check if a click happened outside of the menu
        if (this.wrapperRef && !this.wrapperRef.current.contains(event.target)) {
            this.props.hide();
        }
    }

    render () {
        return (
            <Menu pos={this.props.pos} ref={this.wrapperRef}>
                {this.props.buttons.map((button, index) =>
                    <MenuButton key={index} onClick={button.handle} data-index={button.index} >{button.message}</MenuButton>
                )}
            </Menu>
        );
    }
}

ContextMenu.propTypes = {
    pos: PropTypes.object,
    hide: PropTypes.func,
    buttons: PropTypes.array
};

export { ContextMenu };
