import { Redirect, Route } from 'react-router-dom';
import { Component } from 'react';
import { hot } from 'react-hot-loader';

@hot(module)
export default class PrivateRoute extends Component {
  render() {
    const {
      component: Component,
      authenticated,
      redirectTo = '/pg/signin',
      rest,
    } = this.props;

    return (
      <Route
        {...rest}
        render={props =>
          authenticated ? (
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
