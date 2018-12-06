import { Redirect, Route, withRouter } from 'react-router-dom';
import { Component } from 'react';
import { hot } from 'react-hot-loader';
import { connect } from 'react-redux';
import { isSessionExpired, isAuthenticated } from '../../../reducers';

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
      redirectTo = '/pg/signin',
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

export default withRouter(
  connect(
    mapStateToProps,
    null
  )(PrivateRoute)
);
