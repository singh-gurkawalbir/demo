import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import FontStager from '../components/FontStager';
import AppBar from './AppBar';
import Spinner from '../components/Spinner';
import ErrorPanel from '../components/ErrorPanel';
import themeProvider from '../themeProvider';
import loadable from '../utils/loadable';
import auth from '../utils/auth';
import AppDrawer from './AppDrawer';
import NetworkSnackbar from '../components/NetworkSnackbar';

const mapStateToProps = state => ({
  themeName: state.session.themeName,
});
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
const Imports = loadable(() =>
  import(/* webpackChunkName: 'Imports' */ '../views/Imports')
);

@hot(module)
class App extends Component {
  static propTypes = {
    store: PropTypes.object,
  };

  state = {
    loading: false,
    showDrawer: false,
    authenticated: false,
  };

  async componentDidMount() {
    // const { onProfileLoaded } = this.props;

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
  }

  async setAuthCookie() {
    const isSuccess = await auth();

    // console.log(`auth success: ${isSuccess}`);

    return isSuccess;
  }

  handleToggleDrawer = () => {
    this.setState({ showDrawer: !this.state.showDrawer });
  };

  render() {
    const { loading, error, showDrawer, authenticated } = this.state;
    const { themeName } = this.props;
    const customTheme = themeProvider(themeName);

    // console.log('theme:', customTheme);

    if (loading) {
      return (
        <Paper elevation={4}>
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
      <MuiThemeProvider theme={customTheme}>
        <NetworkSnackbar />
        <FontStager />
        <CssBaseline />
        <BrowserRouter>
          <Fragment>
            <AppBar
              onToggleDrawer={this.handleToggleDrawer}
              onSetTheme={this.handleSetTheme}
              themeName={themeName}
            />

            <AppDrawer
              open={showDrawer}
              onToggleDrawer={this.handleToggleDrawer}
            />

            <Switch>
              <Route path="/pg/pipelines" component={Pipelines} />
              <Route path="/pg/exports" component={Exports} />
              <Route path="/pg/imports" component={Imports} />
              <Route path="/pg" component={Dashboard} />
              <Route component={NotFound} />
            </Switch>
          </Fragment>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, null)(App);
