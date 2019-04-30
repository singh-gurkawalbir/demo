import { Redirect, Route, withRouter } from 'react-router-dom';
import { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { isSessionExpired, isAuthenticated } from '../../../reducers';
import getRoutePath from '../../../utils/routePaths';

const mapStateToProps = state => ({
  isAuthenticated: isAuthenticated(state),
  isSessionExpired: isSessionExpired(state),
});

@hot(module)
class PrivateRoute extends Component {
  render() {
    const {
      component: Component,
      isAuthenticated,
      redirectTo = getRoutePath('signin'),
      isSessionExpired,
      search,
      ...rest
    } = this.props;
    const redirectToRoute = this.props.location.search;
    // If i get a query parameter let me pass the query parameter
    // to there
    // const params = new URLSearchParams(this.props.location.search);
    // const redirectToRoute = params.get('redirectTo');

    // if (redirectToRoute) {
    //   this.props.history.push({ search: `?redirectTo=${redirectToRoute}` });
    // }

    return (
      <Route
        {...rest}
        exact
        render={props =>
          isAuthenticated || isSessionExpired ? (
            <Component {...props} />
          ) : (
            <Redirect
              to={{
                pathname: redirectTo,
                search: redirectToRoute,
              }}
            />
          )
        }
      />
    );
  }
}

// prettier-ignore
export default withRouter(connect(mapStateToProps,null)(PrivateRoute));
