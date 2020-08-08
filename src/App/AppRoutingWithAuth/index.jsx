import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect } from 'react-router-dom';
import { selectors } from '../../reducers';
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
  clearAppError: () => {
    dispatch(actions.app.clearError());
  },
});

export function AppRoutingWithAuth(props) {
  const {
    initSession,
    isAuthInitialized,
    location,
    history,
    children,
    clearAppError,
  } = props;
  const { pathname: currentRoute, search } = location;
  const [hasPageReloaded, setHasPageReloaded] = useState(false);

  useEffect(() => {
    if (!isAuthInitialized && !hasPageReloaded) {
      if (currentRoute !== getRoutePath('signin')) {
        history.push({
          search,
          state: { attemptedRoute: currentRoute, search },
        });
      }
      initSession();
    }

    if (!hasPageReloaded) clearAppError();
    setHasPageReloaded(true);
  }, [
    hasPageReloaded,
    currentRoute,
    history,
    search,
    initSession,
    isAuthInitialized,
    clearAppError,
  ]);

  const { shouldShowAppRouting, isAuthenticated, isSessionExpired } = props;
  const isSignInRoute = location.pathname === getRoutePath('signin');

  // this selector is used by the UI to hold off rendering any routes
  // till it determines the auth state
  if (!shouldShowAppRouting) return null;

  if (isAuthenticated) {
    if (isSignInRoute) {
      const { state: routeState } = location;
      const redirectedTo = (routeState && routeState.attemptedRoute) || getRoutePath('');

      return <Redirect to={{ pathname: redirectedTo, search: routeState?.search }} />;
    }

    return children;
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

  return children;
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
