import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { MuiThemeProvider, withStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import FontStager from '../components/FontStager';
import Appbar from '../components/Appbar';
import Spinner from '../components/Spinner';
import ErrorPanel from '../components/ErrorPanel';
import theme from '../theme';
import loadable from '../utils/loadable';
import auth from '../utils/auth';
import api from '../utils/api';

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
  state = {
    loading: false,
    authenticated: false,
    exports: null,
    connections: null,
  };

  async componentDidMount() {
    this.setState({ loading: true });

    try {
      this.setState({
        authenticated: await this.setAuthCookie(),
        loading: false,
        error: null,
      });
    } catch (error) {
      this.setState({
        loading: false,
        error,
      });
    }

    const self = this;

    // lazy load app state. each view must handle case
    // where necessary app state is still loading...
    // we still want users to navigate the site even which we
    // prime the caches...
    // console.log('loading exports');
    api('/exports').then(exports => {
      // console.log('exports loaded');
      self.setState({ exports: exports || [] });
    });

    // console.log('loading connections');
    api('/connections').then(connections => {
      // console.log('connections loaded');
      self.setState({ connections: connections || [] });
    });
  }

  async setAuthCookie() {
    const isSuccess = await auth();

    // console.log(`auth success: ${isSuccess}`);

    return isSuccess;
  }

  render() {
    const { classes } = this.props;
    const { loading, error, exports, connections, authenticated } = this.state;

    if (loading) {
      return (
        <Paper className={classes.paper} elevation={4}>
          <Typography variant="headline" component="h3">
            Authenticating.
          </Typography>
          <Spinner loading />
        </Paper>
      );
    }

    if (error) {
      return <ErrorPanel error={error} />;
    }

    if (!authenticated) {
      return <ErrorPanel error="Authentication failed!" />;
    }

    return (
      <MuiThemeProvider theme={theme}>
        <FontStager />
        <CssBaseline />
        <BrowserRouter>
          <Fragment>
            <Appbar />
            <Switch>
              <Route path="/pg/pipelines" component={Pipelines} />
              <Route
                path="/pg/exports"
                render={props => (
                  <Exports
                    {...props}
                    exports={exports}
                    connections={connections}
                  />
                )}
              />
              <Route path="/pg" component={Dashboard} />
              <Route component={NotFound} />
            </Switch>
          </Fragment>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}
