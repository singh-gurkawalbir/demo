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
  isUserLoggedOut: !selectors.isUserLoggedIn(state),
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
  appendRedirectQueryParam = (queryParams, redirectRoute) => {
    const params = new URLSearchParams(queryParams);

    params.append('redirectTo', redirectRoute);

    return params.toString();
  };
  getRedirectToParam = queryParams => {
    const params = new URLSearchParams(queryParams);

    return params.get('redirectTo');
  };

  deletedRedirectParamQuery = queryParams => {
    const params = new URLSearchParams(queryParams);

    params.delete('redirectTo');

    return params.toString();
  };
  componentWillMount() {
    const { initSession, isAuthInitialized, location, history } = this.props;
    const { pathname: currentRoute } = location;

    if (!isAuthInitialized) {
      if (currentRoute !== getRoutePath('signin'))
        history.push({
          search: this.appendRedirectQueryParam(location.search, currentRoute),
        });
      initSession();
    }
  }

  render() {
    const {
      shouldShowAppRouting,
      isAuthenticated,
      isUserLoggedOut,
      location,
      isSessionExpired,
      // history,
    } = this.props;
    // this selector is used by the UI to hold off rendering any routes
    // till it determines the auth state

    if (!shouldShowAppRouting) return null;

    if (isAuthenticated) {
      if (location.pathname === getRoutePath('signin')) {
        const redirectedTo = this.getRedirectToParam(location.search) || '/pg';

        return (
          <Redirect
            to={{
              pathname: redirectedTo,
              search: this.deletedRedirectParamQuery(location.search),
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
            search: isUserLoggedOut
              ? this.deletedRedirectParamQuery(location.search)
              : location.search,
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
