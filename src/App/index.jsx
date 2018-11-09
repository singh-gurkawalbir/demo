import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  withRouter,
} from 'react-router-dom';
import { themeName, isAuthenticated, isAuthDialogOpen } from '../reducers';
import FontStager from '../components/FontStager';
import AppBar from './AppBar';
// import ErrorPanel from '../components/ErrorPanel';
import themeProvider from '../themeProvider';
import loadable from '../utils/loadable';
import AppDrawer from './AppDrawer';
import NetworkSnackbar from '../components/NetworkSnackbar';
import SignIn from '../views/SignIn';
import AuthDialog from '../components/AuthDialog';
// import AlertDialog from '../components/AuthDialog';

const mapStateToProps = state => ({
  themeName: themeName(state),
  authenticated: isAuthenticated(state),
  isAuthDialogOpen: isAuthDialogOpen(state),
});
// const mapDispatchToProps = dispatch => ({
//   handleAuthentication: (path, message) => {
//     dispatch(actions.auth.request(path, message));
//   },
// });
const Dashboard = withRouter(
  loadable(() =>
    import(/* webpackChunkName: 'Dashboard' */ '../views/Dashboard')
  )
);
const NotFound = loadable(() =>
  import(/* webpackChunkName: 'NotFound' */ '../views/NotFound')
);
const Resources = loadable(() =>
  import(/* webpackChunkName: 'Resources' */ '../views/Resources')
);
const Exports = loadable(() =>
  import(/* webpackChunkName: 'Exports' */ '../views/Exports')
);
const Imports = loadable(() =>
  import(/* webpackChunkName: 'Imports' */ '../views/Imports')
);

// const SignIn = loadable(() =>
//   import(/* webpackChunkName: 'Imports' */ '../views/SignIn')
// );
function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Route
      {...rest}
      render={props =>
        authenticated ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/pg/signin',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

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

  handleToggleDrawer = () => {
    this.setState({ showDrawer: !this.state.showDrawer });
  };

  render() {
    const { showDrawer } = this.state;
    const { themeName, authenticated } = this.props;
    const customTheme = themeProvider(themeName);

    return (
      <MuiThemeProvider theme={customTheme}>
        <FontStager />
        <CssBaseline />
        <BrowserRouter>
          <Fragment>
            {authenticated && <NetworkSnackbar />}
            <AppBar
              onToggleDrawer={this.handleToggleDrawer}
              onSetTheme={this.handleSetTheme}
              themeName={themeName}
            />

            <AppDrawer
              open={showDrawer}
              onToggleDrawer={this.handleToggleDrawer}
            />
            {authenticated && <AuthDialog />}
            <Switch>
              <PrivateRoute
                authenticated={authenticated}
                path="/pg/resources"
                component={Resources}
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
              <Route path="/pg/signin" component={SignIn} />
              <PrivateRoute
                authenticated={authenticated}
                path="/pg"
                component={Dashboard}
              />
              <Route component={NotFound} />
            </Switch>
          </Fragment>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapStateToProps, null)(App);
