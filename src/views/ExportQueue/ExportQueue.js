import React from 'react';
import { PageWrapper, Button, LayerStack, ErrorBox, LoadingIcon, ContextMenu } from '../../components';
import PropTypes from 'prop-types';
import { Redirect } from "react-router-dom";
import { ImageContainer, QueueBox, ScrollBox, ButtonWrapper } from './ExportQueue.styles';


class ExportQueue extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            'redirect': null,
            'error': null,
            timer: null,
            isLoading: true,
            showMenu: null
        };
        this.handleClick = this.handleClick.bind(this);
        this.clearButton = this.clearButton.bind(this);

        this.handleContext = this.handleContext.bind(this);
        this.handleHideMenu = this.handleHideMenu.bind(this);
        this.handleRemove = this.handleRemove.bind(this);
    }

    componentDidMount() {
        if (this.props.variants.length === 0) {
            this.setState({
                "redirect": true
            });
        }
        this.setState({
            isLoading: false
        });
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

    handleContext(event) {
        event.preventDefault();

        // Get position
        const pos = {
            x: event.pageX + "px",
            y: event.pageY + "px"
        };

        // Check if not clicked on a box
        if (!event.currentTarget.dataset) {
            // hide menu
            this.handleHideMenu();
            return;
        }

        this.setState({
            showMenu: {
                pos: pos,
                index: event.currentTarget.dataset.index
            }
        });
    }

    handleHideMenu() {
        this.setState({
          showMenu: null
        });
    }

    handleRemove(e) {
        this.handleHideMenu();
        this.props.popQueue(e.currentTarget.dataset.index);

        if (this.props.variants.length === 1) {
            this.setState({
                "redirect": true
            });
        }
      }

    get contextMenu() {
        // Generate context menu
        if (this.state.showMenu) {
            const RemoveButton = {
                message: "Remove from queue",
                handle: this.handleRemove,
                index: this.state.showMenu.index
            }
            return <ContextMenu pos={this.state.showMenu.pos} hide={this.handleHideMenu} buttons={[RemoveButton]}/>
        }
        else {
            return null;
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to='/' />
        }
        return (
            // Display loading icon until page is set to loaded
            this.state.isLoading ? <LoadingIcon /> :
            <PageWrapper>
                {this.contextMenu}
                {this.state.error &&
                    <ErrorBox type={this.state.error.type}>
                        {this.state.error.message}
                    </ErrorBox> 
                }
                <ScrollBox>
                    <QueueBox>
                        {this.props.variants.map((variant, index) => 
                            <ImageContainer key={index} onContextMenu={this.handleContext} data-index={index}>
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
    popQueue: PropTypes.func.isRequired
};

export { ExportQueue };