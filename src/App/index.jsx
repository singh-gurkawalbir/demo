import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import AppRouting from './AppRouting';
// import SignIn from '../views/SignIn';
// import CircularProgress from '@material-ui/core/CircularProgress';
import {
  themeName,
  authenticationErrored,
  isUserLoggedOut,
  isAuthInitialized,
} from '../reducers';
import FontStager from '../components/FontStager';
import AppBar from './AppBar';
import themeProvider from '../themeProvider';
import AppDrawer from './AppDrawer';
import NetworkSnackbar from '../components/NetworkSnackbar';
import AuthDialog from '../components/AuthDialog';
import actions from '../actions';

const mapStateToProps = state => ({
  themeName: themeName(state),
  isAuthInitialized: isAuthInitialized(state),
  isAuthErrored: !!authenticationErrored(state),
  isUserLoggedOut: isUserLoggedOut(state),
});
const mapDispatchToProps = dispatch => ({
  initSession: () => {
    dispatch(actions.auth.initSession());
  },
});

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
    const { themeName, isAuthInitialized, isUserLoggedOut } = this.props;
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
            {(isAuthInitialized || !isUserLoggedOut) && <AppRouting />}
          </Fragment>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps,mapDispatchToProps)(App);
