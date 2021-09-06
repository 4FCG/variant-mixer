import React from 'react';
import { Redirect } from "react-router-dom";
import { BoxWrapper, PageWrapper, ErrorBox, LoadingIcon } from '../../components';
import plus from '../../assets/plus.webp';

export class PackageSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'packages': [],
      'redirect': null,
      'error': null,
      timer: null,
      isLoading: true
    };
    this.handleClick = this.handleClick.bind(this);
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

  get packages() {
    let packages = this.state.packages.map(pack => {
      return {
        img: pack.img
      }
    });
    packages.push({img: plus});
    return packages;
  }

  render() {
      if (this.state.redirect) {
        return <Redirect to={this.state.redirect} />
      }
      return (
        // Display loading icon until page is set to loaded
        this.state.isLoading ? <LoadingIcon /> :
        <PageWrapper>
          
          {this.state.error &&
           <ErrorBox type={this.state.error.type}>
             {this.state.error.message}
           </ErrorBox> 
          }
          <BoxWrapper boxes={this.packages} clickHandle={this.handleClick} />
        </PageWrapper>
      );
    }
}