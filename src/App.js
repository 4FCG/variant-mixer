import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { PackageSelection, VariantSelection, ExportQueue } from './views';
import { Navigation } from './components';
import styled from 'styled-components';

const theme = {
  main: "#0B0C10",
  secondary: "#1F2833",
  light: "#C5C6C7",
  primary: "#66FCF1",
  dark: "#45A29E"
}

const Page = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background-color: ${props => props.theme.main};
  display: flex;
  flex-flow: column;
`;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: []
    };
    this.appendQueue = this.appendQueue.bind(this);
    this.clearQueue = this.clearQueue.bind(this);
  }

  appendQueue(variant) {
    this.setState({
      queue: [...this.state.queue, variant]
    });
  }

  clearQueue() {
    this.setState({
      queue: []
    });
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Page>
          <Router>
            <Navigation counter={this.state.queue.length} />
            <Switch>
              <Route path="/queue" render={() => <ExportQueue variants={this.state.queue} clearQueue={this.clearQueue} />} />
              <Route path="/variant" render={(props) => <VariantSelection {...props} queueHandle={this.appendQueue} />} />
              <Route path="/" component={PackageSelection} />
            </Switch>
          </Router>
        </Page>
      </ThemeProvider>
    );
}
}

export default App;
