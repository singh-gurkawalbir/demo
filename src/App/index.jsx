import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// import CircularProgress from '@material-ui/core/CircularProgress';
import {
  themeName,
  authenticationErrored,
  isUserLoggedOut,
  isAuthInitialized,
  isAuthenticated,
} from '../reducers';
import FontStager from '../components/FontStager';
import AppBar from './AppBar';
import themeProvider from '../themeProvider';
import loadable from '../utils/loadable';
import AppDrawer from './AppDrawer';
import NetworkSnackbar from '../components/NetworkSnackbar';
import SignIn from '../views/SignIn';
import AuthDialog from '../components/AuthDialog';
import PrivateRoute from './PrivateRoute';
import actions from '../actions';

const mapStateToProps = state => ({
  themeName: themeName(state),
  authenticated: isAuthenticated(state),

  isAuthInitialized: isAuthInitialized(state),
  isAuthErrored: !!authenticationErrored(state),
  isUserLoggedOut: isUserLoggedOut(state),
  // isSessionExpired: !!(state && state.auth && state.auth.sessionExpired),
});
const mapDispatchToProps = dispatch => ({
  initSession: () => {
    dispatch(actions.auth.initSession());
  },
});
const Dashboard = loadable(() =>
  import(/* webpackChunkName: 'Dashboard' */ '../views/Dashboard')
);
const NotFound = loadable(() =>
  import(/* webpackChunkName: 'NotFound' */ '../views/NotFound')
);
const Resources = loadable(() =>
  import(/* webpackChunkName: 'Resources' */ '../views/Resources')
);
const Editors = loadable(() =>
  import(/* webpackChunkName: 'Editors' */ '../views/Editors')
);
const Exports = loadable(() =>
  import(/* webpackChunkName: 'Exports' */ '../views/Exports')
);
const Imports = loadable(() =>
  import(/* webpackChunkName: 'Imports' */ '../views/Imports')
);
const MyAccount = loadable(() =>
  import(/* webpackChunkName: 'MyAccount' */ '../views/MyAccount')
);

@hot(module)
class App extends Component {
  static propTypes = {
    store: PropTypes.object,
  };

  // TODO: authenticated should be in our redux session store...
  // we need to create a new action creator and reducer for this.
  state = {
    showDrawer: false,
  };

  componentWillMount() {
    const { initSession, isAuthInitialized } = this.props;

    if (!isAuthInitialized) initSession();
  }
  handleToggleDrawer = () => {
    this.setState({ showDrawer: !this.state.showDrawer });
  };

  render() {
    const { showDrawer } = this.state;
    const {
      themeName,
      authenticated,
      isAuthInitialized,
      isUserLoggedOut,
      // isSessionExpired,
    } = this.props;
    const customTheme = themeProvider(themeName);

    return (
      <MuiThemeProvider theme={customTheme}>
        <FontStager />
        <CssBaseline />
        <BrowserRouter>
          <Fragment>
            <NetworkSnackbar />
            <AppBar
              onToggleDrawer={this.handleToggleDrawer}
              onSetTheme={this.handleSetTheme}
              themeName={themeName}
            />
            <AppDrawer
              open={showDrawer}
              onToggleDrawer={this.handleToggleDrawer}
            />
            {/* is app initialized */}
            <AuthDialog />
            {(isAuthInitialized || !isUserLoggedOut) && (
              <Switch>
                <PrivateRoute
                  path="/pg/resources"
                  component={Resources}
                  authenticated={authenticated}
                />
                <PrivateRoute
                  authenticated={authenticated}
                  path="/pg/editors"
                  component={Editors}
                />

                <PrivateRoute
                  authenticated={authenticated}
                  path="/pg/exports"
                  component={Exports}
                />
                <PrivateRoute
                  authenticated={authenticated}
                  path="/pg/imports"
                  component={Imports}
                />
                <PrivateRoute
                  authenticated={authenticated}
                  path="/pg/myAccount"
                  component={MyAccount}
                />
                <Route path="/pg/signin" component={SignIn} />

                <PrivateRoute
                  authenticated={authenticated}
                  path="/pg"
                  component={Dashboard}
                />

                <Route component={NotFound} />
              </Switch>
            )}
          </Fragment>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
