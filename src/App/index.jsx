import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import loadable from '../utils/loadable';
import FontStager from '../components/FontStager';
import Appbar from '../components/Appbar';
import theme from '../theme';

const Dashboard = loadable(() =>
  import(/* webpackChunkName: 'Dashboard' */ '../views/Dashboard')
);
const Pipelines = loadable(() =>
  import(/* webpackChunkName: 'Pipelines' */ '../views/Pipelines')
);
const NotFound = loadable(() =>
  import(/* webpackChunkName: 'NotFound' */ '../views/NotFound')
);
const Exports = loadable(() =>
  import(/* webpackChunkName: 'Exports' */ '../views/Exports')
);

@hot(module)
@withStyles({})
export default class App extends Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <FontStager />
        <CssBaseline />
        <BrowserRouter>
          <Fragment>
            <Appbar />
            <Switch>
              <Route path="/pipelines" component={Pipelines} />
              <Route path="/exports" component={Exports} />
              <Route path="/" component={Dashboard} />
              <Route component={NotFound} />
            </Switch>
          </Fragment>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}
