import React from 'react';
import { PageWrapper, Button, BoxWrapper, LayerStack } from '../../components';
import { Horizontal, ImageContainer, ButtonGroup, SelectionContainer } from './VariantSelection.styles';
import PropTypes from 'prop-types';

import sampleImage from '../../assets/sample.gif';
import baseImage from '../../assets/Base.png';
import knife from '../../assets/Knife.png';
import hat from '../../assets/Hat.png';
import face from '../../assets/Face.png';

const sample = [{img: sampleImage}, {img: sampleImage}, {img: sampleImage}, {img: sampleImage}];

const sampleLayers = [
    [knife, face],
    [hat]
];

class VariantSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          'packagePath': null 
        };
      }

    componentDidMount() {
        let packagePath = this.props.location.state.packagePath;
        this.loadPackage(packagePath);
        this.setState({
            "packagePath": packagePath
        });
    }

    async loadPackage(packagePath) {
        let pack = await window.mainApi.loadPackage(packagePath);
        console.log(pack);
    }

    render() {
        return (
            <PageWrapper>
                <Horizontal>
                    <ImageContainer>
                        <LayerStack layers={sampleLayers} baseImg={baseImage} />
                        <ButtonGroup>
                            <Button primary >Export Image</Button>
                            <Button primary >Add to queue</Button>
                        </ButtonGroup>
                    </ImageContainer>
                    <SelectionContainer>
                        <BoxWrapper boxes={sample} />
                    </SelectionContainer>
                </Horizontal>
            </PageWrapper>
        );
      }
}

VariantSelection.propTypes = {
    location: PropTypes.object.isRequired
};

export { VariantSelection }