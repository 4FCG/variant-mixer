import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const ImageBox = styled.div`
    width: 150px;
    height: 150px;
    border: 2px solid ${props => props.theme.dark};
    background-color: ${props => props.theme.secondary};
    margin-left: 20px;
    margin-top: 20px;
    cursor: pointer;
    background-image: url(${props => props.image});
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center; 
`;

const Wrapper = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    margin-top: -20px;
    margin-left: -20px;
`;

class BoxWrapper extends React.Component {
    render() {
        return (
            <Wrapper>
                {this.props.boxes.map((box, index) =>
                    <ImageBox key={index} data-index={index} image={box.img} onClick={this.props.clickHandle} />
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