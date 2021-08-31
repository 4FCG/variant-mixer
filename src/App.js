import React from 'react';
import {HashRouter as Router, Route, Switch} from 'react-router-dom'
import { ThemeProvider } from 'styled-components'

import { PackageSelection, VariantSelection } from './views';
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

function App() {
  console.log(__dirname);
  return (
    <ThemeProvider theme={theme}>
      <Page>
        <Router>
          <Navigation />
          <Switch>
            <Route path="/variant" render={(props) => <VariantSelection {...props} />} />
            <Route path="/" component={PackageSelection} />
          </Switch>
        </Router>
      </Page>
    </ThemeProvider>
  );
}

export default App;
