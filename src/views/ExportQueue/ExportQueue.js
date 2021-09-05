import React from 'react';
import { PageWrapper, Button, LayerStack, ErrorBox } from '../../components';
import PropTypes from 'prop-types';
import { Redirect } from "react-router-dom";
import { ImageContainer, QueueBox, ScrollBox, ButtonWrapper } from './ExportQueue.styles';


class ExportQueue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'redirect': null,
            'error': null,
            timer: null
        };
        this.handleClick = this.handleClick.bind(this);
        this.clearButton = this.clearButton.bind(this);
    }

    async handleClick() {
        // Remove unneeded variables
        let variants = this.props.variants.map(v => ({layers: v.layers.map(i => i.path), base: v.path}));
        try {
            // Run export on all images in queue
            let result = await window.mainApi.exportQueue(variants);
            if (result.canceled && result.error) {
                this.setError(result.error.type, result.error.message);
            } else if (!result.canceled) {
                // clear queue and redirect
                this.props.clearQueue();
                this.setState({
                    "redirect": true
                });
            }
        } catch (err) {
            console.error(err);
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

    async clearButton() {
        // clear queue and redirect
        this.props.clearQueue();
        this.setState({
            "redirect": true
        });
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
        return (
            <PageWrapper>
                {this.state.error &&
                    <ErrorBox type={this.state.error.type}>
                        {this.state.error.message}
                    </ErrorBox> 
                }
                <ScrollBox>
                    <QueueBox>
                        {this.props.variants.map((variant, index) => 
                            <ImageContainer key={index}>
                                <LayerStack layers={variant.layers} baseImg={variant.baseImg} />
                            </ImageContainer>
                        )}
                    </QueueBox>
                </ScrollBox>
                <ButtonWrapper>
                    <Button onClick={this.handleClick}>Export</Button>
                    <Button onClick={this.clearButton}>Clear queue</Button>
                </ButtonWrapper>
            </PageWrapper>
        );
    }
}

ExportQueue.propTypes = {
    variants: PropTypes.array.isRequired,
    clearQueue: PropTypes.func.isRequired,
};

export { ExportQueue };