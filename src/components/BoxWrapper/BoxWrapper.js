import React from 'react';
import PropTypes from 'prop-types';
import { ImageBox, Wrapper, NameTag } from './BoxWrapper.styles';

class BoxWrapper extends React.Component {
    render() {
        return (
            <Wrapper>
                {this.props.boxes.map((box, index) =>
                    <ImageBox key={index} data-index={index} image={box.img} active={box.active} onClick={this.props.clickHandle} role="img" aria-labelledby={`image-${index}`}>
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
    boxes: []
};

BoxWrapper.propTypes = {
    boxes: PropTypes.array,
    clickHandle: PropTypes.func
};

export { BoxWrapper };