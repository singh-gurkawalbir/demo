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
        history.replace({
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
  const isSignUpRoute = location.pathname === getRoutePath('signup');
  const isForgotPasswordRoute = location.pathname === getRoutePath('request-reset');
  const isMfaVerifyRoute = location.pathname === getRoutePath('mfa/verify');
  const isMfaHelpRoute = location.pathname === getRoutePath('mfa-help');
  const isResetPasswordRoute = location.pathname.split('/')[1] === 'reset-password';
  const isSetPasswordRoute = location.pathname.split('/')[1] === 'set-initial-password';
  const isChangeEmailRoute = location.pathname.split('/')[1] === 'change-email';

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
  if (!isSessionExpired && !isSignInRoute && !isSignUpRoute && !isForgotPasswordRoute && !isResetPasswordRoute && !isSetPasswordRoute && !isChangeEmailRoute && !isMfaVerifyRoute && !isMfaHelpRoute) {
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
  if (!shouldShowAppRouting) return null;

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
