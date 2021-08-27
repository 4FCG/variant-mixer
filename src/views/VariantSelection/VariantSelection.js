import React from 'react';
import { PageWrapper, Button, BoxWrapper, LayerStack } from '../../components';
import { Horizontal, ImageContainer, ButtonGroup, SelectionContainer } from './VariantSelection.styles';
import PropTypes from 'prop-types';

//import sampleImage from '../../assets/sample.gif';
//import baseImage from '../../assets/Base.png';
//import knife from '../../assets/Knife.png';
//import hat from '../../assets/Hat.png';
//import face from '../../assets/Face.png';

//const sample = [{img: sampleImage}, {img: sampleImage}, {img: sampleImage}, {img: sampleImage}];

//const sampleLayers = [
//    [knife, face],
//    [hat]
//];

class VariantSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          package: null,
          boxes: []
        };
        this.handleClick = this.handleClick.bind(this);
      }

    componentDidMount() {
        let packagePath = this.props.location.state.packagePath;
        try {
            this.loadPackage(packagePath);
        } catch(err) {
            console.error(err);
        }
    }

    async loadPackage(packagePath) {
        let pack = await window.mainApi.loadPackage(packagePath);
        let boxes = [];
        for (let [layerNum, layer] of pack.layers.entries()) {
            for (let [index, image] of layer.entries()) {
                image.active = false;
                boxes.push({
                    img: image.previewPath,
                    name: image.name,
                    index: index,
                    layer: layerNum
                });
            }
        }
        this.setState({
            package: pack,
            boxes: boxes
        });
    }

    handleClick(e) {
        let box = this.state.boxes[e.currentTarget.dataset.index];
        let newPackage = this.state.package;
        newPackage.layers[box.layer][box.index].active = !newPackage.layers[box.layer][box.index].active;
        this.setState({
            package: newPackage
        });
    }

    get layers() {
        if (this.state.package) {
            return this.state.package.layers
        }
        return []
    }

    get baseImage() {
        if (this.state.package) {
            return this.state.package.img
        }
        return null
    }

    render() {
        return (
            <PageWrapper>
                <Horizontal>
                    <ImageContainer>
                        <LayerStack layers={this.layers} baseImg={this.baseImage} />
                        <ButtonGroup>
                            <Button primary >Export Image</Button>
                            <Button primary >Add to queue</Button>
                        </ButtonGroup>
                    </ImageContainer>
                    <SelectionContainer>
                        <BoxWrapper boxes={this.state.boxes} clickHandle={this.handleClick} />
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