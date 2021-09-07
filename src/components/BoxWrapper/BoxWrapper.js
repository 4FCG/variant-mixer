import React from 'react';
import PropTypes from 'prop-types';
import { ImageBox, Wrapper, NameTag } from './BoxWrapper.styles';

class BoxWrapper extends React.Component {
    render() {
        return (
            <Wrapper>
                {this.props.boxes.map((box, index) =>
                    <ImageBox key={index} data-index={index} image={box.img} active={box.active} onClick={this.props.clickHandle} role="img" aria-labelledby={`image-${index}`} onContextMenu={this.props.contextHandle} >
                        {box.name && 
                            <NameTag id={`image-${index}`}>{box.name}</NameTag>
                        }
                    </ImageBox>
                )}
            </Wrapper>
        );
    }
}

BoxWrapper.defaultProps = {
    boxes: [],
    contextHandle: () => {}
};

BoxWrapper.propTypes = {
    boxes: PropTypes.array,
    clickHandle: PropTypes.func,
    contextHandle: PropTypes.func
};

export { BoxWrapper };