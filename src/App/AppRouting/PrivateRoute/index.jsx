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
    const { location } = this.props;
    const params = new URLSearchParams(location.search);
    const redirectToRoute = params.get('redirectTo');
    const {
      component: Component,
      isAuthenticated,
      redirectTo = redirectToRoute || getRoutePath('signin'),
      isSessionExpired,
      rest,
    } = this.props;

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
                state: { from: props.location },
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
