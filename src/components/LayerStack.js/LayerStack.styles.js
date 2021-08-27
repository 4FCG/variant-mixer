import styled from 'styled-components';

const ImageBox = styled.div`
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    background-image: url(${props => props.image});
`;

export const ParentBox = styled(ImageBox)`
    width: 100%;
    flex: 1 1 auto;
    position: relative;
`;

export const Layer = styled(ImageBox)`
    width: 100%;
    height: 100%;
    position: absolute;
`;