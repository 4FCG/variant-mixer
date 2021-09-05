import React from 'react';
import { PageWrapper, Button, BoxWrapper, LayerStack, ErrorBox } from '../../components';
import { Horizontal, ImageContainer, ButtonGroup, SelectionContainer } from './VariantSelection.styles';
import PropTypes from 'prop-types';
import { Redirect } from "react-router-dom";

class VariantSelection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          package: null,
          boxes: [],
          redirect: false,
          'error': null,
          timer: null
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleExport = this.handleExport.bind(this);
        this.addToQueue = this.addToQueue.bind(this);
      }

    componentDidMount() {
        if (!this.props.location.state) {
            this.setState({
                redirect: true
            });
            return;
        }
        let packagePath = this.props.location.state.packagePath;
        try {
            this.loadPackage(packagePath);
        } catch(err) {
            console.error(err);
        }
    }

    componentWillUnmount() {
        // Cancel the error closing timer when unmounting
        clearTimeout(this.state.timer);
    }

    async loadPackage(packagePath) {
        let result = await window.mainApi.loadPackage(packagePath);
        if (result.error) {
            this.setError(result.error.type, result.error.message);
        }
        if (!result.canceled) {
            let boxes = [];
            for (let [layerNum, layer] of result.result.layers.entries()) {
                for (let [index, image] of layer.entries()) {
                    image.active = false;
                    boxes.push({
                        img: image.previewPath,
                        name: image.name,
                        index: index,
                        layer: layerNum,
                        active: false
                    });
                }
            }
            this.setState({
                package: result.result,
                boxes: boxes
            });
        }
    }

    setError(type, message) {
        this.setState({
            "error": {type: type, message: message},
            timer: setTimeout(() => {
                // After 5 remove error message
                this.setState({
                "error": null
                });
            }, 5000)
        });
    }

    handleClick(e) {
        let box = this.state.boxes[e.currentTarget.dataset.index];
        box.active = !box.active;
        let newPackage = this.state.package;
        newPackage.layers[box.layer][box.index].active = !newPackage.layers[box.layer][box.index].active;
        this.setState({
            package: newPackage
        });
    }

    getActiveLayers() {
        return [].concat(...this.state.package.layers).reduce(function(filtered, layer) {
            if (layer.active) {
                filtered.push({path: layer.path, overlayPath: layer.overlayPath});
            }
            return filtered;
        }, []);
    }

    async handleExport() {
        let layers = this.getActiveLayers().map(layer => layer.path);
        let result = await window.mainApi.exportImage({base: this.state.package.path, layers: layers});
        if (result.canceled && result.error) {
            this.setError(result.error.type, result.error.message);
        }
        if (!result.canceled) {
            this.setError(null, `Created image ${result.result}`);
        }
    }

    addToQueue() {
        this.props.queueHandle({layers: this.getActiveLayers(), path: this.state.package.path, baseImg: this.state.package.img});
    }

    get layers() {
        if (this.state.package) {
            return this.getActiveLayers();
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
        if (this.state.redirect) {
            return <Redirect to='/' />;
        }
        return (
            <PageWrapper>
                {this.state.error &&
                    <ErrorBox type={this.state.error.type}>
                        {this.state.error.message}
                    </ErrorBox> 
                }
                <Horizontal>
                    <ImageContainer>
                        <LayerStack layers={this.layers} baseImg={this.baseImage} />
                        <ButtonGroup>
                            <Button primary onClick={this.handleExport}>Export Image</Button>
                            <Button primary onClick={this.addToQueue}>Add to queue</Button>
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
    location: PropTypes.object.isRequired,
    queueHandle: PropTypes.func.isRequired
};

export { VariantSelection }