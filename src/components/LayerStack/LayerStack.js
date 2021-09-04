import React from 'react';
import PropTypes from 'prop-types';
import {ParentBox, Layer} from './LayerStack.styles';

class LayerStack extends React.Component {
    render() {
        return (
            <ParentBox image={this.props.baseImg} role="img">
                {this.props.layers.map((layer, index) => 
                    <Layer image={layer.overlayPath} key={index} />
                )}
            </ParentBox>
        );
    }
}

LayerStack.defaultProps = {
    layers: [],
    baseImg: null
};

LayerStack.propTypes = {
    layers: PropTypes.array,
    baseImg: PropTypes.string
};

export { LayerStack };