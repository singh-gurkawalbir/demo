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
    clearAppError,
    ...rest
  } = props;
  const { pathname: currentRoute } = location;
  const [hasPageReloaded, setHasPageReloaded] = useState(false);

  useEffect(() => {
    if (!isAuthInitialized && !hasPageReloaded) {
      if (currentRoute !== getRoutePath('signin'))
        history.push({
          state: { attemptedRoute: currentRoute },
        });
      initSession();
    }

    if (!hasPageReloaded) clearAppError();
    setHasPageReloaded(true);
  }, [
    hasPageReloaded,
    currentRoute,
    history,
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
      const redirectedTo = (routeState && routeState.attemptedRoute) || '/pg';

      return <Redirect to={redirectedTo} />;
    }

    return <AppRouting {...rest} />;
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

  return <AppRouting {...rest} />;
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
