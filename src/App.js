import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';

import { PackageSelection, VariantSelection, ExportQueue } from './views';
import { Navigation, Notification } from './components';
import styled, { ThemeProvider } from 'styled-components';

const theme = {
  main: "#0B0C10",
  secondary: "#1F2833",
  light: "#C5C6C7",
  primary: "#66FCF1",
  dark: "#45A29E",
  highlight: "#3f5168"
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
      queue: [],
      notification: null,
      restartButton: false
    };
    this.appendQueue = this.appendQueue.bind(this);
    this.clearQueue = this.clearQueue.bind(this);
    this.popQueue = this.popQueue.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleRestart = this.handleRestart.bind(this);
  }

  componentDidMount() {
    window.mainApi.onEvent("updateAvailable", () => {
      this.setState({
        notification: "A new update is available, downloading..."
      });
    });

    window.mainApi.onEvent("updateDownloaded", () => {
      this.setState({
        notification: "Update downloaded, it will install on restart. Restart now?",
        restartButton: true
      });
    });
  }

  popQueue(index) {
    const newQueue = [...this.state.queue];
    newQueue.splice(index, 1);
    this.setState({
      queue: newQueue
    });
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

  handleClose() {
    this.setState({
      notification: null
    });
  }

  handleRestart() {
    window.mainApi.restartApp();
  }

  get notification() {
    if (this.state.notification) {
      return <Notification message={this.state.notification} onClose={this.handleClose} onRestart={this.handleRestart} restartButton={this.state.restartButton}/>;
    }
    return null;
  }

  render() {
    return (
      <ThemeProvider theme={theme}>
        <Page>
          <Router>
            <Navigation counter={this.state.queue.length} />
            <Switch>
              <Route path="/queue" render={() => <ExportQueue variants={this.state.queue} clearQueue={this.clearQueue} popQueue={this.popQueue} />} />
              <Route path="/variant" render={(props) => <VariantSelection {...props} queueHandle={this.appendQueue} />} />
              <Route path="/" component={PackageSelection} />
            </Switch>
          </Router>
          {this.notification}
        </Page>
      </ThemeProvider>
    );
}
}

export default App;
