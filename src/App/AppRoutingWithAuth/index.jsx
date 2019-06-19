import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
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

function AppRoutingWithAuth(props) {
  const [componentMounted, setComponentMounted] = useState(false);

  useEffect(() => {
    const { initSession, isAuthInitialized, location, history } = props;
    const { pathname: currentRoute } = location;

    // We want to skip the render prior to the initial mount of
    // the component hence using this state componentMounted
    setComponentMounted(true);

    if (!isAuthInitialized) {
      if (currentRoute !== getRoutePath('signin'))
        history.push({
          state: { attemptedRoute: currentRoute },
        });
      initSession();
    }
  }, []);

  const {
    shouldShowAppRouting,
    isAuthenticated,
    location,
    isSessionExpired,
  } = props;
  const isSignInRoute = location.pathname === getRoutePath('signin');

  // this selector is used by the UI to hold off rendering any routes
  // till it determines the auth state
  if (!shouldShowAppRouting || !componentMounted) return null;

  if (isAuthenticated) {
    if (isSignInRoute) {
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

  if (!isSessionExpired && !isSignInRoute) {
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

// we need to create a HOC with withRouter otherwise the router context will
// go missing when using connect and this can result in the Path component not
// being able to make matches to the url provided
export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AppRoutingWithAuth)
);
