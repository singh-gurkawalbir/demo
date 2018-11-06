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
// import ErrorPanel from '../components/ErrorPanel';
import themeProvider from '../themeProvider';
import { isLoadingProfile } from '../reducers';
import loadable from '../utils/loadable';
import AppDrawer from './AppDrawer';
import NetworkSnackbar from '../components/NetworkSnackbar';
import SignIn from '../views/SignIn';

const mapStateToProps = state => ({
  themeName: state.user.themeName,
  authenticated: state.auth.authenticated,
  error: state.auth.failure,

  isLoadingProfile: isLoadingProfile(state),
});
// const mapDispatchToProps = dispatch => ({
//   handleAuthentication: (path, message) => {
//     dispatch(actions.auth.request(path, message));
//   },
// });
const Dashboard = loadable(() =>
  import(/* webpackChunkName: 'Dashboard' */ '../views/Dashboard')
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
    const { themeName, authenticated, isLoadingProfile } = this.props;
    const customTheme = themeProvider(themeName);

    console.log(` auth ${authenticated}`);
    // console.log('theme:', customTheme);
    console.log(`auth ${JSON.stringify(this.state)}`);

    if (isLoadingProfile) {
      return (
        <Paper elevation={4}>
          <Typography variant="h3">Authenticating.</Typography>
          <Spinner loading />
        </Paper>
      );
    }

    // if (error) {
    //   return <ErrorPanel error={error} />;
    // }

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
            <Switch>
              <Route path="/pg/resources" component={Resources} />
              <Route path="/pg/exports" component={Exports} />
              <Route path="/pg/imports" component={Imports} />
              <Route path="/pg/signin" component={SignIn} />
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
