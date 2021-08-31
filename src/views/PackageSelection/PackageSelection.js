import React from 'react';
import { Redirect } from "react-router-dom";
import { BoxWrapper, PageWrapper, ErrorBox } from '../../components';
import plus from '../../assets/plus.webp';

export class PackageSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'packages': [],
      'redirect': null,
      'error': null
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
    } else if (e.currentTarget.dataset.index == this.state.packages.length) {
      this.importPackage();
    }
  }

  async importPackage() {
    try {
      let result = await window.mainApi.importPackage();
      if (result.canceled && result.error) {
        this.setState({
          "error": {type: result.error.type, message: result.error.message}
        });
        setTimeout(() => {
          // After 5 remove error message
          this.setState({
            "error": null
          });
        }, 5000)
      } else if (!result.canceled) {
        this.getPackages();
      }
    } catch(err) {
      console.log(err);
    }
  }

  async getPackages() {
    let packages = await window.mainApi.listPackages();
    this.setState({
      "packages": packages
    });
  }

  componentDidMount() {
    this.getPackages();
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