import { Redirect, Route } from 'react-router-dom';
import { Component } from 'react';
import { hot } from 'react-hot-loader';

@hot(module)
export default class PrivateRoute extends Component {
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
