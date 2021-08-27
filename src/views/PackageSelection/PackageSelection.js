import React from 'react';
import { Redirect } from "react-router-dom";
import { BoxWrapper, PageWrapper } from '../../components';

export class PackageSelection extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      'packages': [],
      'redirect': null
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.setState({
      "redirect": {
        pathname: "/variant",
        state: { packagePath: this.state.packages[e.currentTarget.dataset.index].path}
      }
    });
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
    return this.state.packages.map(pack => {
      return {
        img: pack.img
      }
    });
  }

  render() {
      if (this.state.redirect) {
        return <Redirect to={this.state.redirect} />
      }
      return (
        <PageWrapper>
          <BoxWrapper boxes={this.packages} clickHandle={this.handleClick} />
        </PageWrapper>
      );
    }
}