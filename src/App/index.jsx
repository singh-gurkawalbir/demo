import { hot } from 'react-hot-loader';
import { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { MuiThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { BrowserRouter } from 'react-router-dom';
import AppRoutingWithAuth from './AppRoutingWithAuth';
import * as selectors from '../reducers';
import FontStager from '../components/FontStager';
import AppBar from './AppBar';
import themeProvider from '../themeProvider';
import NetworkSnackbar from '../components/NetworkSnackbar';
import AuthDialog from '../components/AuthDialog';

const mapStateToProps = state => ({
  reloadCount: selectors.reloadCount(state),
  themeName: selectors.themeName(state),
  isAllLoadingCommsAboveThresold: selectors.isAllLoadingCommsAboveThresold(
    state
  ),
});
let timer = null;

@hot(module)
class App extends Component {
  static propTypes = {
    store: PropTypes.object,
  };

  // TODO: authenticated should be in our redux session store...
  // we need to create a new action creator and reducer for this.
  state = {
    showSnackBar: false,
  };

  shouldShowNetworkSnackBar = () => {
    // Should show failure
    const { isAllLoadingCommsAboveThresold } = this.props;
    const { showSnackBar } = this.state;
    let shouldShow = true;

    // should show if all comm activities are below the threshold.
    shouldShow = isAllLoadingCommsAboveThresold;
    // Prevent calling a setstate all the time ...
    // this would trigger a rerender unnecessarily.
    // could be done through using shouldComponentUpdate
    // nextState but we have to define entire behavior
    // of should rerender and might be an expensive operation
    // performing comparisons against other props

    if (showSnackBar !== shouldShow)
      this.setState({ showSnackBar: shouldShow });
  };
  componentDidMount() {
    // start the timer
    // selector show network snackbar
    // check condition to show network snackbar or not

    timer = setInterval(this.shouldShowNetworkSnackBar, 50);
  }

  componentDidUnMount() {
    // start the timer
    clearInterval(timer);
  }

  render() {
    const { showSnackBar } = this.state;
    const { themeName, reloadCount } = this.props;
    const customTheme = themeProvider(themeName);

    // increment key to remount the app
    return (
      <MuiThemeProvider key={reloadCount} theme={customTheme}>
        <FontStager />
        <CssBaseline />
        <BrowserRouter>
          <Fragment>
            {showSnackBar && <NetworkSnackbar />}
            <AppBar themeName={themeName} />
            <AuthDialog />
            <AppRoutingWithAuth />
          </Fragment>
        </BrowserRouter>
      </MuiThemeProvider>
    );
  }
}

// prettier-ignore
export default connect(mapStateToProps)(App);
