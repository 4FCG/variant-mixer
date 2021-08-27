import React from 'react';
import PropTypes from 'prop-types';
import {ParentBox, Layer} from './LayerStack.styles';

class LayerStack extends React.Component {
    render() {
        return (
            <ParentBox image={this.props.baseImg} >
                {this.props.layers.map((layer) => (
                    layer.map((image, index) => {
                        if (image.active) {
                            return (<Layer image={image.previewPath} key={index} />);
                        }
                    })
                ))}
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