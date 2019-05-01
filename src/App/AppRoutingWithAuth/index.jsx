import { Component } from 'react';
import { connect } from 'react-redux';
import { hot } from 'react-hot-loader';
import { withRouter, Redirect } from 'react-router-dom';
import AppRouting from '../AppRouting';
import * as selectors from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';

const mapStateToProps = state => ({
  shouldShowAppRouting: selectors.shouldShowAppRouting(state),
  isAuthInitialized: selectors.isAuthInitialized(state),
  isSessionExpired: selectors.isSessionExpired(state),
  isAuthenticated: selectors.isAuthenticated(state),
});
const mapDispatchToProps = dispatch => ({
  initSession: () => {
    dispatch(actions.auth.initSession());
  },
});

@hot(module)
class AppRoutingWithAuth extends Component {
  componentWillMount() {
    const { initSession, isAuthInitialized, location, history } = this.props;
    const { pathname: currentRoute } = location;

    if (!isAuthInitialized) {
      if (currentRoute !== getRoutePath('signin'))
        history.push({
          state: { attemptedRoute: currentRoute },
        });
      initSession();
    }
  }

  render() {
    const {
      shouldShowAppRouting,
      isAuthenticated,
      location,
      isSessionExpired,
    } = this.props;
    // this selector is used by the UI to hold off rendering any routes
    // till it determines the auth state

    if (!shouldShowAppRouting) return null;

    if (isAuthenticated) {
      if (location.pathname === getRoutePath('signin')) {
        const { state: routeState } = location;
        const redirectedTo = (routeState && routeState.attemptedRoute) || '/pg';

        return (
          <Redirect
            to={{
              pathname: redirectedTo,
            }}
          />
        );
      }

      return <AppRouting />;
    }

    if (!isSessionExpired && location.pathname !== getRoutePath('signin')) {
      return (
        <Redirect
          to={{
            pathname: getRoutePath('signin'),
            state: location.state,
          }}
        />
      );
    }

    return <AppRouting />;
  }
}

// we need to create a HOC with withRouter otherwise the router context will
// go missing when using connect and this can result in the Path component not
// being able to make matches to the url provided
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppRoutingWithAuth)
);
