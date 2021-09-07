import React from 'react';
import { Redirect } from "react-router-dom";
import { BoxWrapper, PageWrapper, ErrorBox, LoadingIcon, ContextMenu } from '../../components';
import plus from '../../assets/plus.webp';

export class PackageSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'packages': [],
      'redirect': null,
      'error': null,
      timer: null,
      isLoading: true,
      showMenu: null
    };
    this.handleClick = this.handleClick.bind(this);
    this.handleContext = this.handleContext.bind(this);
    this.handleHideMenu = this.handleHideMenu.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  handleClick(e) {
    if (e.currentTarget.dataset.index < this.state.packages.length) {
      this.setState({
        "redirect": {
          pathname: "/variant",
          state: { packagePath: this.state.packages[e.currentTarget.dataset.index].path}
        }
      });
    // eslint-disable-next-line eqeqeq
    } else if (e.currentTarget.dataset.index == this.state.packages.length) {
      this.importPackage();
    }
  }

  async importPackage() {
    try {
      let result = await window.mainApi.importPackage();
      if (result.canceled && result.error) {
        this.setError(result.error.type, result.error.message);
      } else if (!result.canceled) {
        this.getPackages();
      }
    } catch(err) {
      console.log(err);
    }
  }

  async getPackages() {
    let result = await window.mainApi.listPackages();
    if (result.error) {
      this.setError(result.error.type, result.error.message);
    }
    if (!result.canceled) {
      this.setState({
        "packages": result.result
      });
    }
    this.setState({
      isLoading: false
    });
  }

  componentDidMount() {
    this.getPackages();
  }

  componentWillUnmount() {
    // Cancel the error closing timer when unmounting
    clearTimeout(this.state.timer);
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
      this.setState({
        showMenu: null
      });
      return;
    }

    // Check if clicked box was not the import button
    if (event.currentTarget.dataset.index < this.state.packages.length) {
      // Show menu
      this.setState({
        showMenu: {
          pos: pos,
          index: event.currentTarget.dataset.index
        }
      });
    }
  }

  handleHideMenu() {
    this.setState({
      showMenu: null
    });
  }

  handleDelete(e) {
    this.handleHideMenu();
    this.deletePackage(this.state.packages[e.currentTarget.dataset.index].path);
  }

  async deletePackage(path) {
    let result = await window.mainApi.deletePackage(path);
    if (result.error) {
      this.setError(result.error.type, result.error.message);
    }
    if (!result.canceled) {
      // Reload packages
      this.getPackages();
    }
  }

  get packages() {
    let packages = this.state.packages.map(pack => {
      return {
        img: pack.img
      }
    });
    packages.push({img: plus});
    return packages;
  }

  get contextMenu() {
    // Generate context menu
    if (this.state.showMenu) {
      const DeleteButton = {
        message: "Delete Package",
        handle: this.handleDelete,
        index: this.state.showMenu.index
      }
      return <ContextMenu pos={this.state.showMenu.pos} hide={this.handleHideMenu} buttons={[DeleteButton]}/>
    }
    else {
      return null;
    }
  }

  render() {
      if (this.state.redirect) {
        return <Redirect to={this.state.redirect} />
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
          <BoxWrapper boxes={this.packages} clickHandle={this.handleClick} contextHandle={this.handleContext} />
        </PageWrapper>
      );
    }
}