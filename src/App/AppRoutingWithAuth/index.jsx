import React, { useEffect, useState } from 'react';
import { withRouter, Redirect, useLocation, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectors } from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';

export function AppRoutingWithAuth({children}) {
  const location = useLocation();
  const history = useHistory();
  const { pathname: currentRoute, search } = location;
  const [hasPageReloaded, setHasPageReloaded] = useState(false);
  const isMFAAuthRequired = useSelector(selectors.isMFAAuthRequired);
  const isSignInRoute = location.pathname.split('?')[0] === getRoutePath('signin');
  const isConcurPage = location.pathname.startsWith('/concurconnect');
  const shouldShowAppRouting = useSelector(selectors.shouldShowAppRouting);
  const isAuthInitialized = useSelector(selectors.isAuthInitialized);
  const isSessionExpired = useSelector(selectors.isSessionExpired);
  const isAuthenticated = useSelector(selectors.isAuthenticated);
  const isUserLoggedOut = useSelector(selectors.isUserLoggedOut);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!isAuthInitialized && !hasPageReloaded) {
      if (!isSignInRoute) {
        history.replace({
          search: isConcurPage ? '?application=concur' : search,
          state: { attemptedRoute: currentRoute, search },
        });
        dispatch(actions.auth.initSession());
      }
    }

    if (!hasPageReloaded) {
      dispatch(actions.app.clearError());
    }
    setHasPageReloaded(true);
  }, [hasPageReloaded, currentRoute, history, search, isAuthInitialized, dispatch, isSignInRoute, isConcurPage]);

  // this selector is used by the UI to hold off rendering any routes
  // till it determines the auth state
  if (isAuthenticated) {
    if (isSignInRoute) {
      const { state: routeState } = location;
      const redirectedTo = (routeState && routeState.attemptedRoute) || getRoutePath('');

      return <Redirect push={false} to={{ pathname: redirectedTo, search: routeState?.search }} />;
    }

    return children;
  }
  if (!isSessionExpired && !isSignInRoute && !isMFAAuthRequired && (isAuthInitialized || isUserLoggedOut)) {
    return (
      <Redirect
        push={false}
        to={{
          pathname: getRoutePath('signin'),
          state: location.state,
        }}
      />
    );
  }
  if (!shouldShowAppRouting && !isSignInRoute) return null;

  return children;
}

// we need to create a HOC with withRouter otherwise the router context will
// go missing when using connect and this can result in the Path component not
// being able to make matches to the url provided
export default withRouter(AppRoutingWithAuth);

