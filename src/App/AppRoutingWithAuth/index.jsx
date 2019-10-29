import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Redirect, useHistory, useLocation } from 'react-router-dom';
import * as selectors from '../../reducers';
import actions from '../../actions';
import getRoutePath from '../../utils/routePaths';

export default function AppRoutingWithAuth({ children }) {
  const history = useHistory();
  const location = useLocation();
  const { pathname: currentRoute } = location;
  const isSignInRoute = location.pathname === getRoutePath('signin');
  const dispatch = useDispatch();
  const [hasPageReloaded, setHasPageReloaded] = useState(false);
  const shouldShowAppRouting = useSelector(state =>
    selectors.shouldShowAppRouting(state)
  );
  const isAuthInitialized = useSelector(state =>
    selectors.isAuthInitialized(state)
  );
  const isSessionExpired = useSelector(state =>
    selectors.isSessionExpired(state)
  );
  const isAuthenticated = useSelector(state =>
    selectors.isAuthenticated(state)
  );

  useEffect(() => {
    if (!isAuthInitialized && !hasPageReloaded) {
      if (currentRoute !== getRoutePath('signin'))
        history.push({
          state: { attemptedRoute: currentRoute },
        });

      dispatch(actions.auth.initSession());
    }

    if (!hasPageReloaded) {
      dispatch(actions.app.clearError());
    }

    setHasPageReloaded(true);
  }, [hasPageReloaded, currentRoute, history, isAuthInitialized, dispatch]);

  // this selector is used by the UI to hold off rendering any routes
  // till it determines the auth state
  if (!shouldShowAppRouting) return null;

  if (isAuthenticated) {
    if (isSignInRoute) {
      const { state: routeState } = location;
      const redirectedTo = (routeState && routeState.attemptedRoute) || '/pg';

      return <Redirect to={redirectedTo} />;
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
